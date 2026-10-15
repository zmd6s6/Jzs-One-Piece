---
title: Wireshark 抓包应该先看哪几层证据
author: zmd6s6
description: 区分捕获过滤、显示过滤与不完整抓包的误判。
category: networking
tags:
  - wireshark
  - tcpdump
  - packet
status: active
created: 2026-10-15
updated: 2026-10-15
---

# Wireshark 抓包应该先看哪几层证据

## 先用生活问题理解这一篇

你知道有快递丢失，却看不到每一站的运输记录。网络也可以在合适的位置复制正在通过的数据，观察是否发送、抵达、被确认，但这并不自动提供最终根因。

## 这些专业词分别是干什么的

- **抓包**：采集或复制经过某个网络接口的数据，像在路口查看运输流水。
- **Wireshark**：用来查看和分析抓包记录的图形工具，像把每辆运输车的记录展开。
- **tcpdump**：命令行的抓包工具，适合服务器等没有图形桌面的环境。
- **捕获过滤**：采集前决定保留哪些数据，像进仓前筛选箱子。
- **显示过滤**：采集后只展示感兴趣的记录，像已入仓后按编号搜索。

**前置知识**：[分层与包](../foundations/layers-and-encapsulation.md) → [TCP 连接](../transport/tcp-connection-lifecycle.md) → [按层排障](./troubleshooting-order.md)。

**最小观察或推演**：先运行 `curl http://127.0.0.1:8000`（需事先启动本地 HTTP 服务），再用 Wireshark 选择回环接口观察通信；不同系统是否可抓回环取决于驱动和权限。

## 再回到真实技术现象
日志说 TCP 重传，但抓包中只看到了一个方向的数据；或者已经 HTTPS 加密，分析者却试图在包里搜索明文 JSON。抓包是证据采集，不是自动产生根因。

## 两种过滤不要混淆
- **捕获过滤（capture filter）**：采集时决定哪些包保存；例如 `tcp port 8000`，使用 pcap/BPF 语法。
- **显示过滤（display filter）**：采完以后选择展示哪些；例如 `tcp.port == 8000`，使用 Wireshark 自己的语法。
前者会减少记录的包，后者不会删除已抓取的数据。

## 最常用显示过滤
```text
dns
tcp
tcp.port == 8000
ip.addr == 192.168.1.10
tcp.analysis.retransmission
tcp.flags.syn == 1
```
字段可能受 Wireshark 版本差异影响；分析标签须结合会话流和时间轴解读。

## 自己动手
Linux（请仅在自有或授权主机采集）：
```bash
sudo tcpdump -i lo -nn -s 0 -w localhost.pcap tcp port 8000
```
另外启动 `python -m http.server 8000 --bind 127.0.0.1`，用 `curl http://127.0.0.1:8000/` 访问，然后停止抓包，使用 Wireshark 打开 pcap。不同 Linux 环境环回接口名称可能变化，先用 `tcpdump -D` 或 `ip link` 确认。

## 常见误判
- TCP checksum offload 可能导致发送端本地抓包显示校验和异常，并非一定链路损坏。
- TLS 加密时只能看到 TLS/QUIC 元数据，通常不能直接看到应用明文。
- 抓包会包含敏感信息；共享前做脱敏，不记录第三方未经许可的流量。

## 自测
为什么“客户端没抓到 SYN-ACK”不一定证明服务器根本没有回复？为什么不应只看一个方向抓包？

## 相关知识
- [TCP 连接生命周期](../transport/tcp-connection-lifecycle.md)
- [HTTPS 与 TLS](../application/https-tls.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 创建、加入复现方法与自测问题 |
| 2026-10-15 | zmd6s6 | 从具体情境解释术语、补前置知识和可验证动作，降低阅读门槛 |
