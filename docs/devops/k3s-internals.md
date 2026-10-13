---
title: K3s/K8s 组件原理篇：从进程到请求的机制地图
description: 以 k3s 为载体的 Kubernetes 机制原理：控制面内嵌架构、容器网络栈（flannel/kube-proxy/ClusterIP）、DNS 解析链路、存储 local-path、镜像与 containerd、Spring Boot on K8s、kustomize 渲染。
category: devops
tags:
  - k3s
  - kubernetes
  - internals
  - networking
status: active
created: 2026-10-13
updated: 2026-10-13
---

# K3s/K8s 组件原理篇：从进程到请求的机制地图

> 名词不熟先查：[术语表](./k8s-glossary.md)。配套阅读：[事故与踩坑复盘](./k3s-incident-principles.md)、[选型决策记录](./k3s-decision-records.md)。
> 目标：每个机制讲清"它替你做了什么、在哪儿会坏、坏了长什么样"。

## 1. k3s 到底打包了什么

```
server 节点（单进程 k3s）:
  kube-apiserver + scheduler + controller-manager + datastore(SQLite/etcd 可选)
agent（server 也内嵌 agent）:
  kubelet + containerd(内嵌) + kube-proxy + flannel
全家桶默认件:
  CoreDNS / local-path-provisioner / traefik(ingress) / klipper-lb(svclb)
```

- 与标准发行版的本质差异：**一个二进制 + SQLite** 换来了"离线 5 分钟起集群"；代价是默认组件是"选好的"——不理解它们就会被默认值坑（见下文 svclb/NodeHosts）。
- 排障入口：`journalctl -u k3s`（一切进程级问题的第一现场）。

## 2. 容器网络栈（本项目视角的四层）

### 2.1 Pod 网络：veth + Pod CIDR

每 Pod 一对 veth，接入节点 `cni0` 网桥；每个节点分一段 Pod CIDR（默认 `10.42.x.0/24`，**第 3 段即节点号**，看到 Pod IP 就知道它在哪个节点）。

### 2.2 跨节点：flannel VXLAN

- 原理：跨节点 Pod 包被封装成 **UDP 8472** 在节点物理网络里传输（`flannel.1` 接口）；
- 坏了什么样：跨节点 Pod 互访**超时**（不是 refused）——即使节点互相 ping 通、防火墙关着，**中间网络设备挡 UDP 8472** 照样断；
- 这就是"双节点引入新问题域"的实体：跨节点不通时，同节点 Pod 正常、跨节点全断，症状极具迷惑性。

### 2.3 Service / ClusterIP：kube-proxy 与 iptables 的转发机制

- ClusterIP 是**虚拟 IP**，没有任何网卡持有它；本机发出的包被 iptables `KUBE-SERVICES` 链 DNAT 成某个 Pod IP；
- 推论一：**节点本身也能访问 ClusterIP**（iptables 对本机流量同样生效）——排障时不用进 Pod，节点上直接 `curl <ClusterIP>:<port>`；
- 推论二：多条 DNAT 规则即负载均衡（随机选 Pod），`endpoints` 为空 = Service 有名无实（selector 不匹配时就是这种）；
- NodePort：iptables 再加一层"节点 IP:30000+ → ClusterIP 链"；k3s 的 svclb（klipper）是给 LoadBalancer 型 Service 起的 hostPort 占位 Pod——没用到可忽略，但 `get pods` 里看到别慌。

### 2.4 一次请求的完整路径

```
客户端 → 节点IP:30080(NodePort DNAT) → ClusterIP(再 DNAT) → Pod(veth/cni0) → 容器端口
全部在本节点 iptables 完成（后端 Pod 在别的节点时才走 flannel 封装）
```

## 3. DNS 链路：Pod 内一次解析的过程

- Pod 的 `/etc/resolv.conf`：`nameserver 10.43.0.10`（CoreDNS 的 Service）+ `search <ns>.svc.cluster.local svc.cluster.local cluster.local` + **`ndots:5`**；
- `ndots:5` 的含义：名字里点数 <5 会先拼 search 域逐个试——所以短名（`dbsvr`）能解析，也会带来"多次查询"的隐性成本；
- CoreDNS 插件链：`kubernetes`（Service/Pod 记录）→ `hosts /etc/coredns/NodeHosts`（k3s 的节点 hosts 同步入口，**不可靠，别依赖**）→ `cache`（约 30s，**负缓存**：NXDOMAIN 也会被缓存！）；
- ExternalName 的 DNS 语义：只回 CNAME。**CNAME 的目标必须是个可解析的名字**——目标是 IP 字面量时无法合成 A 记录 → 整体 NXDOMAIN。这就是"ExternalName 指 IP 是死路"的原理级原因；
- 正解 headless Service（clusterIP=None）+ 同名 Endpoints：CoreDNS 对 headless 服务直接回**后端 Pod/手工 Endpoints 的 A 记录**，任何客户端都认。

## 4. 存储：local-path 的工作方式

- 原理：PV 就是**节点上某目录**（provisioner 收到 PVC → 在调度节点建目录 → hostPath 挂进 Pod）；
- 推论：**数据绑死节点**——Pod 重调度到另一节点 = 拿到新空目录（数据没丢，在原节点躺着）；StatefulSet + volumeClaimTemplates 的"每副本独立 PVC"只是让这个事实更明确；
- 生产升级路径：网络存储 StorageClass（NFS/Ceph/云盘）或节点固定调度（nodeSelector + 反亲和）。

## 5. 镜像与 containerd

- k3s 内嵌 containerd（**不是 docker**）：操作入口 `k3s ctr -n k8s.io images ...`（注意命名空间 `k8s.io`，忘加 = 看不到任何镜像）；
- `docker save`/`ctr images export` 的 tar 是 OCI 镜像打包（manifest+layers），`ctr import` 原样导入——所以"tar 再包一层 zip"纯属给下载方加工序；
- imagePullPolicy 语义：`IfNotPresent` = 本地有就不拉，**本地没有就去 registry 拉**（离线环境 = 去 Docker Hub 超时 → ImagePullBackOff 挂死）；
- k3s 会在磁盘紧张时 **GC 未使用镜像**——回滚前先 `images ls` 确认旧版本还在。

## 6. Spring Boot on Kubernetes

### 6.1 类加载：三种 launcher 的差异

- `JarLauncher`（fat jar 默认）：从 jar 内 `BOOT-INF/lib` 加载全部依赖，`java -jar` 即可；
- `PropertiesLauncher`（ZIP 布局）：依赖**不在 jar 内**，启动时读 `loader.path`（系统属性或 loader.properties）找外部 lib——**参数缺失 = 零依赖加载 = NoClassDefFoundError**；
- 显式 `-cp jar:lib/* 主类`：绕开 launcher，类路径完全由你指定——对布局免疫，这就是统一入口选它的原因。

### 6.2 actuator health 的两级结构

- 聚合端点 `/actuator/health` = 所有 indicator 投票（DB、Redis、注册中心客户端…任何一个 DOWN → 503）；
- **health group**（`/actuator/health/liveness|readiness`）：Spring Boot 在 K8s 环境**自动启用**，只含存活/就绪状态本身，不含外部组件——这就是探针必须打组端点的原理（自愈不能被外部依赖劫持）。

### 6.3 JVM 的容器感知

- JVM ≥10 默认 `UseContainerSupport`：读 **cgroup 限制**（而非宿主机内存）作为默认堆依据；
- `MaxRAMPercentage` 以 cgroup limit 为基数取百分比——limit 变了堆自动跟着变，这是"百分比方案根治 OOM 族"的机制；
- 但 Metaspace/堆外**不在百分比管辖内**，仍需显式上限——三项之和 < limit 的约束永远成立。

## 7. kustomize 渲染原理

- `resources` 树形加载 → `images/replicas` 等 transformer 改字段 → patches 按**键**合并（containers 按 name、env 按 name）——所以 patch env 时同名覆盖、异名追加，不会误伤既有变量；
- **安全限制**：overlay 不得引用自身目录之外的**单个文件**（路径逃逸防护）——要么引整个目录，要么复制；
- `kubectl apply -k` = 先在本机渲染成完整对象再提交——**渲染结果永远可先审后用**（`kubectl kustomize > a.yaml` 进 diff），这是它可评审性的来源。

## 8. 快速定位表：症状 → 机制层

| 症状 | 指向的机制层 | 一行验证 |
|---|---|---|
| 跨节点 Pod 互访超时 | flannel VXLAN(UDP 8472) | 两节点互测 8472/udp |
| ClusterIP 节点上 curl 卡死 | kube-proxy iptables / 后端在故障节点 | `get endpoints` + 直连 PodIP |
| 名字解析不到（刚改过） | CoreDNS 负缓存 | 等 30~60s 再试 |
| 名字永远解析不到（ExternalName 指 IP） | CNAME 无 A 可合成 | 换 headless+Endpoints |
| 改配置不生效 | subPath 挂载无 watch | `rollout restart` |
| 缺镜像节点副本挂死 | IfNotPressed→远端拉取 | 逐节点 `ctr images ls \| grep` |
| 副本漂移后数据"丢了" | local-path 绑节点 | 看 PV 所在节点 |

## Related

- [Kubernetes / 容器交付 术语表](./k8s-glossary.md)
- [K3s 实战事故与原理](./k3s-incident-principles.md)
- [K3s 体系选型决策记录](./k3s-decision-records.md)
- [实践项目：容器化交付体系的搭建](../projects/medical-it-delivery-practice/README.md)
