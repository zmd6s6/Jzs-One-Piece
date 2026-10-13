---
title: K3s 双集群实战知识库：事故、原理与纪律
description: 从零搭建 K3s 单/双节点集群、镜像流水线与运维体系过程中踩过的高价值坑的原理级复盘：JVM 容器内存、薄 jar 启动、无 registry 分发、DNS 名字源、探针与声明式纪律。
category: devops
tags:
  - k3s
  - kubernetes
  - jvm
  - docker
  - cicd
  - postmortem
status: active
created: 2026-10-13
updated: 2026-10-13
---

# K3s 双集群实战知识库：事故、原理与纪律

> 来源：一次轻量集群与交付体系的搭建过程。名词不熟先查[术语表](./k8s-glossary.md)；背景与取舍见[选型决策记录](./k3s-decision-records.md)。
> 记录标准：根因一句能说清、易于复发、有通用价值。文中服务名已脱敏（gateway / platform / pacs 泛指三类 JVM 服务：网关、平台、影像处理）。

## 0. 全景：所有事故都落在三条主线上

1. **镜像与启动**——jar 怎么打的，容器入口怎么写的；
2. **集群与依赖**——名字怎么解析、镜像怎么到节点、探针怎么判活；
3. **纪律与流程**——集群状态是否声明式、变更是否可回滚、是否有门禁。

---

## 一、JVM 容器内存学：三起 OOM 的完整谱系

### 1.1 原理：容器里的 JVM 到底吃多少内存

```
JVM 总占用 = 堆(-Xmx) + Metaspace + 堆外(direct memory，Netty 类框架的大头) + 线程栈 + GC 开销
容器 limit 是【总和】的天花板，不是堆的天花板。
```

三起事故恰好覆盖三种错法：

| 事故 | 参数组合 | 后果 |
|---|---|---|
| A：堆超 limit | limit 512Mi，未设 env → 镜像默认 `-Xms1g -Xmx2g` | `OOMKilled (exit 137)`，每轮活 14 秒，重启 437 次 |
| B：Metaspace 封死 | `-Xmx6g` 很富裕，但 `-XX:MaxMetaspaceSize=192m` | `OutOfMemoryError: Metaspace`（堆根本没用完） |
| C：默认参数贴脸 | 未显式设置 JAVA_OPTS = 信任镜像里烘焙的值 | 与 limit 长期不匹配，负载一上来就炸 |

### 1.2 判读要点

- `Last State: OOMKilled, Exit Code 137` 且**日志无异常即死** → 内核杀的，查 JVM 参数与 limit；
- 日志明确 `OutOfMemoryError: Metaspace` → 查 `MaxMetaspaceSize` 上限，**堆大小与此无关**；
- 事故 B 的教训：`-XX:MaxMetaspaceSize` 从别的服务配置里抄数字非常危险——重类加载的应用（ORM 动态代理、报告生成库等）需要 512m 级别。

### 1.3 口径与根治

| 服务类型 | limit | JAVA_OPTS 示例 |
|---|---|---|
| 轻量网关（Netty） | 1Gi | `-Xms256m -Xmx512m -XX:MaxMetaspaceSize=192m -XX:MaxDirectMemorySize=256m` |
| 平台服务 | 2Gi | `-Xms512m -Xmx1g -XX:MaxMetaspaceSize=384m -XX:MaxDirectMemorySize=256m` |
| 重业务（影像/报告） | 2Gi | `-Xms512m -Xmx1g -XX:MaxMetaspaceSize=512m -XX:MaxDirectMemorySize=256m` |

- 铁律：**堆 + Metaspace + 堆外 < limit**，三者必须一起看、一起改；
- 更彻底的方案：镜像默认值改用 `-XX:MaxRAMPercentage=70 -XX:InitialRAMPercentage=50`，堆随 limit 自适应，这类问题整族消失；
- 配套：加 `-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=...`，事后有现场。

---

## 二、镜像布局与启动方式：一次容器启动失败的分析

### 2.1 原理：Spring Boot 应用的三种产物形态

| 形态 | MANIFEST | `java -jar` | 说明 |
|---|---|---|---|
| fat jar | Main-Class=JarLauncher，依赖嵌在 jar 内 | ✅ | 单文件大产物 |
| thin jar（NONE 布局） | Main-Class=业务主类 + `Class-Path: lib/xxx.jar...` 清单 | ✅（靠 manifest Class-Path） | 依赖在旁边 lib/ |
| thin jar（ZIP 布局） | Main-Class=**PropertiesLauncher** | 启动失败（必须用 `-Dloader.path=./lib` 指路） | 裸 `java -jar` 时依赖一个都加载不到 |

**兼容矩阵**（同一份薄 jar 配合不同启动方式的结果；如何取舍见 [ADR 第 4 节](./k3s-decision-records.md)）：

| 启动方式 ＼ 布局 | NONE | ZIP |
|---|---|---|
| `java -cp 'app.jar:lib/*' 主类` | ✅ | ✅（布局免疫） |
| `java -Dloader.path=./lib -jar` | ✅ | ✅ |
| 裸 `java -jar` | 能跑 | 启动失败 |

### 2.2 事故：CI 里内联的 Dockerfile

- **现象**：发版镜像起来即崩，`NoClassDefFoundError`，调用栈入口是 `PropertiesLauncher.main`；
- **根因链**：裸机启动脚本本来就带 `-Dloader.path=./lib` → CI 的内联 Dockerfile 用裸 `java -jar` 时**漏抄了这一句** → ZIP 布局薄 jar 的依赖全在镜像里却一个没加载；同一条 CI 打的另一个服务恰好是 NONE 布局，裸 `java -jar` 侥幸活着，掩盖了问题；
- **修复**：容器入口统一 `java -cp '/app/*:/app/lib/*' 主类`——显式 classpath 对任何布局免疫；
- **预防**：
  1. **Dockerfile 只能住在源码仓**，CI 禁止内联（内联 = 和代码不同版本演进 = 漂移）；
  2. classpath 用通配（`/app/*`），**禁止硬编码带版本的 jar 文件名**——版本一升启动即断；
  3. 发版产物 push 之前做一次 `docker run` + 健康端点冒烟。

---

## 三、无 Registry 的镜像分发

### 3.1 原理

`imagePullPolicy: IfNotPresent` 的语义是"本地有就不拉"；**本地没有时它会去远端 registry 拉**——而离线环境里这个"远端"是 Docker Hub：不通 → 超时 → 重试 → `ImagePullBackOff` 无限挂。

### 3.2 事故

双节点集群，新版本镜像只导入了控制面节点；另一节点的副本 **ImagePullBackOff 挂了 5 小时**，事件里 kubelet 反复 `Pulling image` + `dial tcp ...:443 i/o timeout`。同服务在好节点上的副本 Running，极具迷惑性。

### 3.3 两种模式与选择

| 模式 | 适用 | 要点 |
|---|---|---|
| 私有 registry（registry:2） | 双节点以上 / 频繁发版 | 集群内部署，NodePort 暴露；**每个节点**写 `/etc/rancher/k3s/registries.yaml`（明文 HTTP 必须显式 `http://`）并 `systemctl restart k3s` |
| 离线导入 | 单节点 / 断网 / 低频 | 每个节点 `ctr -n k8s.io images import x.tar` |

- **门禁（G2）**：apply 之前，**逐节点**执行 `ctr images ls -q | grep <tag>` 确认有输出——把它写成 preflight 脚本；
- 保留 N-1 版本镜像与 tar，否则等于放弃回滚；注意 k3s 磁盘紧张时会 GC 未使用镜像。

---

## 四、集群外依赖的"名字源"：DNS 学四则

### 4.1 ExternalName 指向 IP 是死路

ExternalName 只回一条 **CNAME**，目标是 IP 字面量时无法合成 A 记录 → CoreDNS 直接回 **NXDOMAIN**。（更早的翻车版：`externalName` 写成了自己的名字，CNAME 自循环。）

**正解：headless Service + 手工 Endpoints**（同名绑定、无 selector）：

```yaml
apiVersion: v1
kind: Service
metadata: { name: dbsvr }
spec:
  clusterIP: None
  ports: [{ name: oracle, port: 1521 }, { name: redis, port: 6379 }]
---
apiVersion: v1
kind: Endpoints        # 必须与 Service 同名
metadata: { name: dbsvr }
subsets:
- addresses: [{ ip: 10.0.0.56 }]   # 集群外数据库/缓存真实地址
  ports:
  - { name: oracle, port: 1521, protocol: TCP }
  - { name: redis, port: 6379, protocol: TCP }
```

业务配置统一写名字（`dbsvr`），换库只改 Endpoints 的 IP。

### 4.2 其余三则

- **负缓存**：CoreDNS 对 NXDOMAIN 有 ~30s 负缓存——刚重建完名字解析不到，**等半分钟再判死刑**；
- **节点 `/etc/hosts` 与 Pod 无关**：Pod 的 resolv.conf 走 CoreDNS，节点 hosts 只对本机进程生效（k3s 有 hosts→NodeHosts 同步机制但不可靠，别依赖）；
- **改 kubeconfig 的 context 名时**，`- name:`、`context.cluster:`、`context.user:` 三处引用必须一起改——只改 name 会导致客户端（Lens/FreeLens 类）校验报 `No valid cluster object provided`，而且拿证书直接 curl API 是通的，极易误判。

---

## 五、探针设计学：聚合健康端点会杀死好容器

- **原理**：`/actuator/health`（聚合）会被**任何一个**坏组件（如注册中心客户端连不上）拖成 503；把它配成 liveness → 探针反复杀掉进程健康的容器 → CrashLoop，**自愈机制变成自杀机制**；
- **正解**：liveness/readiness 分别打 `/actuator/health/liveness`、`/actuator/health/readiness`（health group，只反映存活/就绪状态本身；Spring Boot 在 K8s 里默认暴露）；
- **慢启动保护**：Spring 冷启动可达数分钟（实测 229s），用 `startupProbe`（period 10s × failureThreshold 60 = 10 分钟容忍）替代大 initialDelay；
- **"Running 是谎言"**：没有探针时 Pod 显示 1/1 Running 与"服务可用"毫无关系——曾有一服务 DB 断连数日照常绿灯。验收看组端点 + 业务冒烟，不看绿灯。

---

## 六、配置管理四则

1. **subPath 挂载不热更新**：改了 ConfigMap，Pod 里文件不变；必须 `rollout restart`；
2. **双轨漂移**：同一份口令同时存在于 ConfigMap（明文）和 Secret，改一漏一是迟早的事——收敛到单一来源；
3. **声明式纪律**：集群状态只能由仓里的清单渲染产生；`kubectl edit`/`sed 改线上`/只改集群不改仓，都会在下一次 apply 时静默回退；
4. **kustomize 的两个坑**：overlay 引用 base 目录之外的单个**文件**会被安全限制拒绝（复制或引目录）；`images: newName/newTag` 是切 registry 前缀与版本的正道，别用 sed。

---

## 七、CI/CD 与版本纪律

### 7.1 一起不易察觉的案例：CI 从另一个同名仓库构建

- **现象**：发版产物版本号与源码仓 HEAD 对不上；
- **根因**：CI 里源码 URL 的 group 路径写错，但那个错误路径**真实存在另一个旧副本仓库**（HTTP 200 可达 ≠ 是同一个仓）；新旧两仓同名，构建一切正常；
- **教训**：CI 的仓库地址要人工核对两遍；构建日志里的版本号/提交号要和发布单对得上；旧副本仓要归档或删除。

### 7.2 产物与流程

- **产物层数最小化**：`docker save` 的 tar 不要再包一层 zip——下载方还要解压才能 `ctr import`；
- **发版七步序列**（每步有门禁）：准备（定 tag/回滚版本）→ 产物（来源可信）→ **分发到全节点（G2）** → 配置核对 → 声明式 apply → **验收六条（G5）** → 观察窗 + 留痕；
- **回滚三式**：`rollout undo`（最快）/ tag 退回旧值再 apply（可留痕）/ 整环境 `delete -k` 重放（灾难级）；
- **禁止**：`kubectl set image` 直改集群（绕过仓与留痕）、带着 G2 未过就 apply、没确认旧镜像还在就发新版。

---

## 八、排障方法论：L0-L6 漏斗

15 分钟内**定位到层**（不是修好）：

```
L0 分类（30秒）  Pod起不来→L3 / 功能不对→L5·L6 / 全不通→L1
L1 集群层        nodes ready、kube-system、影响面是全部还是单个
L2 节点层        磁盘/内存、本节点有没有目标镜像
L3 负载层        describe 看 Last State + Events + previous logs（★死因元凶都在 Last State）
L4 配置层        cm 内容、挂载是否生效、subPath 是否重启过
L5 依赖层        名字解析 → 端口连通 → 中间件健康 → 服务注册
L6 应用层        health 组端点、错误日志聚合（sort | uniq -c）
```

**两个高价值判读**：

- `Last State` 一眼定因：`OOMKilled`→JVM/limit；`Error`+`NoClassDefFound`→镜像入口；`ImagePullBackOff`→镜像分发；`Unhealthy`→探针；
- **端口测试的两种失败语义不同**：秒回 `connection refused` = 没人监听（服务没起/版本不对/端口错）；`timeout` = 中间网络挡（即使本机防火墙关了，路由器/安全组仍可能挡）。**"8848 通"不代表 "9848 通"**——注意 gRPC 类端口（HTTP 端口 +1000）经常被单独放行遗漏。

**升级上报条件**（满足其一就停手上报）：涉及集群层 30 分钟未恢复 / 需要重建数据 / 同现象 2 小时内 ≥3 次 / 需要变更网络与存储基础设施。

---

## 附：一页速查

| 症状 | 根因 | 一句话修法 |
|---|---|---|
| NoClassDefFoundError + PropertiesLauncher 调用栈 | 裸 `java -jar` × ZIP 薄 jar | 入口改 `java -cp '/app/*:/app/lib/*'` |
| OOMKilled 137，无异常日志 | 堆超 limit | 显式 JAVA_OPTS，三项之和 < limit |
| OutOfMemoryError: Metaspace | MaxMetaspaceSize 封太小 | 提到 512m 级或删除该参数 |
| 单节点副本 ImagePullBackOff 数小时 | 镜像没分发到该节点 | 逐节点 import + preflight 校验 |
| NXDOMAIN（ExternalName 指 IP） | CNAME 无法合成 A | headless Service + Endpoints |
| 刚建的对象解析不到 | CoreDNS 负缓存 | 等 30~60s |
| 改了配置不生效 | subPath 不热更新 | rollout restart |
| 探针周期性杀好容器 | liveness 打聚合 health | 改 health/liveness 组端点 |
| 长连接服务"Running"但不可用 | 无探针假健康 | 组端点探针 + 业务冒烟 |
| 发版产物版本对不上源码 | CI 连了同名旧仓 | 核对仓库地址，归档旧仓 |
| kubeconfig 客户端拒收 | 改名漏了 cluster/user 引用 | 三处一起改 + 语义校验 |

## Related

- [Kubernetes / 容器交付 术语表](./k8s-glossary.md)
- [K3s 体系选型决策记录（ADR）](./k3s-decision-records.md)
- [K3s/K8s 组件原理篇](./k3s-internals.md)
- [实践项目：容器化交付体系的搭建](../projects/medical-it-delivery-practice/README.md)

## References

- Spring Boot Docs: Container Extensions（RAMPercentage / 探针端点）
- Kubernetes Docs: Service（headless / ExternalName）、Image Pull Policy
- K3s Docs: Private Registry Configuration（registries.yaml）
