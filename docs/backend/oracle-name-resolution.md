---
title: Oracle 名字解析、同义词与权限
author: zmd6s6
description: Oracle 按连接账号解析未限定表名的规则、同义词机制、ORA-00942 的双重含义（表不存在 vs 无权限）——理解这些能解释"同一句 SQL 换个用户就报错"的怪象。
category: backend
tags:
  - oracle
  - fundamentals
status: active
created: 2026-10-14
updated: 2026-10-14
---

# Oracle 名字解析、同义词与权限

## 名字解析：谁的"302 房间"

Oracle 里**未加 schema 前缀的表名按"当前连接账号"解析**。类比：说"302 房间"时，指的是"你所在这栋楼的 302"——不同楼的人理解不同。

```sql
-- 账号 A 下的表，账号 B 直接查：
SELECT * FROM orders;           -- B 会找 B.orders → 不存在 → ORA-00942
SELECT * FROM A.orders;         -- 加了前缀，只要 B 有权限就能查到
```

## 同义词（synonym）：别名登记

**同义词**是在某个账号名下登记一个名字、指向另一个账号的表——像在通讯录里存"张三 → 张三家的电话"。登记后，这个账号就可以用短名访问：

```sql
CREATE SYNONYM B.orders FOR A.orders;   -- 在 B 名下登记别名
GRANT SELECT ON A.orders TO B;           -- 授权（同义词只解决"找得到"，权限另算）
```

## ORA-00942 的双重含义

`表或视图不存在` 这条报错**既可能是"表真不存在"，也可能是"你没有这张表的权限"**。Oracle 出于安全不区分（不向无权限者泄露对象是否存在）——这是排障时最容易忽略的一个陷阱。

**权限核对方法**：以目标账号登录，执行：

```sql
SELECT count(*) FROM all_tables WHERE table_name = '目标表';
-- 返回 0 = 看不到（要么不存在要么没权限）
-- all_tables 只列出当前账号有权限看到的表
```

## 授权基线

新环境交付时，确保**程序用到的所有账号**对**所有涉及的表**都有对应权限。做法：

1. 把授权写成 SQL 脚本（哪个账号 → 哪些表 → 什么权限），进版本库；
2. 部署前以程序账号逐表核对（上面的 `all_tables` 查询）；
3. SQL 书写约定：跨账号访问的表**一律写 `前缀.表名`**，不混用前缀和裸名。

## 相关知识

- [DNS：名字是怎么变成地址的](../networking/dns-name-to-address.md)——同构问题：DNS 按"谁在查"解析，Oracle 按"谁在连"解析
- [K8s 集群内 DNS](../devops/kubernetes/internals/in-cluster-dns.md)——K8s 里的名字解析机制

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-14 | zmd6s6 | 从事故复盘拆出纯知识部分 |
