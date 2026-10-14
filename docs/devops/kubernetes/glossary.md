---
title: Kubernetes / 容器交付 术语表
author: zmd6s6
description: 阅读本知识库 K8s、容器、JVM、CI/CD 相关文章时的名词速查：一句话解释 + 常见误解。
category: devops
tags:
  - kubernetes
  - glossary
  - reference
status: active
created: 2026-10-13
updated: 2026-10-13
---

# Kubernetes / 容器交付 术语表

> 读文章遇到不认识的词，先来这里查。想系统补底层知识，按域走：[计算机网络](../../networking/README.md)（DNS/端口/路由/NAT）、[后端](../../backend/README.md)（JVM 内存/classpath/Oracle 解析）。每条给"一句话解释"，必要时补"容易误解的点"。
> 相关文章：[学习路径](./README.md)、[机制原理](./internals/README.md)、[事故复盘](../../projects/medical-platform/incidents/README.md)、[选型决策](../../projects/medical-platform/decisions/README.md)、[项目实践](../../projects/medical-platform/README.md)。

## 一、集群与组件

| 术语 | 一句话解释 | 容易误解的点 |
|---|---|---|
| **Kubernetes / K8s** | 容器编排系统：你声明"要什么状态"，它负责让它变成现实（调度、重启、扩缩） | 它不构建镜像、不写业务代码，只管运行 |
| **K3s** | 一个"打包好"的轻量 K8s 发行版：单二进制，内含运行时、网络、DNS、存储等组件 | 不是阉割版玩具，生产可用；但默认组件是选好的，要认识它们 |
| **控制面（control plane）** | 集群大脑：API Server（唯一入口）、调度器、控制器 | 与"工作节点"区分：大脑 vs 干活的 |
| **kubelet** | 每个节点上的"代理人"：负责把 Pod 拉起来、做健康检查、上报状态 | 报"Running"只是它说的，不代表业务可用 |
| **containerd** | 真正运行容器的运行时（k3s 内嵌）；K8s 早已不直接用 Docker | 有 containerd ≠ 有 docker 命令 |
| **ctr / crictl** | 直接操作 containerd 的命令行工具（`k3s ctr -n k8s.io ...`） | 忘写 `-n k8s.io` 会"看不到任何镜像"，因为镜像存在该命名空间下 |
| **OCI** | 容器镜像的标准打包格式；`docker save` 出来的 tar 就是 OCI 镜像 | 它已是"打包好的 tar"，再 zip 一层只是多一道工序 |
| **registry（镜像仓库）** | 存放镜像的服务器，如 `registry:2`、Harbor | 没有它，镜像要人工搬运到每个节点 |

## 二、工作负载与配置

| 术语 | 一句话解释 | 容易误解的点 |
|---|---|---|
| **Pod** | 最小运行单位，一个或多个容器共享网络与存储 | 一般不直接建 Pod，由 Deployment/StatefulSet 管理 |
| **Deployment** | 无状态工作负载：管理"同样的一批副本"，支持滚动更新/回滚 | Pod 名字带随机后缀，随时可能被替换 |
| **StatefulSet** | 有状态工作负载：每个副本有稳定名字和独立存储（PVC） | 删除重建时存储跟着副本走，但数据位置固定在节点 |
| **副本（replica）** | 同一工作负载的实例数 | 多副本不自动等于高可用：看是否落在不同节点 |
| **ConfigMap / Secret** | 配置与敏感配置的载体，挂进容器 | Secret 只是编码（base64）不加密；挂载方式影响是否热更新 |
| **subPath 挂载** | 只把 ConfigMap 里的一个文件挂进容器某路径 | **不随 ConfigMap 更新而刷新**，改完要重启 Pod |
| **PVC / PV** | 存储申请（PVC）与实际存储（PV） | 用 `local-path` 时 PV 就是某节点上的一个目录 |
| **local-path** | k3s 自带的简易存储插件：PVC = 节点本地目录 | **绑死节点**：Pod 漂到别的节点会看到空目录 |
| **探针 probe** | K8s 定期检查容器状态的机制：liveness（死后重启）、readiness（没好就不接流量）、startup（慢启动保护） | 探针打错端点会"杀掉好容器"或"放过坏容器" |
| **聚合健康端点 / health group** | `/actuator/health` 汇总所有组件；`/actuator/health/liveness|readiness` 只看存活/就绪本身 | 探针用聚合端点会被外部依赖拖垮 |
| **Service** | 给一组 Pod 一个固定访问名字/IP 的抽象 | 名字好记但只是入口，后端为空时它照样"存在" |
| **ClusterIP** | Service 的虚拟 IP：没有网卡持有它，靠 iptables 规则转发到某个 Pod | 虚拟 IP 在本机（节点）上也能访问 |
| **NodePort** | 在每个节点上开一个高位端口（30000+）暴露服务 | 端口全节点生效，不依赖 Pod 在哪个节点 |
| **headless Service** | 不给虚拟 IP 的 Service（`clusterIP: None`）：DNS 直接返回后端地址 | 指"集群外 IP"时常用，配合同名 Endpoints |
| **Endpoints** | Service 的后端地址列表（自动或手工维护） | 手工维护时"名字必须与 Service 完全一致"才生效 |
| **ExternalName** | Service 的另一种类型：只做 DNS 别名（返回 CNAME） | 目标写 IP 字面量时解析失败（CNAME 无法合成 IP 记录） |
| **kube-proxy** | 在每个节点上把 Service 规则翻译成 iptables 规则的程序 | 它坏了的表现是"ClusterIP 访问异常" |
| **CNI / flannel / VXLAN** | 容器网络插件；flannel 用 VXLAN 把跨节点 Pod 流量封装成 UDP 8472 | 跨节点不通（UDP 8472 被挡）时，同节点 Pod 却一切正常，极具迷惑性 |
| **CoreDNS** | 集群 DNS：把 Service 名解析成地址 | 有**负缓存**（约 30 秒）：改完解析对象别马上判定失败 |
| **ndots / search 域** | Pod 里解析短名时会按 search 域逐个尝试的规则（默认 ndots:5） | 短名能解析是它的功劳，查询次数变多也是它的代价 |
| **Ingress / traefik** | 七层入口（按域名/路径转发）；k3s 默认带 traefik | 只用 NodePort 时可以不用它 |
| **svclb（klipper）** | 给 LoadBalancer 型 Service 起的小 Pod，占用节点端口转发 | 看到 klipper 相关 Pod 不要慌，属正常组件 |
| **namespace** | 集群内的逻辑分区（隔离名字，不强隔离权限） | containerd 的 `-n k8s.io` 是它自己的命名空间，与 K8s namespace 是两回事 |

## 三、镜像、启动与 JVM

| 术语 | 一句话解释 | 容易误解的点 |
|---|---|---|
| **fat jar** | 把依赖也打进同一个 jar（单文件很大） | 与"薄 jar + lib 目录"是两种打包形态 |
| **thin jar（薄 jar）** | 只有自己的代码，依赖放在旁边 `lib/` 目录 | 需要启动方式配合才能找到依赖 |
| **NONE 布局 / ZIP 布局** | 薄 jar 的两种清单写法：前者主类是业务类（清单里带 Class-Path），后者主类是 `PropertiesLauncher` | ZIP 布局必须给 `loader.path`，否则依赖一个都加载不到 |
| **JarLauncher / PropertiesLauncher** | Spring Boot 的两种启动器（负责把依赖拼进类路径） | 报错里出现 PropertiesLauncher，说明用的是 ZIP 布局 |
| **classpath（-cp）** | 告诉 JVM"去哪找类"的路径列表 | `-cp 'x.jar:lib/*'` 的 `*` 会展开成该目录下所有 jar，因此不怕文件名带版本号 |
| **真实内存三件套** | 堆（Xmx）+ Metaspace + 堆外内存（direct） | 容器 limit 是三者之和的天花板，堆够不代表不 OOM |
| **Metaspace** | JVM 存放"类的元数据"的区域 | 被 `-XX:MaxMetaspaceSize` 封得太小会 OOM，且此时堆可能还空着 |
| **堆外内存 / direct memory** | JVM 在堆之外直接申请的内存（Netty 等框架大量使用） | 不计入 Xmx，但计入容器内存 |
| **cgroup** | Linux 限制进程组资源的机制，容器的 CPU/内存限制基于它 | JVM 10+ 会读 cgroup 限制来自动决定默认堆大小 |
| **MaxRAMPercentage** | 按容器 limit 的百分比设置堆上限的参数 | 只解决堆，不解决 Metaspace/堆外 |
| **OOMKilled（exit 137）** | 容器超过内存 limit 被内核杀掉 | 日志里往往没有任何异常，看 Pod 的 Last State 才知道 |
| **imagePullPolicy / IfNotPresent** | 镜像拉取策略："本地有就不拉" | 本地没有时会去远端拉——离线环境即超时 |
| **ImagePullBackOff** | 拉不到镜像导致的等待重试状态 | 常见于"镜像只导入了部分节点" |

## 四、交付与流程

| 术语 | 一句话解释 | 容易误解的点 |
|---|---|---|
| **kustomize / base / overlay** | 配置分层工具：base 放共性，overlay 放环境差异，渲染出最终 YAML | 无模板语言，靠叠加与补丁；改完可渲染出来先看再用 |
| **patch（strategic merge）** | 按"键"合并修改：容器按名字、env 按变量名 | 同名覆盖、异名追加，不会误伤既有项 |
| **rollout / rollout undo** | 滚动更新与其回滚命令 | undo 只能回到上一个 ReplicaSet，旧镜像得还在节点上 |
| **声明式（declarative）** | 集群状态由仓里的文件渲染产生，而不是手工敲命令 | 手工改的东西会在下次 apply 时被静默覆盖 |
| **门禁（gate）** | 流程中"不过就不许进入下一步"的检查点 | 典型：镜像未分发到全部节点就不许 apply |
| **冒烟测试** | 交付前的最小可用性验证（起容器、打健康端点） | 它挡的是"根本起不来"，不挡功能缺陷 |
| **ADR** | Architecture Decision Record：把选型的背景、候选、取舍写成记录 | 重点在"当时为什么这么选、什么条件下换" |
| **bastion / 堡垒机** | 受控跳板机：运维先登录它，再由它代理到目标机器，便于审计 | 网络层通常不给你直连目标机的通路 |
| **VitePress 死链检查** | 本站构建时会校验站内链接是否存在，失效即构建失败 | 站内链接不能指向 `docs/` 之外 |

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-13 | zmd6s6 | 创建 |
| 2026-10-14 | zmd6s6 | 按小白视角重写并串联基础知识域 |
