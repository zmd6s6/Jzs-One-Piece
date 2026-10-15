---
title: TCP 为什么要三次握手，断开后为何还会有 TIME_WAIT
author: zmd6s6
description: 理解 SYN、ACK、FIN、RST 以及连接状态的含义。
category: networking
tags:
  - tcp
  - handshake
  - time-wait
status: active
created: 2026-10-15
updated: 2026-10-15
---

# TCP 为什么要三次握手，断开后为何还会有 TIME_WAIT

## 先用生活场景理解这个问题

如果双方想像电话一样持续交流，就不能“直接对着空气说话”；要先确认双方准备就绪，结束时还要明确何时不再发送。

## 本篇新术语，逐个落地

- **TCP 连接**：两端为有序可靠传输维护的一段通信状态，像持续打开的电话通道。
- **握手**：双方开始通信时交换控制信息、同步必要状态，像双方确认“我听得见你”。
- **SYN**：表示尝试开始建立连接的 TCP 控制标志，像第一声“喂”。
- **ACK**：表示确认已收到特定范围的数据或控制信息，像回应“收到了”。
- **FIN / RST**：分别常用来表达正常结束发送与立即重置连接，像礼貌挂断与直接中断。

**学习前置**：[TCP 与 UDP 的服务模式](./tcp-vs-udp.md) → [连接失败是什么](../tcp-udp-refused-vs-timeout.md)。先能用自己的话解释这些知识，再看下面的技术机制。

**不改配置的最小观察**：Linux `ss -tan` 或 Windows `netstat -ano`，看看哪些连接处于 LISTEN、ESTABLISHED、TIME_WAIT；某个状态没观察到可能只是持续时间短。

## 再把生活里的问题对应到真实网络
`ss -tan` 里能看到 `LISTEN、ESTAB、TIME-WAIT` 等状态。服务“断开”不等于所有内核记录都立刻消失。

## 建连：为什么典型是三次
```text
客户端                         服务端
SYN (我想连，初始序列号 x)  ─────→
                        ←───── SYN+ACK (收到，初始序列号 y)
ACK (确认 y)               ─────→
               ESTABLISHED
```
这让双方确认初始序列号并相互同步；不是为了“测试三次网络通不通”。SYN、ACK 是 TCP 首部标志位。

## 断开：双向字节流可以分别关闭
FIN 表示某个方向“我不再发送更多字节”；另一方向仍可能继续传送，所以常见是四个报文段（FIN、ACK、FIN、ACK），但 ACK 与 FIN 也可能合并，不能死记所有抓包一定四条。RST 表示连接被立即重置。

**TIME_WAIT**：主动关闭方在特定状态下保留等待期，有助于处理延迟报文及重传最后 ACK 等问题。不要把 TIME_WAIT 一出现就判成故障，更不要盲目修改内核参数。

## 自己观察
```bash
# Linux
ss -tan
# Windows
# netstat -ano
```
本机通过 `python -m http.server 8000` 提供临时 HTTP 服务，另开终端用 `curl http://127.0.0.1:8000/`，观察连接状态；短连接不保证恰好捕获所有瞬态状态。

## 自测
- 为什么 SYN 发送之后不能立刻认定业务“上线”？
- FIN 与 RST 对应用读写意味着什么？

## 相关知识
- [TCP 可靠性](./tcp-reliability.md)
- [端口拒绝与超时](../tcp-udp-refused-vs-timeout.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 初建线性学习内容及验证问题 |
| 2026-10-15 | zmd6s6 | 补充零基础的生活场景、前置知识、术语实例和最小验证步骤 |
