---
title: 实验 03：亲手算子网并找出本机下一跳
author: zmd6s6
description: 通过 CIDR 计算与系统路由表建立跨网段直觉。
category: projects
tags:
  - networking
  - ip
  - lab
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 实验 03：亲手算子网并找出本机下一跳

## 要验证的现象
`192.168.10.30/27` 和 `192.168.10.40/27` 看着相近，但落在不同子网。

## 前置知识
[IP、子网与路由](../../networking/ip-subnet-and-routing.md) → [CIDR 计算](../../networking/internet/subnet-cidr-calculation.md)。

## 纸笔步骤
1. `/27` 留下 5 位主机位，块大小 `32`。
2. `192.168.10.30` 位于 `192.168.10.0/27`。
3. `192.168.10.40` 位于 `192.168.10.32/27`。
4. 各自网络地址和广播地址不同，跨网段通常要经过路由。

## 查真实系统
Linux：
```bash
ip -4 addr
ip route
ip route get 1.1.1.1
```
Windows:
```powershell
ipconfig /all
route print -4
```
不要求电脑能真的连到 `1.1.1.1`，`ip route get` 观察的是本机的路由选择；不同系统命令机制不同。

## 验收
计算 `10.10.2.130/26` 的网络/广播地址；指出本机默认网关与出口接口，解释为什么两个同公司地址可能不同网段。

## 记录
手写计算过程，复制路由表有关行（脱敏公司内部地址后再分享）。

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 新建动手实验与验收标准 |
