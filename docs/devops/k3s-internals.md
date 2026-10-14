---
title: K3s 原理篇：一次请求的完整旅程
author: zmd6s6
description: 以小白视角讲清 K3s/Kubernetes 的工作机制：集群是什么、一个请求从进门到到达容器的每一步（NodePort→虚拟地址→跨节点隧道）、集群内 DNS、存储、镜像与启动——每一步链接对应的基础知识笔记。
category: devops
tags:
  - k3s
  - kubernetes
  - internals
status: active
created: 2026-10-13
updated: 2026-10-14
---

# K3s 原理篇：一次请求的完整旅程

> **读这篇需要什么背景**：不需要 Kubernetes 经验。每节先讲"它替你做了什么"，再讲"在哪会坏、坏了长什么样"（对应案例见[事故复盘](./k3s-incident-principles.md)）。底层机制链接：
> [DNS](../networking/dns-name-to-address.md) ｜ [端口：拒绝 vs 超时](../networking/tcp-udp-refused-vs-timeout.md) ｜ [IP 与子网路由](../networking/ip-subnet-and-routing.md) ｜ [NAT 与端口转发](../networking/nat-and-port-forward.md)

## 1. K3s 是什么：一个"自带全套家具"的集群发行版

先说**集群（Kubernetes，常写作 K8s）**是干嘛的：你交给它一份"期望清单"（想要 2 个网关、1 个数据库……），它负责让现实和清单一致——机器不够找机器、程序挂了拉起来、滚动机房也照单执行。你可以把它理解成**一个自动执行部署与运维意愿的管家**。

而 **K3s** 是 K8s 的一个"打包发行版"：把管家和全套家具（运行时 containerd、网络 flannel、DNS、存储插件）塞进**一个可执行文件**，两台低配服务器、断网环境也能 5 分钟起集群。代价是默认家具都是选好的——不认识它们就会被默认值坑（下文逐一介绍）。

```
管理节点（一个 k3s 进程包办）：大脑（API/调度/控制） + 数据账本
每台机器上的代理人（kubelet）：照清单把容器拉起来、按探针重启
全家桶默认件：CoreDNS（名字翻译） / local-path（本地目录当磁盘） / traefik（高级路由，可不用）
```

排障入口：管理节点上 `journalctl -u k3s`（进程日志，一切集群级问题的第一现场）。

## 2. 一次请求的完整旅程（网络部分）

先补三个地基（各 5 分钟，强烈建议按序读）：

1. [端口：拒绝 vs 超时](../networking/tcp-udp-refused-vs-timeout.md)——敲门没人应有两种含义；
2. [NAT 与端口转发](../networking/nat-and-port-forward.md)——"总机+转接"的把戏；
3. [IP 与子网路由](../networking/ip-subnet-and-routing.md)——为什么跨网段要走路由。

然后跟着一个请求走：用户访问 `http://服务器IP:30080`。

**第一跳：NodePort（小区大门）**。K8s 在**每台**机器上都开了 30080 这个门（所以访问任意一台都行），门后要做转接——这正是[端口转发（DNAT）](../networking/nat-and-port-forward.md)。

**第二跳：ClusterIP（总机号）**。转接规则的目标是一个"虚拟地址"（ClusterIP）——它**不属于任何网卡**，只存在于内核的转接规则表里（[NAT 笔记](../networking/nat-and-port-forward.md)里"总机号码只是规则表里的记号"）。规则再把包转给某一个真实容器。

**第三跳：跨节点隧道（flannel/VXLAN）**。如果选中的容器在另一台机器上，包会被**封装成 UDP 8472** 的包裹走机器之间的网络（术语 VXLAN 隧道）。**坑**：两台机器互相 ping 得通、防火墙都关着，但中间设备只要丢 UDP 8472 的包，跨机器的容器就全断——而同机器的容器一切正常，症状极具迷惑性（真实案例见[事故九](./k3s-incident-principles.md)）。

**验证方法**（不用进容器）：从节点直接访问虚拟地址 `curl http://<ClusterIP>:<端口>`——因为转接规则对机器自身也生效，通=网络链路好，不通=查规则/查对端容器。

## 3. 集群内的 DNS：名字怎么翻译

> 地基：[DNS：名字是怎么变成地址的](../networking/dns-name-to-address.md)

集群里所有容器都使用同一个内置 DNS（CoreDNS）。容器里查 `dbsvr` 这个短名时，DNS 会自动补全后缀逐个试（这是"短名能用的代价：多查几次"），最终要么返回**虚拟地址**（Service），要么——对"无虚拟地址的服务"（headless）——**直接返回后端真实地址**（这正是[事故四](./k3s-incident-principles.md)里引用外部数据库的正确姿势）。

两个实战要点：**改完解析等 30 秒**（负缓存，DNS 笔记讲过）；**ExternalName 类型的本质是 CNAME**，填 IP 字面量必死（原理在[DNS 笔记](../networking/dns-name-to-address.md)的 CNAME 一节）。

## 4. 存储：local-path 的真相是"机器上的一个目录"

K8s 的存储申请单叫 PVC（"我要一块 10G 的盘"）。K3s 默认的分配器 local-path 的做法非常朴素：**在容器所在那台机器上建一个目录**，挂进容器。

**推论（坑）**：数据从此**绑死在那台机器**——容器被调度到另一台机器时，拿到的是那边的新空目录（数据没丢，躺在原机器上）。测试环境能接受；要求"容器随便漂、数据跟着走"就要换网络存储。

## 5. 镜像与启动

**镜像**：一个"打包好的、可直接运行的程序压缩包"。K3s 内置运行时 containerd（**不是 Docker**——机器上没有 docker 命令是正常的），操作命令是 `k3s ctr -n k8s.io images ...`（`-n k8s.io` 是它的储藏室编号，忘写=看起来什么都没有）。

**拉取策略的坑**：默认策略 IfNotPresent（"本地有就不下载"）的后半句是——**本地没有就去远端下载**。离线环境=永远超时挂起，这就是[事故三](./k3s-incident-principles.md)（镜像漏分发一台，副本挂 5 小时）的机制根源。

**Java 程序的启动**：容器入口怎么写、为什么 `java -cp` 比 `java -jar` 稳，见[classpath 白话](../backend/java-classpath-basics.md)；内存三块与容器限额，见[JVM 内存白话](../backend/jvm-memory-anatomy.md)。

## 6. 健康检查：进程活着 ≠ 服务可用

探针三件套（背景见[事故五](./k3s-incident-principles.md)）：

| 探针 | 回答的问题 | 挂了会怎样 |
|---|---|---|
| liveness | 进程还活着吗 | 杀掉重启 |
| readiness | 能接客了吗 | 暂时不给它分流 |
| startup | 启动期保护 | 启动慢的程序不被前两者误杀 |

Spring Boot 程序在 K8s 里默认提供分组地址（`/actuator/health/liveness|readiness`），**探针永远打分组地址**，不打掺入外部依赖的综合报告。

## 7. 配置渲染：kustomize 在干嘛

部署清单常"多环境大同小异"：kustomize 的做法是**底稿（base）+ 每环境一张差异页（overlay）**，渲染成最终清单再交给 K8s。两个实用点：

- 渲染结果可以**先看再交**（`kubectl kustomize` 输出可读、可 diff、可评审）——这是"配置也可代码评审"的根基；
- 差异页按"名字"合并修改：容器按名字、环境变量按变量名——同名覆盖、异名追加，不会误伤既有项。**注意**：差异页不能引用自己目录之外的单个文件（安全限制），要引用就引整个目录或复制过来。

## 8. 速查：症状 → 机制层 → 验证

| 症状 | 指向 | 一行验证 |
|---|---|---|
| 跨机器容器互访超时，同机器正常 | 跨机隧道（UDP 8472）被挡 | 两机器互测 8472/udp |
| 虚拟地址访问卡死 | 转接规则/后端容器故障 | `get endpoints` 看后端；直连容器地址对照 |
| 刚改的名字解析不到 | DNS 负缓存 | 等 30~60 秒 |
| 名字永远解析不到（ExternalName 填了 IP） | CNAME 无法指向 IP | 换 headless+Endpoints 写法 |
| 改配置不生效 | 单文件挂载无热更新 | 重启对应服务 |
| 某台机器的副本拉镜像挂死 | 本机无镜像→去公网拉→超时 | 逐台 `ctr images ls \| grep` |
| 容器漂移后"数据没了" | local-path 绑机器 | 看数据卷在原机器 |

## Related

- [事故复盘](./k3s-incident-principles.md) ｜ [选型决策记录](./k3s-decision-records.md) ｜ [术语表](./k8s-glossary.md) ｜ [项目实践](../projects/medical-it-delivery-practice/README.md)
- 基础底座：[DNS](../networking/dns-name-to-address.md) ｜ [拒绝 vs 超时](../networking/tcp-udp-refused-vs-timeout.md) ｜ [子网路由](../networking/ip-subnet-and-routing.md) ｜ [NAT](../networking/nat-and-port-forward.md) ｜ [JVM 内存](../backend/jvm-memory-anatomy.md) ｜ [classpath](../backend/java-classpath-basics.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-13 | zmd6s6（AI 辅助） | 创建 |
| 2026-10-14 | zmd6s6（AI 辅助） | 按小白视角重写并串联基础知识域 |
