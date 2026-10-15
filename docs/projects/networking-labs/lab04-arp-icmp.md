---
title: 实验 04：观察 ARP、邻居缓存与 ping 的能力边界
author: zmd6s6
description: 用本机邻居表、授权局域网与 ICMP 理解 L2/L3 分工。
category: projects
tags:
  - networking
  - arp
  - icmp
  - lab
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 实验 04：观察 ARP、邻居缓存与 ping 的能力边界

## 要验证的现象
即便已知道 IP，同一以太网链路发送 IPv4 包仍常需先找到下一跳的 MAC。ping 则观察网络层 ICMP 回显，两者不是一回事。

## 前置知识
[交换机与 ARP](../../networking/lan/ethernet-switch-arp.md) → [ICMP 诊断](../../networking/internet/icmp-and-path-probing.md)。

## 安全实践
在自己的电脑上先查看默认网关（Linux `ip route`、Windows `ipconfig`），不要用本文示例地址替代真实网关。仅对自己的网关或授权测试目标使用 ping。

Linux：
```bash
ip neigh
ping -c 4 <YOUR_GATEWAY_IP>
ip neigh
```
Windows:
```powershell
arp -a
ping -n 4 <YOUR_GATEWAY_IP>
arp -a
```
这里的尖括号占位符需要替换成实际网关地址；不能原样作为可执行命令。

## Wireshark 可选步骤
在有线/Wi-Fi 接口观察过滤器 `arp || icmp`；已缓存 ARP 时不一定有请求包。若不便捕获真实网络，使用 [Kurose/Ross 以太网与 ARP 官方实验](https://gaia.cs.umass.edu/kurose_ross/wireshark.php)附带的抓包样本。

## 验收
分别解释 ARP 与 ICMP 解决的问题；说出为什么“ping 不通”并不逻辑等价于“HTTP 一定不通”。

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 新建动手实验与验收标准 |
