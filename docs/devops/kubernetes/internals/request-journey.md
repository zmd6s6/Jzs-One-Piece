---
title: 一次请求的完整旅程：从进门到容器
author: zmd6s6
description: 跟着一个请求走完 K8s 网络的三跳——NodePort（小区大门）、ClusterIP（总机号）、跨机隧道（封装包裹）——每跳链接 NAT/子网基础，并给出验证方法。
category: devops
tags:
  - kubernetes
  - internals
  - networking
status: active
created: 2026-10-14
updated: 2026-10-14
---

# 一次请求的完整旅程：从进门到容器

> 先补三个地基（各 5 分钟，强烈建议按序读）：
> ①[端口："拒绝"与"超时"](../../../networking/tcp-udp-refused-vs-timeout.md)；②[NAT 与端口转发](../../../networking/nat-and-port-forward.md)（"总机+转接"）；③[IP 与子网路由](../../../networking/ip-subnet-and-routing.md)。

跟着一个请求走：用户访问 `http://服务器IP:30080`。

## 第一跳：NodePort（小区大门）

K8s 在**每台**机器上都开了 30080 这个门（所以访问任意一台都行），门后要做转接——这正是[端口转发（DNAT）](../../../networking/nat-and-port-forward.md)。

## 第二跳：ClusterIP（总机号）

转接规则的目标是一个"虚拟地址"（ClusterIP）——它**不属于任何网卡**，只存在于内核的转接规则表里（[NAT 笔记](../../../networking/nat-and-port-forward.md)里"总机号码只是规则表里的记号"）。规则再把包转给某一个真实容器；多条规则就是负载均衡（随机选一个后端）。

> 推论：`get endpoints` 显示后端为空 = 这门后没人（selector 没匹配上任何容器），请求会卡死而不是报错。

## 第三跳：跨机隧道（flannel/VXLAN）

如果选中的容器在**另一台机器**上，包会被封装成 **UDP 8472** 的包裹走机器之间的网络（术语 VXLAN 隧道，flannel 组件负责）。

**坑**：两台机器互相 ping 得通、防火墙都关着，但中间设备只要丢 UDP 8472 的包，**跨机器的容器就全断——而同机器的容器一切正常**，症状极具迷惑性（见[事故库](../incidents/README.md)的跨机类案例）。

## 验证方法（不用进容器）

从节点直接访问虚拟地址：

```bash
curl http://<ClusterIP>:<端口>
```

转接规则对机器自身也生效——**通 = 网络链路好；不通 = 查规则或后端容器**。再配合"直连容器地址"做对照，一次就能定位断在哪一跳。

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-14 | zmd6s6（AI 辅助） | 从《原理篇》长文拆分独立成篇 |
