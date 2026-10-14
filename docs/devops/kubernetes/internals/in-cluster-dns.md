---
title: 集群内的 DNS：容器里的短名是怎么翻译的
author: zmd6s6
description: 集群内置 DNS（CoreDNS）的工作方式：短名补全后缀的规则、Service 名与 headless 的两种答案、ExternalName 的 CNAME 本质，以及负缓存。
category: devops
tags:
  - kubernetes
  - internals
  - dns
status: active
created: 2026-10-14
updated: 2026-10-14
---

# 集群内的 DNS：容器里的短名是怎么翻译的

> 先看：[DNS：名字是怎么变成地址的](../../../networking/dns-name-to-address.md)（A 记录 vs CNAME、缓存与负缓存）。

## 集群里谁是电话簿

所有容器都使用同一个内置 DNS（CoreDNS）。容器里查 `dbsvr` 这样的短名时，DNS 会**自动补全后缀逐个试**（比如先试 `dbsvr.当前命名空间.svc.cluster.local`，再试更短后缀）——这是"短名能用的代价：一次查询变多次"。补全规则由容器里 `/etc/resolv.conf` 的 `search` 行决定（`ndots:5` 的含义：名字里点数不足 5 个就先补后缀）。

## 两种名字，两种答案

| 名字类型 | DNS 返回什么 | 什么时候用 |
|---|---|---|
| 普通 Service 名 | **虚拟地址**（ClusterIP，见[请求旅程](./request-journey.md)——后面还有一跳转接） | 集群内的普通服务 |
| headless Service 名（`clusterIP: None`） | **后端真实地址列表** | 想直接拿到后端、或指向集群外地址（配 Endpoints） |

指向集群外数据库的标准姿势（headless + Endpoints "通讯录"写法）在[这起事故](../incidents/externalname-to-ip-nxdomain.md)里有完整推导。

## ExternalName 的本质是 CNAME

ExternalName 类型的登记只产生一条 CNAME 记录（"去找那个名字"）。目标必须是**可再查的名字**——填 IP 字面量必死，原因见[DNS 基础](../../../networking/dns-name-to-address.md)的 CNAME 一节。

## 负缓存

CoreDNS 对"查无此名"也有约 30 秒负缓存——改完解析立刻测会**依然失败**，等一分钟再下结论。

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-14 | zmd6s6（AI 辅助） | 从《原理篇》长文拆分独立成篇 |
