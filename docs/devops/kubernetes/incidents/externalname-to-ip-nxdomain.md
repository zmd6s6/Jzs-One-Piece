---
title: 引用外部数据库的名字，有一种写法必然失败
author: zmd6s6
description: 用 ExternalName 给集群外数据库起别名，程序死活解析不到——CNAME 无法指向 IP 字面量；正确写法是 headless Service + Endpoints，另附 DNS 负缓存 30 秒的坑。
category: devops
tags:
  - kubernetes
  - dns
  - postmortem
status: active
created: 2026-10-14
updated: 2026-10-14
---

# 引用外部数据库的名字，有一种写法必然失败

> 先看：[DNS：名字是怎么变成地址的](../../../networking/dns-name-to-address.md)——A 记录直接给地址，CNAME 只给"再去查谁"。

## 现象

集群里的程序要访问集群外的数据库，配置统一写名字 `dbsvr`。用了 `ExternalName` 类型（登记成"另一个名字的别名"）后，程序解析不到，报 NXDOMAIN（"查无此名"）。更早的翻车版：把别名登记成了它自己（自己指向自己，死循环）。

## 根因

ExternalName 生成的 DNS 记录是 **CNAME**——"你去找那个名字"。而我们填的目标是 **IP 地址字面量**。DNS 查询的最后一步必须拿到 A 记录（名字→IP）；CNAME 的目标是 IP 字面量时，它**不是一个可以再查的名字**，查询链断在原地。

## 正确写法（headless Service + Endpoints）

可以理解为"在集群里登记一张指向外部地址的通讯录"：

```yaml
apiVersion: v1
kind: Service          # 名字叫 dbsvr，但不分配虚拟地址（clusterIP: None = headless）
metadata: { name: dbsvr }
spec:
  clusterIP: None
  ports: [{ name: db, port: 1521 }]
---
apiVersion: v1
kind: Endpoints       # 与上面同名绑定：dbsvr 的真实地址在这一条
metadata: { name: dbsvr }
subsets:
- addresses: [{ ip: 192.168.x.x }]   # 数据库真实地址
  ports: [{ name: db, port: 1521, protocol: TCP }]
```

查询 `dbsvr` 直接返回 A 记录（真实 IP），任何程序都认；**换数据库只改 Endpoints 里的 IP 一行**。机制细节见[集群内 DNS](../internals/in-cluster-dns.md)。

## 附带坑：负缓存

改完立刻测试**依然失败**——DNS 有约 30 秒"负缓存"（连"查无此名"也会被记住一阵子，见[DNS 基础](../../../networking/dns-name-to-address.md)）。等一分钟再下结论，别把改对的配置改回去。

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-14 | zmd6s6（AI 辅助） | 从《K3s 事故复盘》长文拆分独立成篇 |
