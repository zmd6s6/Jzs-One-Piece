---
title: 实验 02：一次域名解析与一次 HTTPS 请求的区别
author: zmd6s6
description: 使用系统解析工具和 curl 区分 DNS、IP、TLS 与 HTTP。
category: projects
tags:
  - networking
  - dns
  - lab
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 实验 02：一次域名解析与一次 HTTPS 请求的区别

## 要验证的现象
名字解析只是获取连接线索，不意味着业务服务已经可用。

## 前置知识
[域名、IP、端口](../../networking/foundations/four-kinds-of-address.md) → [DNS](../../networking/dns-name-to-address.md)。

## 环境与命令
```bash
nslookup example.com
curl -v https://example.com/ -o /dev/null
```
Windows PowerShell 可用 `Resolve-DnsName example.com`；若 `curl` 是系统别名，请用 `curl.exe`。无外网环境可只记录 DNS 行为并说明限制。

## 应该观察什么
- `nslookup` 显示本次解析器返回的 IP，可能有 IPv4/IPv6；缓存和网络环境会影响结果。
- `curl -v` 显示实际选择的地址、连接尝试、TLS 协商和 HTTP 响应；不一定每次恰好使用 `nslookup` 返回的第一个地址。
- 换 DNS 服务器、代理或 VPN 会改变路径；不要通过一次查询推断全网恒定结果。

## 验收问题
1. A 与 AAAA 记录的区别是什么？
2. 为什么 DNS 解析成功后，仍可能在 TCP/TLS 层失败？
3. 为什么直接按 IP 访问 HTTPS 站点可能出现证书主机名不匹配？

## 记录
把观测分为“解析”“连接”“TLS”“HTTP”四栏，分别写下证据。

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 新建动手实验与验收标准 |
