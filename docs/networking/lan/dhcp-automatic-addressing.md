---
title: 电脑插上网线后，IP 和网关从哪里来
author: zmd6s6
description: 理解 DHCP 的租约、DORA、常见异常与命令。
category: networking
tags:
  - dhcp
  - ipv4
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 电脑插上网线后，IP 和网关从哪里来

## 先看一个现象
新电脑连上网络，不手填 IP 也能上网。原因通常是 **DHCP**：向设备自动出租地址及网络参数的协议，像前台自动分配房间和入住期限。

## 简化流程：DORA
1. Discover：客户端广播/发送发现请求，找 DHCP 服务器。
2. Offer：服务器提出可租用的 IPv4 地址及配置。
3. Request：客户端请求使用其中一个方案。
4. Acknowledge：服务器确认租约，客户端配置地址、掩码、网关、DNS 等。

**租约（lease）** 不是永久产权；到期前客户端通常会续租。不同网络可能有中继代理，不能认定 DHCP 服务器必然和客户端处在同一广播域。

## 动手核对
Windows:
```powershell
ipconfig /all
```
Linux:
```bash
ip addr
ip route
```
观察 DHCP 是否启用、接口 IP、默认网关和 DNS。谨慎使用 `ipconfig /release` 等命令，远程办公时释放地址可能断开连接。

## 易错结论
- 拿到 IP ≠ DNS 可用 ≠ 网关可达 ≠ Internet 可达。
- `169.254.0.0/16` 的自动私有 IPv4 地址经常提示未从 DHCP 获得正常租约，但还要结合配置分析。
- IPv6 自动地址配置通常使用 SLAAC、DHCPv6 等机制，不能完全照搬 IPv4 DHCP 模型。

## 相关知识
- [域名、IP、MAC、端口](../foundations/four-kinds-of-address.md)
- [Wi-Fi 与有线接入](./wifi-and-ethernet.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 初建线性学习笔记、例子与验收题 |
