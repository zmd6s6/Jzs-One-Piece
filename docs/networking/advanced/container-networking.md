---
title: 容器里能联网，为什么宿主机的网络结论不一定适用
author: zmd6s6
description: 理解网络命名空间、veth、CNI、Pod 和 Service 的流量路径。
category: networking
tags:
  - containers
  - kubernetes
  - network
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 容器里能联网，为什么宿主机的网络结论不一定适用

## 先看一个现象
服务器主机能访问 `10.0.0.8:8080`，但容器内部连接失败。容器不一定共享宿主机的网络接口、路由表和 DNS 配置。

## 三个概念
- **网络命名空间 network namespace**：Linux 提供的网络隔离视图；像一栋楼里每间办公室都有自己的通信线路表。
- **veth pair**：成对出现的虚拟网卡，像连接两个网络空间的网线两端。
- **CNI**：为容器配置网络所使用的一套接口规范与插件生态；不同实现会选择不同的路由、隧道、策略和数据平面机制。

在 Kubernetes 中，**Pod** 内容器通常共享同一网络命名空间；**Service** 提供相对稳定的服务访问抽象，其具体转发实现可基于 iptables、IPVS、eBPF 或其他实现，不应统一断言“总是 DNAT”。

## 思考路径
```text
进程 → Pod 网络空间 → veth/虚拟网络 → 节点/跨节点路径 → Service/后端 Pod
```
每层可能涉及独立 DNS、路由、安全策略和端口映射。

## 实用命令（受控环境）
```bash
ip netns list
ip route
kubectl get pods -o wide
kubectl get svc
```
`kubectl` 仅适用于已配置访问凭据的集群；不要在生产集群随意修改网络规则。

## 自测
为什么从宿主机 `127.0.0.1` 访问到的服务，Pod 内用同一个地址不一定可达？

## 相关知识
- [NAT 与端口转发](../nat-and-port-forward.md)
- [IP/路由](../ip-subnet-and-routing.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 创建、建立学习入口和参考资料 |
