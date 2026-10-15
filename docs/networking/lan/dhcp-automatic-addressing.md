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

## 先用生活场景理解这个问题

新手机第一次连上家里的 Wi-Fi，没有人手工告诉它“你叫什么地址”，为什么它就能联网？因为网络通常会有一项自动发放配置的服务。

## 本篇新术语，逐个落地

- **DHCP（动态主机配置协议）**：网络里的自动登记处，向新设备提供可用的地址及其他配置。
- **IP 地址**：设备在网络中的地址，详见[四种地址](../foundations/four-kinds-of-address.md)。
- **子网掩码**：判断本地地址范围的一条规则，详见[子网与路由](../ip-subnet-and-routing.md)。
- **默认网关**：访问别的网络时通常首先交给的设备，就像小区出口。

**学习前置**：[家里的设备](./home-network-devices.md) → [为什么需要 IP](../foundations/four-kinds-of-address.md)。先能用自己的话解释这些知识，再看下面的技术机制。

**不改配置的最小观察**：Windows 运行 `ipconfig /all`，找到“DHCP 已启用”“DHCP 服务器”和“租约”字段；若显示手动配置，说明你的网络未使用 DHCP 分配当前地址。

## 再把生活里的问题对应到真实网络
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
| 2026-10-15 | zmd6s6 | 补充零基础的生活场景、前置知识、术语实例和最小验证步骤 |
