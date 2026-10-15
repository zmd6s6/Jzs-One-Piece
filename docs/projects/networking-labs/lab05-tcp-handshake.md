---
title: 实验 05：抓到一次 TCP 建连、请求和关闭
author: zmd6s6
description: 从 SYN、ACK 到 FIN 对照客户端与服务端状态变化。
category: projects
tags:
  - networking
  - tcp
  - wireshark
  - lab
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 实验 05：抓到一次 TCP 建连、请求和关闭

## 预期证据
抓包中能把“建立 TCP 连接”和“HTTP 请求”区分开，并解释每个方向源/目的端口。

## 前置知识
[TCP 生命周期](../../networking/transport/tcp-connection-lifecycle.md) → [Wireshark 基础](../../networking/operations/packet-capture-basics.md)。

## 步骤
终端 A：
```bash
python -m http.server 8000 --bind 127.0.0.1
```
Wireshark 选择本机环回接口（Windows 通常是 Npcap Loopback Adapter；Linux 常为 `lo`，macOS 按实际接口选择），以显示过滤器 `tcp.port == 8000` 观察。

终端 B：
```bash
curl --http1.1 --no-keepalive http://127.0.0.1:8000/
```
注意某些 curl 版本或构建不支持 `--no-keepalive`；若报未知选项，直接使用 `curl --http1.1 http://127.0.0.1:8000/` 即可，重点观察连接和应用请求。

## 怎么读包
1. 找到同一连接的 SYN、SYN+ACK、ACK。
2. 对比源地址、目标地址、端口是否互换。
3. 确认 HTTP 请求在握手之后。
4. 查看连接收尾是否出现 FIN/ACK，或是否存在 RST；行为随实现和时机变化。
5. 用 `Follow → TCP Stream` 阅读应用层明文。

## 验收
用自己的抓包序号写出“包号 → 标志位 → 此包在流程中的意义”；不要写死每次抓包的包号都一样。保存一份 pcap（分享前确认无敏感信息）。

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 新建动手实验与验收标准 |
