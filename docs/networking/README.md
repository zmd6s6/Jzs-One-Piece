---
title: 计算机网络：零基础到工程实践的分阶段学习地图
author: zmd6s6
description: 不按日历安排学习；按照网络直觉、局域网、路由、TCP/UDP、应用协议、网络编程、故障排查和架构进阶逐步验收。
category: networking
tags:
  - networking
  - roadmap
  - linear-learning
status: active
created: 2026-10-14
updated: 2026-10-15
---

# 计算机网络：零基础到工程实践的分阶段学习地图

打开网页、连接服务、客户端与服务端交换数据，这些表面上不同的行为，最终都要依靠一条真实的数据传输路径。**本地图只负责回答两件事：下一步学什么、怎样证明已经学会。** 详细机制在独立知识页，实际项目练习放在项目实践域。

## 按路径学：从零基础连续推进

| 阶段 | 学习目标 | 建议先打开的入口 |
|---|---|---|
| 01 网络直觉与分层 | 认识客户端/服务端、协议、数据封装以及域名/IP/MAC/端口的不同职责 | [第一阶段：网络世界的基本规则](./foundations/README.md) |
| 02 局域网与接入 | 解释交换机、ARP、DHCP、Wi-Fi 如何参与本地网络通信 | [第二阶段：局域网与网络接入](./lan/README.md) |
| 03 IP 与路由 | 计算子网、寻找默认网关，理解 ICMP、NAT 与 IPv6 | [第三阶段：跨网络寻址与路由](./internet/README.md) |
| 04 TCP 与 UDP | 能读懂握手、关闭、ACK、重传、窗口与拥塞现象 | [第四阶段：传输层 TCP 与 UDP](./transport/README.md) |
| 05 应用层与安全连接 | 拆解 DNS、HTTP、TLS、HTTP/2/3 和 WebSocket/gRPC 的职责 | [第五阶段：应用层协议与安全连接](./application/README.md) |
| 06 网络编程 | 理解 Socket、消息边界、非阻塞 IO，并完成跨语言通信 | [第六阶段：Socket 与网络编程](./programming/README.md) |
| 07 抓包与排障 | 用证据把 DNS、路由、TCP、TLS、HTTP 与应用故障区分开 | [第七阶段：网络故障定位](./operations/README.md) |
| 08 性能、安全与容器网络 | 从吞吐/尾延迟、安全边界与容器网络角度评价通信架构 | [第八阶段：性能与云原生通信](./advanced/README.md) |

每个阶段按对应入口的**“按路径学”**顺序阅读，遇到第一次出现的术语查[基础术语表](./glossary.md)；不要求按照固定时间表推进。

### 第一阶段：网络直觉与分层

[从浏览器请求理解整个链路](./foundations/first-network-request.md) → [网络为什么分层和封装](./foundations/layers-and-encapsulation.md) → [域名、IP、MAC 与端口各代表什么](./foundations/four-kinds-of-address.md)。

### 第二阶段：局域网与接入

[交换机、ARP 和以太网](./lan/ethernet-switch-arp.md) → [DHCP 自动分配地址](./lan/dhcp-automatic-addressing.md) → [Wi-Fi 无线链路](./lan/wifi-and-ethernet.md)。

### 第三阶段：IP 与路由

[IP、子网、CIDR 计算、网关与路由（合并后的主知识页）](./ip-subnet-and-routing.md) → [ICMP、ping 与 traceroute](./internet/icmp-and-path-probing.md) → [NAT、SNAT/DNAT 与端口转发](./nat-and-port-forward.md) → [IPv6](./internet/ipv6-first-look.md)。

### 第四阶段：TCP 与 UDP

[TCP 和 UDP 的承诺](./transport/tcp-vs-udp.md) → [端口拒绝与超时](./tcp-udp-refused-vs-timeout.md) → [TCP 握手和连接关闭](./transport/tcp-connection-lifecycle.md) → [TCP 可靠传输](./transport/tcp-reliability.md) → [流量与拥塞控制](./transport/tcp-congestion-control.md)。

### 第五阶段：应用层与安全连接

[DNS 查询与缓存](./dns-name-to-address.md) → [HTTP 请求与响应](./application/http-core.md) → [HTTPS/TLS](./application/https-tls.md) → [HTTP/1.1、HTTP/2 和 HTTP/3](./application/http-versions.md) → [WebSocket 与 gRPC](./application/websocket-grpc.md)。

### 第六阶段：网络编程

[Socket 生命周期](./programming/socket-lifecycle.md) → [TCP 消息边界与长度前缀](./programming/tcp-message-framing.md) → [阻塞/非阻塞与 IO 多路复用](./programming/io-multiplexing.md) → [Java NIO 与 Netty](./programming/java-nio-netty.md) → [Qt QTcpSocket](./programming/qt-network.md)。

### 第七阶段：抓包与排障

[按协议层排查](./operations/troubleshooting-order.md) → [Wireshark/tcpdump](./operations/packet-capture-basics.md) → [超时、重试与幂等](./operations/timeouts-retries-idempotency.md) → [代理与负载均衡](./operations/reverse-proxy-load-balancer.md)。

### 第八阶段：性能、安全与容器网络

[带宽、RTT、吞吐与 P99](./advanced/network-performance.md) → [网络安全边界](./advanced/network-security.md) → [容器和 Kubernetes 网络](./advanced/container-networking.md)。

## 如何验收：以可独立解释和观察为准

| 阶段 | 必须独立完成的验收动作 | 达标标准 |
|---|---|---|
| 01 | 画出一次网页请求的主要路径；区分域名、IP、MAC、端口 | 能说出每个标识解决哪个问题，准确标出封装的主要层次 |
| 02 | 查看本机网卡地址、邻居缓存和默认网关 | 能解释一次 ARP 查找为何出现，以及交换机与路由器职责的区别 |
| 03 | 计算 `192.168.1.40/27` 和 `10.20.30.70/26` 的网络地址；查看路由表 | 算对网络范围，能解释本地通信与跨网段通信的下一跳 |
| 04 | 识别一段 SYN/SYN-ACK/ACK 抓包，解释 ACK、FIN、RST 与重传 | 不把连接成功等同于应用成功；能区分接收窗口与拥塞窗口 |
| 05 | 用 curl 观察一次 HTTPS 请求；判断 DNS、TCP、TLS、HTTP 各环节是否通过 | 能准确解释 404、连接拒绝、证书验证失败属于不同阶段 |
| 06 | 定义 4 字节大端长度前缀并实现跨语言发送/接收 | 连续或拆分发送消息都能正确还原；能解释 `recv()` 可能读不全 |
| 07 | 面对“服务连不上”，依次收集 DNS、路由、端口、TLS 和应用证据 | 提交完整的“现象 → 假设 → 验证 → 排除 → 结论”过程，而非凭猜测下结论 |
| 08 | 针对吞吐不足、P99 偏高或容器网络隔离，提出排查路径 | 能说出要观察哪些指标、如何验证瓶颈、优化措施的副作用 |

**升级条件**：不看答案、能解释机制、能拿到可重复的证据并完成本阶段验收，即可进入下一阶段。如果只记住术语却无法解释抓包/命令结果，应回到前一阶段补齐。

## 按症状找：把概念应用到具体问题

| 观察到的现象 | 先查哪个知识点 |
|---|---|
| 域名打不开，但直接访问 IP 可能正常 | [DNS](./dns-name-to-address.md) |
| 两个地址是否同网段无法判断 | [IP、CIDR、路由](./ip-subnet-and-routing.md) |
| `connection refused` 或 `timeout` | [端口拒绝与超时](./tcp-udp-refused-vs-timeout.md) |
| 发送一次却接收多次，或者接收到半个消息 | [TCP 消息边界](./programming/tcp-message-framing.md) |
| HTTPS 握手/证书出错 | [TLS](./application/https-tls.md) |
| HTTP 返回 502/504 | [反向代理与负载均衡](./operations/reverse-proxy-load-balancer.md) |
| Qt Socket 跨线程或事件循环卡顿 | [Qt 网络](./programming/qt-network.md) |
| 宿主机可访问、容器内不可访问 | [容器网络](./advanced/container-networking.md) |

## 按决策查：先判断问题属于哪个层次

- **选择通信协议**：先明确消息边界、可靠性、交互模式，再评价 TCP、UDP、HTTP、WebSocket、gRPC。
- **选择并发模型**：先保证 Socket 正确性和完整的收发语义，再评价非阻塞 IO、事件循环或 Netty。
- **决定是否重试**：先回答“请求可能执行成功了吗、重复执行是否安全”，再制定超时与重试策略。
- **决定是否调优**：先有耗时、吞吐、丢包和尾延迟证据，再讨论参数和架构取舍。

更多资料请查[高质量教程、权威文档与经验帖索引](./reading-list.md)。实践工程、实验代码和故障复盘集中保存在独立项目域，由项目文档引用这里的基础知识。

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-14 | zmd6s6 | 从目录列表改为线性学习路径 |
| 2026-10-15 | zmd6s6 | 扩展为 16 周零基础到架构实战路线，接入原有四篇与实验、资料索引 |
| 2026-10-15 | zmd6s6 | 按 AGENTS.md 将项目实践入口从基础域移除，保留纯知识验收 |
| 2026-10-15 | zmd6s6 | 去除时间安排，统一为八阶段与逐阶段验收；整合旧知识文档的导航 |
