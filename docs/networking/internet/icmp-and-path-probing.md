---
title: ping 通了为什么服务仍不可用
author: zmd6s6
description: 厘清 ICMP、路由探测与 TCP 服务健康之间的关系。
category: networking
tags:
  - icmp
  - routing
  - troubleshooting
status: active
created: 2026-10-15
updated: 2026-10-15
---

# ping 通了为什么服务仍不可用

## 先看一个现象
`ping server` 能看到回应，但访问 `server:443` 失败。因为 ping 主要测 ICMP 回显请求/应答，不会验证 TCP 端口，更不验证 HTTPS 或业务功能。

## 分辨三种测量
- **ICMP**：网络层的差错报告和诊断消息机制，如“目的不可达”；类似快递系统给出运输异常通知。
- **ping**：通常发送 ICMP Echo，估算往返时延 RTT 和应答情况；不能替代业务探活。
- **traceroute / tracert**：利用逐步调整 IP 生存时间（TTL）探查路径上的设备；中间节点可能不回应，星号不等于该节点一定断网。

## 命令
```bash
# Linux/macOS
ping -c 4 example.com
traceroute example.com
# Windows PowerShell / CMD
# ping -n 4 example.com
# tracert example.com
```

## 排查顺序
先确认 DNS 得到哪个 IP，再看本机路由/网关；接下来测到目标的网络路径和具体 TCP 端口，最后才测 TLS 与 HTTP。注意某些网络会过滤 ICMP，不能仅用 ICMP 判定连通性。

## 自测
为什么 traceroute 里某跳显示 `* * *`，最后一跳却正常？为什么这不能证明应用接口健康？

## 相关知识
- [端口拒绝和超时](../tcp-udp-refused-vs-timeout.md)
- [网络诊断流程](../operations/troubleshooting-order.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 初建线性学习笔记、例子与验收题 |
