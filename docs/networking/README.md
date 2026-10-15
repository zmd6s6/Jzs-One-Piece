---
title: 计算机网络：从零到工程实践的 16 周线性学习路径
author: zmd6s6
description: 按零前置原则，从网络分层与寻址、TCP/IP、HTTP/TLS 到 Java/C++/Qt 网络编程、抓包排障和网络架构。
category: networking
tags:
  - networking
  - roadmap
  - linear-learning
status: active
created: 2026-10-14
updated: 2026-10-15
---

# 计算机网络：从零到工程实践的 16 周线性学习路径

> **目标**：从“只能调用 HTTP/Socket API”走向“能解释每一层发生了什么、能抓包验证、能独立设计跨语言通信与排障”。默认完全不懂计算机网络专业名词。每个新术语先读现象与类比，再读机制、执行最小实验、回答验收题。

## 先读这里：一条唯一主线

- 建议每周 **5–7 小时**：概念阅读 2 小时、动手 2–3 小时、独立复盘 1–2 小时。
- **先打地基、后做高阶实验**；有研发经验也不要直接跳到 epoll / Netty 参数。
- 一周内容读不懂就顺延；“16 周”是节奏建议，不是必须完成的硬期限。
- 第一次学每篇只抓住“解决什么问题、输入输出是什么、在什么层、如何验证”；第二次复盘再读细节。

## 第一阶段：知道网络里都有哪些角色（第 1–2 周）

1. [01 浏览器打开一个网页，经历了哪些环节](./foundations/first-network-request.md)
2. [02 分层与封装：HTTP、TCP、IP、Ethernet 的关系](./foundations/layers-and-encapsulation.md)
3. [03 域名、IP、MAC、端口：四种不同的身份](./foundations/four-kinds-of-address.md)
4. [04 交换机、以太网帧与 ARP](./lan/ethernet-switch-arp.md)
5. [05 DHCP 如何分配 IP、网关、DNS](./lan/dhcp-automatic-addressing.md)
6. [06 Wi-Fi 为什么信号满格还可能卡](./lan/wifi-and-ethernet.md)

**本阶段自测**：在本机启动 HTTP 服务并通过 curl 请求，通过条件：能画出“客户端 → 地址解析 → 网络 → 服务端 → 响应”，说出四种地址的不同职责。

## 第二阶段：明白包是如何跨网络送达的（第 3–4 周）

7. [07 IP、子网、路由与默认网关（已有知识页）](./ip-subnet-and-routing.md)
8. [08 CIDR：/24、/27 到底如何计算](./internet/subnet-cidr-calculation.md)
9. [09 ICMP、ping、traceroute 真正在测什么](./internet/icmp-and-path-probing.md)
10. [10 NAT 与端口转发（已有知识页）](./nat-and-port-forward.md)
11. [11 IPv6：地址族、邻居发现和双栈](./internet/ipv6-first-look.md)

**本阶段自测**：分别观察 DNS、子网路由、ARP 和 ICMP，通过条件：能算网络地址/广播地址，区分本地目标与下一跳。

## 第三阶段：真正理解 TCP，而不只会背三次握手（第 5–7 周）

12. [12 TCP 与 UDP：字节流和数据报](./transport/tcp-vs-udp.md)
13. [13 端口、拒绝与超时（已有知识页）](./tcp-udp-refused-vs-timeout.md)
14. [14 三次握手、断连、RST、TIME_WAIT](./transport/tcp-connection-lifecycle.md)
15. [15 序列号、ACK、重传、接收窗口](./transport/tcp-reliability.md)
16. [16 流量控制、拥塞控制、RTT 与 BDP](./transport/tcp-congestion-control.md)

**本阶段自测**：抓取一次 TCP 握手与关闭过程，通过条件：拿出一段抓包，解释标志位与序列号，理解 TCP 不保存应用消息边界。

## 第四阶段：应用为什么要用 DNS/HTTP/TLS（第 8–9 周）

17. [17 DNS：名字如何得到地址（已有知识页）](./dns-name-to-address.md)
18. [18 HTTP 方法、状态码、头、连接复用](./application/http-core.md)
19. [19 HTTPS、TLS、证书校验](./application/https-tls.md)
20. [20 HTTP/1.1、HTTP/2、HTTP/3 与 QUIC](./application/http-versions.md)
21. [21 WebSocket、gRPC 与调用语义](./application/websocket-grpc.md)

**通过条件**：能把“DNS 错误、TCP 连接失败、TLS 证书错误、HTTP 502”分开解释；知道现代 HTTP 不等于一律基于 TCP。

## 第五阶段：自己用代码收发数据（第 10–12 周）

22. [22 Socket 生命周期：bind/listen/accept/connect](./programming/socket-lifecycle.md)
23. [23 TCP 粘包/半包为何发生：消息帧设计](./programming/tcp-message-framing.md)
24. [24 阻塞、非阻塞、select/poll/epoll、Reactor](./programming/io-multiplexing.md)
25. [25 Java Socket → NIO → Netty](./programming/java-nio-netty.md)
26. [26 Qt QTcpSocket/QTcpServer 与线程归属](./programming/qt-network.md)

**本阶段自测**：设计长度前缀协议并验证跨语言互通，通过条件：自行处理半包、编码、字节序，分清连接成功与业务成功。

## 第六阶段：定位故障和设计工程级通信（第 13–16 周）

27. [27 按 DNS → 路由 → TCP → TLS → HTTP 排障](./operations/troubleshooting-order.md)
28. [28 Wireshark/tcpdump 抓包与推断边界](./operations/packet-capture-basics.md)
29. [29 超时、重试、幂等、截止时间](./operations/timeouts-retries-idempotency.md)
30. [30 反向代理与负载均衡：502/504](./operations/reverse-proxy-load-balancer.md)
31. [31 网络性能：带宽、吞吐、P99](./advanced/network-performance.md)
32. [32 网络安全：防火墙、TLS、认证/授权](./advanced/network-security.md)
33. [33 容器与 Kubernetes 网络的基本路径](./advanced/container-networking.md)

**本阶段自测**：按分层顺序独立完成诊断，通过条件：能提交“现象 → 假设 → 复现/抓包 → 排除 → 根因/下一步 → 修复与预防”的完整报告。

## 每一阶段的可操作验收

| 阶段 | 不看资料，需要独立完成的事 |
|---|---|
| 网络直觉 | 解释数据包、地址、端口、交换机、网关；本地启动一个 HTTP 服务 |
| 寻址路由 | 计算 `192.168.1.40/27` 的网络地址；从路由表指出下一跳 |
| TCP | 画出三次握手、解释 ACK/重传/TIME_WAIT，分析一个 pcap |
| HTTP/TLS | 区分 HTTP 4xx/5xx 与 TLS 失败，用 curl 输出定位阶段 |
| 网络编程 | 实现支持长度前缀的通信，Java 服务端 + Qt 客户端互通 |
| 架构排障 | 解释超时后的不确定状态，提交一份有证据的故障诊断记录 |

## 为不同使用意图建立入口

### 按症状找：出现问题直接查

| 现象 | 第一篇 |
|---|---|
| 域名能不能解析？ | [DNS](./dns-name-to-address.md) |
| 端口拒绝或超时？ | [拒绝与超时](./tcp-udp-refused-vs-timeout.md) |
| 不同网段连不通？ | [IP、子网与路由](./ip-subnet-and-routing.md) |
| 服务器发了 N 条，客户端收到 M 次？ | [TCP 消息边界](./programming/tcp-message-framing.md) |
| HTTPS 提示证书无效？ | [TLS](./application/https-tls.md) |
| 服务端 502/504？ | [代理与负载均衡](./operations/reverse-proxy-load-balancer.md) |
| Qt socket 跨线程？ | [Qt 网络](./programming/qt-network.md) |
| 容器能不能访问宿主机服务？ | [容器网络](./advanced/container-networking.md) |

### 按路径学：按专题导航

- [零基础](./foundations/README.md) → [局域网](./lan/README.md) → [跨网段](./internet/README.md) → [TCP/UDP](./transport/README.md) → [HTTP/TLS](./application/README.md) → [网络编程](./programming/README.md) → [运行排障](./operations/README.md) → [高级专题](./advanced/README.md)
- [基础术语表](./glossary.md) · [筛选后的高质量资料与实践经验贴](./reading-list.md)

### 按决策查：先明确优先级

1. **协议选型**：先看可靠性、消息边界、延迟需求，再看 TCP/UDP/WebSocket/gRPC。
2. **网络并发**：先保证同步实现正确，再看非阻塞和事件循环；不要先照搬 epoll/Netty 优化参数。
3. **失败恢复**：任何重试都要先问操作是否可安全重做，再决定重试策略。
4. **性能与安全**：必须有延迟分布、抓包、日志等数据支持，不能用单次 ping 或“内网可信”代替证据。

## 推荐第一天就做的事

先学第 01、02、03 篇；再做实验 01。把得到的实际输出写进实验记录。之后每学一个机制，画一次过程图、执行一项验证命令、回答对应文档的自测题。

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-14 | zmd6s6 | 从目录列表改为线性学习路径 |
| 2026-10-15 | zmd6s6 | 扩展为 16 周零基础到架构实战路线，接入原有四篇与 8 个实验、资料索引 |
| 2026-10-15 | zmd6s6 | 按 AGENTS.md 将项目实践入口从基础域移除，保留纯知识验收 |
