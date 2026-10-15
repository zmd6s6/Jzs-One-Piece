---
title: 计算机网络术语表：初学常见概念一站查阅
author: zmd6s6
description: 把第一次出现容易混淆的网络术语转成白话定义。
category: networking
tags:
  - glossary
  - reference
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 计算机网络术语表：每个词都对应一个生活例子

看到新的专业缩写先不要死背，把它翻译成三件事：**它是什么、它解决什么问题、现实里能看到什么**。本页是随时回查的词典，不代替对应章节的逐步讲解。

## 第一阶段：网页与数字是什么

| 你看到的词 | 一句话解释 | 生活类比或最小例子 | 从哪篇学起 |
|---|---|---|---|
| **浏览器** | 打开网页的程序。 | 例如 Edge、Chrome、Safari。 | [网页入门](./foundations/first-network-request.md) |
| **客户端 client** | 主动提出需求的软件或一方。 | 像点餐的顾客。 | [客户端/服务器](./foundations/first-network-request.md) |
| **服务器 server** | 收到需求并处理、提供结果的程序或计算机。 | 像餐厅接单的厨房。 | [客户端/服务器](./foundations/first-network-request.md) |
| **请求 request** | 客户端发来的“我要什么”。 | “请给我一份菜单”。 | [请求与响应](./foundations/first-network-request.md) |
| **响应 response** | 服务端回给请求方的结果。 | “这份菜单给你”。 | [请求与响应](./foundations/first-network-request.md) |
| **比特 bit** | 只能表示 0 或 1 的信息单位。 | 一盏灯的开/关。 | [比特和字节](./foundations/bits-bytes-and-packets.md) |
| **字节 byte** | 通常由 8 比特组成。 | 8 盏灯的一组组合。 | [比特和字节](./foundations/bits-bytes-and-packets.md) |
| **二进制** | 只用 0、1 表示数字。 | 十进制 5 可写成二进制 101。 | [比特和字节](./foundations/bits-bytes-and-packets.md) |
| **编码** | 约定一串数字代表什么内容。 | UTF-8 规定文字怎么变成字节。 | [比特和字节](./foundations/bits-bytes-and-packets.md) |
| **协议 protocol** | 双方约定怎么写、发、读一份消息。 | 像双方要用同一种点单格式。 | [分层](./foundations/layers-and-encapsulation.md) |
| **封装** | 外面再加一层传输需要的信息。 | 像快递包裹贴配送标签。 | [分层](./foundations/layers-and-encapsulation.md) |
| **网络包 packet** | 网络上运送的一份数据单位的常见统称。 | 像分批运送的一个箱子。 | [数据包](./foundations/bits-bytes-and-packets.md) |
| **域名** | 人们易记的网站名字。 | example.com 像店铺名称。 | [四种地址](./foundations/four-kinds-of-address.md) |
| **IP 地址** | 用于网络寻址的数字地址。 | 192.168.1.10，像跨城寄送地址。 | [四种地址](./foundations/four-kinds-of-address.md) |
| **MAC 地址** | 常用于本地链路传递的接口标识。 | 类似当前配送段的交接标签。 | [四种地址](./foundations/four-kinds-of-address.md) |
| **端口 port** | 标识设备里的某个网络通信服务端点。 | 443 像楼里的服务窗口编号。 | [四种地址](./foundations/four-kinds-of-address.md) |

## 第二至三阶段：网络怎样找到路

| 你看到的词 | 一句话解释 | 生活类比或最小例子 | 从哪篇学起 |
|---|---|---|---|
| **网卡** | 电脑接入网络所用的接口。 | 有线网口或无线网络接口。 | [家庭网络设备](./lan/home-network-devices.md) |
| **局域网 LAN** | 家里或办公室这样的本地网络。 | 一个小区内部的配送网络。 | [家庭网络设备](./lan/home-network-devices.md) |
| **Wi-Fi** | 设备通过无线电波连接网络的技术。 | 不用插网线的网络入口。 | [家庭网络设备](./lan/home-network-devices.md) |
| **交换机** | 在本地链路中按地址转发数据的设备。 | 像楼里的分拣台。 | [交换机](./lan/ethernet-switch-arp.md) |
| **ARP** | 查询某个本地 IPv4 地址对应链路地址的协议。 | 找某户对应的收件标签。 | [ARP](./lan/ethernet-switch-arp.md) |
| **DHCP** | 自动给设备提供地址等网络配置的协议。 | 像新住户在物业登记。 | [DHCP](./lan/dhcp-automatic-addressing.md) |
| **子网 subnet** | 按相同网络前缀分在一起的地址范围。 | 像同一小区门牌区间。 | [子网和 CIDR](./ip-subnet-and-routing.md) |
| **CIDR /27** | 用斜杠后的数字标识网络前缀位数。 | 192.168.1.10/27 属于 .0–.31 区间。 | [子网和 CIDR](./ip-subnet-and-routing.md) |
| **路由器 router** | 在不同网络间选择转发下一步的设备。 | 像跨区路口。 | [IP 和路由](./ip-subnet-and-routing.md) |
| **默认网关** | 去往其他网络时通常先经过的下一站。 | 出小区先过大门。 | [IP 和路由](./ip-subnet-and-routing.md) |
| **NAT** | 转发时改写报文来源或目的地址等信息。 | 像公司总机替分机联络外部。 | [NAT](./nat-and-port-forward.md) |
| **ICMP** | 用来传递网络诊断与某些错误信息的协议。 | 配送失败通知。 | [网络探测](./internet/icmp-and-path-probing.md) |
| **ping** | 测试回声应答的工具，不能代替业务健康检测。 | 敲门听回声。 | [网络探测](./internet/icmp-and-path-probing.md) |
| **IPv6** | 128 位网络地址的 IP 版本。 | 2001:db8::1（文档保留示例地址）。 | [IPv6](./internet/ipv6-first-look.md) |

## 第四至五阶段：传送内容与读懂内容

| 你看到的词 | 一句话解释 | 生活类比或最小例子 | 从哪篇学起 |
|---|---|---|---|
| **TCP** | 可靠、有序的连续字节流传输服务。 | 像按顺序收齐长信。 | [TCP/UDP](./transport/tcp-vs-udp.md) |
| **UDP** | 发送有边界的数据报，但协议自身不保证交付。 | 像逐张投递明信片。 | [TCP/UDP](./transport/tcp-vs-udp.md) |
| **SYN / ACK** | TCP 建连与确认所用的控制标志。 | “喂，你在吗？”“收到了”。 | [TCP 握手](./transport/tcp-connection-lifecycle.md) |
| **重传** | 为弥补未确认的数据再次发送。 | 重新寄丢掉的那几页。 | [TCP 可靠性](./transport/tcp-reliability.md) |
| **HTTP** | 网站与客户端约定请求、响应语义的协议。 | 双方的点单语言。 | [HTTP](./application/http-core.md) |
| **GET / POST** | HTTP 请求动作类别。 | “我要看菜单”与“我要提交订单”。 | [HTTP](./application/http-core.md) |
| **HTTP 状态码** | 服务器在响应中用数字说明处理结果。 | 200 成功、404 资源未找到。 | [HTTP](./application/http-core.md) |
| **URL** | 资源完整定位地址。 | https://example.com/products。 | [综合复盘](./application/browser-request-walkthrough.md) |
| **DNS** | 按名字查询有关地址等信息的系统。 | 联网前先查电话簿。 | [DNS](./dns-name-to-address.md) |
| **缓存 cache** | 临时保留之前拿到的结果。 | 记在便条上的地址。 | [DNS](./dns-name-to-address.md) |
| **TLS** | 保护通信机密性、完整性及身份验证的机制。 | 带身份证明的密封信。 | [TLS](./application/https-tls.md) |
| **HTTPS** | 采用安全传输机制的 HTTP。 | 同样点单，但内容经过保护。 | [HTTPS](./application/https-tls.md) |
| **QUIC** | 基于 UDP 的安全传输机制，支持多个流。 | 提供多条逻辑通道的传输服务。 | [HTTP 版本](./application/http-versions.md) |

## 第六至八阶段：自己编程、排障与优化

| 你看到的词 | 一句话解释 | 生活类比或最小例子 | 从哪篇学起 |
|---|---|---|---|
| **Socket** | 程序使用操作系统网络通信能力的接口。 | 给程序配一个电话端点。 | [Socket](./programming/socket-lifecycle.md) |
| **粘包/半包** | TCP 读取次数与业务发送次数对不上。 | 寄两封信却被分批拆开读取。 | [消息分帧](./programming/tcp-message-framing.md) |
| **IO 多路复用** | 同时等待多个网络端点的就绪事件。 | 一块叫号屏盯着多个窗口。 | [IO 多路复用](./programming/io-multiplexing.md) |
| **抓包** | 在一个位置观察通过的网络数据。 | 从路口记录观察快递路径。 | [抓包](./operations/packet-capture-basics.md) |
| **超时** | 等待了预设期限仍无所需结果。 | 两秒还没回话，不等于没执行。 | [超时重试](./operations/timeouts-retries-idempotency.md) |
| **幂等** | 重复执行同一业务操作不叠加效果。 | 同一订单号不重复扣款。 | [幂等](./operations/timeouts-retries-idempotency.md) |
| **反向代理** | 代后方服务先接收客户端请求的中间组件。 | 像总机前台。 | [代理](./operations/reverse-proxy-load-balancer.md) |
| **带宽** | 链路设计传输能力。 | 高速路最大通行能力。 | [性能](./advanced/network-performance.md) |
| **延迟** | 完成一次操作需要等待多久。 | 开车到终点花费的时间。 | [性能](./advanced/network-performance.md) |
| **P99** | 99% 请求不超过的延迟分位数。 | 关注少量特别慢的订单。 | [性能](./advanced/network-performance.md) |
| **防火墙** | 决定允许哪些流量通过的规则或设备。 | 楼栋门禁。 | [安全](./advanced/network-security.md) |
| **认证 / 授权** | 前者确认是谁，后者确认能做什么。 | 查身份证、查权限卡。 | [安全](./advanced/network-security.md) |
| **网络命名空间** | Linux 隔离不同网络视图的机制。 | 每间办公室各有自己的电话表。 | [容器网络](./advanced/container-networking.md) |


## 使用方法与自测

遇到新词时，先读该行的白话定义与最小例子，再打开最右侧知识页。从中找一个可以实际观察的行为；如果你解释不了“为什么需要它”，就暂时不要进入下一篇。

对任何词试着回答：**如果没有这套机制，网络会遇到什么具体麻烦？它解决了哪一步？一个例子是什么？**

## 相关知识

- [零基础阶段式学习地图](./README.md)
- [外部入门教材与实验资源](./reading-list.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 创建、建立学习入口和参考资料 |
| 2026-10-15 | zmd6s6 | 子网和 CIDR 统一指向既有 IP 与路由主文档 |
| 2026-10-15 | zmd6s6 | 将术语表改为分阶段检索，每个词补白话解释、最小例子与前置文档 |
