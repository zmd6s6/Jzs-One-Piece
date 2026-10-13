---
title: K3s 体系选型决策记录（ADR 精选）
description: 搭建轻量集群体系时做过的 12 个关键选型：每个决策的候选方案、优缺点对比、取舍理由与反转条件。
category: devops
tags:
  - k3s
  - kubernetes
  - architecture
  - adr
status: active
created: 2026-10-13
updated: 2026-10-13
---

# K3s 体系选型决策记录（ADR 精选）

> 配套阅读：[K3s 实战事故与原理](./k3s-incident-principles.md)（踩坑复盘）、[K3s/K8s 组件原理篇](./k3s-internals.md)（机制层）。
> 每条决策含：**背景 → 候选与优缺点 → 结论 → 反转条件**（什么时候该推翻重来）。

## 1. 容器平台：k3s

| 候选 | 优点 | 缺点 |
|---|---|---|
| **k3s** ✅ | 单二进制、内嵌 sqlite/containerd/flannel/CoreDNS，离线安装（airgap）友好，单节点 2C4G 可跑 | 默认 SQLite 单点（≤3 节点合适）；自带组件（traefik/svclb）需了解才能改 |
| kubeadm 标准版 | 生态标准、可扩展 etcd | 部署重、组件多、离线环境安装成本高 |
| microk8s / minikube | 上手快 | 面向开发体验，生产语义弱 |

**结论**：中小规模 + 离线交付场景，k3s 的"电池全含"是净收益。
**反转条件**：节点数 >3 或需要多控制面高可用时，评估 `--cluster-init`（etcd）或换标准发行版。

## 2. 节点拓扑：单节点 vs 双节点

| | 单节点 | 双节点 ✅（测试/生产） |
|---|---|---|
| 复杂度 | 低（无跨节点网络/分发问题） | 引入两个新问题域：镜像分发、跨节点 overlay |
| 滚动更新 | 必断服 | 双副本逐个滚，不断服 |
| 故障域 | 一损俱损 | 节点级隔离 |

**结论**：能双则双，但**必须**配套"镜像全节点一致"门禁与跨节点连通性预检；单节点留给演示/POC。
**反转条件**：无。加节点时新增项只有分发与存储两个 checklist。

## 3. 镜像分发：私有 registry:2 vs 离线 import

| | registry:2（集群内） | 逐节点 `ctr import` |
|---|---|---|
| 发版成本 | 推一次，全节点可拉 | **每个节点**都要导，漏一个 = ImagePullBackOff 挂死 |
| 依赖 | 一个常驻组件 + 每节点 registries.yaml + 重启 k3s | 零额外组件 |
| 断网环境 | 离线装 registry 本身也要先导入镜像（鸡生蛋，但只发生一次） | 天然适配 |

**决策矩阵**：节点 ≥2 或发版周级以上 → registry；单节点/极低频/严格断网 → import。
**为什么不选 Harbor/Nexus 私仓**：运维面（认证、存储、备份、升级）超出需要；registry:2 一个 Deployment 就完事。
**反转条件**：出现多团队共用、需要镜像扫描/漏洞策略时升级 Harbor。

## 4. Java 产物形态与容器入口（本系列最贵的决策）

| 方案 | 优点 | 缺点 |
|---|---|---|
| fat jar + `java -jar` | 最简单、单文件 | 镜像层缓存差（业务一改全量重推）；与"解压即运行"的裸机交付形态不一致 |
| thin(ZIP) + `java -jar -Dloader.path` | 裸机脚本同款 | 参数必须成对出现，**漏一个字就全类加载失败**（事故①）；对布局敏感 |
| **thin + `java -cp '/app/*:/app/lib/*'`** ✅ | 对 NONE/ZIP 布局免疫；通配不依赖 jar 文件名；lib 层缓存好 | 需要约定运行包目录结构 |

**配套决策**：classpath 用通配（禁止硬编码带版本文件名）；profile 由 `SPRING_PROFILES_ACTIVE` 注入，镜像保持中立。
**反转条件**：无。唯一注意点：`/app/*` 展开顶层所有 jar，别在 /app 堆杂物。

## 5. Dockerfile 归属：源码仓 vs CI 内联 vs 部署仓

- **源码仓** ✅：与代码同版本演进、PR 可评审、CI 与本地构建一致；
- CI 内联 ❌：与代码漂移、不可评审（事故：内联入口漏参数，坏镜像直达制品库）；
- 部署仓 ❌：构建关注点泄漏到运维仓，且跨仓版本对齐成本高。

**反转条件**：无。

## 6. 配置分层：kustomize vs Helm vs 多套 yaml + sed

| | kustomize ✅ | Helm | 多套完整 yaml / sed 改 tag |
|---|---|---|---|
| 学习成本 | 低（纯 YAML 叠加） | 中（模板语言 + values） | 零 |
| 可评审性 | 渲染结果可 diff（`kubectl kustomize`） | 渲染结果难肉眼对账 | 极差（漂移事故源头） |
| 表达力 | 中（复杂 patch 啰嗦；跨目录引单文件被禁） | 强 | 弱 |
| 依赖 | kubectl 内置 `-k` | 需装 helm | 无 |

**结论**：环境差异 = overlay 目录（镜像 tag/副本数/ConfigMap/外部地址），共性 = base 单一权威。
**反转条件**：需要发布到多租户、复杂 values 组合或大量社区 chart 时再引 Helm。

## 7. 集群外中间件的"名字源"（六案对比）

| 方案 | 优点 | 缺点/失效模式 |
|---|---|---|
| 配置直连 IP | 零机制 | 换库改 N 处配置；环境差异混进代码 |
| ExternalName | 声明式 | **指向 IP 字面量时 NXDOMAIN**（CNAME 无法合成 A）——死路 |
| hostAliases（Pod 注入 hosts） | 生效快 | 要改每个工作负载；声明散落 |
| 节点 /etc/hosts | 裸机进程友好 | **Pod 完全不读**；k3s→NodeHosts 同步不可靠 |
| dnsmasq / 公司 DNS 单一来源 | 内外一致、一处维护 | 多一个要保活的服务/需要网管配合 |
| **headless Service + 手工 Endpoints** ✅ | 声明式、进 git、改 IP 即生效（30s 负缓存）、Pod 内外一致（节点进程可另配 hosts） | 需要理解同名绑定机制 |

**结论**：仓内 headless+Endpoints 为默认；组织成熟后升级 dnsmasq/公司 DNS 单一来源（内外一套名字）。
**反转条件**：中间件多、跨集群复用时。

## 8. 探针方案

| | 聚合 `/health` + initialDelay | **组端点 + startupProbe** ✅ | tcpSocket | 无探针 |
|---|---|---|---|---|
| 失效模式 | 单组件坏 → liveness **杀好容器** | 基本无 | 只证端口，不证应用 | 假健康（DB 断连数日照样绿灯） |
| 慢启动 | 大 initialDelay 猜值 | failureThreshold×period 显式容忍 | 同左 | — |

结论：liveness/readiness 打 `/actuator/health/liveness|readiness`，startupProbe 给 10 分钟窗口。
**反转条件**：无。

## 9. JVM 内存口径：显式三项 vs 百分比

- **显式（-Xmx + MaxMetaspace + MaxDirect）**：可控、可对账、故障复盘直观；缺点是 limit 一改就要联动改（漏改=OOM）。
- **MaxRAMPercentage**：堆随 limit 自适应，一劳永逸；缺点是不同 limit 下行为隐式、极端配比（limit<1G）需校验。

**结论（演进式）**：部署侧暂用显式口径表（三项之和 < limit），镜像默认值迁移到 `MaxRAMPercentage=70 / InitialRAMPercentage=50`。
**反转条件**：无；显式表在过渡期保留作为对账基准。

## 10. 工作负载类型与存储

- 有本地状态（注册中心数据、影像 temp）→ **StatefulSet + volumeClaimTemplates**；无状态 → Deployment；
- 默认 StorageClass 是 **local-path**：实现即"节点目录"，**绑死节点、重调度不跟随**——测试可接受，生产要换网络存储或固定调度；
- 副本数：单节点一律 1（同机多副本只增加争抢）；双节点核心服务 2（天然跨节点）。
**反转条件**：上生产高可用时引入 PodDisruptionBudget + 反亲和。

## 11. 版本与发布策略

- **版本-代码强绑定**（从 git tag 构建）是正解；按分支构建 = 同号不同物（曾发生 CI 连到同名旧副本仓、连发两个月旧代码的隐蔽事故——HTTP 200 ≠ 同一个仓）；
- 产物**层数最小化**：`docker save` 的 tar 不再包 zip；
- 回滚三式按代价排序：`rollout undo` → tag 回退重 apply（可留痕）→ 整环境 `delete -k` 重放；
- 留痕：每次发布记变更行（版本、门禁结果、回滚与否）。

## 12. 观察工具：GUI（Lens/FreeLens 类） vs 纯 kubectl

GUI 大幅降低查看/应急门槛（状态树、Last State、日志、终端），但**流程以仓为准**——GUI 里做的改动不留痕，下次 apply 即回退；纯 kubectl 可脚本化、可审计。
**结论**：GUI 看、CLI/仓 改。两者是"观察 vs 变更"的分工，不是二选一。

## Related

- [K3s 实战事故与原理](./k3s-incident-principles.md)
- [K3s/K8s 组件原理篇](./k3s-internals.md)
