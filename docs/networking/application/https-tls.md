---
title: HTTPS 为什么可信：TLS 握手、证书与加密各负责什么
author: zmd6s6
description: 明确机密性、完整性、身份认证及常见证书错误。
category: networking
tags:
  - tls
  - https
  - security
status: active
created: 2026-10-15
updated: 2026-10-15
---

# HTTPS 为什么可信：TLS 握手、证书与加密各负责什么

## 先看一个现象
浏览器出现“证书无效”，即使 TCP 已连接，也不应视为可以安全发送账号密码。**HTTPS = HTTP 通过安全传输通道传递**；在传统 TCP 场景里常用 TLS，HTTP/3 的 QUIC 则整合 TLS 1.3。

## 三种安全目标
- **机密性**：别人难以看懂内容，像把信装进只有双方有钥匙的保险箱。
- **完整性**：内容被篡改时能够检测。
- **身份认证**：客户端验证自己连接的是否是目标服务，而非冒名者。

TLS 握手协商版本、加密参数、密钥材料并验证证书链及主机名（依客户端验证策略）。证书类似由受信任机构签发的身份证明；“加密了”不自动意味着“对方可信”。

## 动手验证
```bash
openssl s_client -connect example.com:443 -servername example.com </dev/null
curl -v https://example.com -o /dev/null
```
`-servername` 指定 SNI，帮助同一 IP 的服务器选择对应证书。`openssl s_client` 的连接成功输出不等同于自动完整验证所有证书/主机名规则，需查看验证配置和输出。

## 常见失败分层
- TCP 连接失败：先查地址、路由、端口。
- TLS 协商失败：查版本、证书链、SNI、主机名、时钟、代理。
- TLS 成功但 HTTP 4xx/5xx：转查 HTTP 层与应用日志。

## 不要这样做
生产排障不要把 `curl -k` 当最终修复，它只是关闭证书验证的临时诊断选项，会弱化安全性。

## 自测
为什么证书过期不等于网络断开？为什么开启 TLS 后抓包通常看不到 HTTP 明文？

## 相关知识
- [HTTP 基础](./http-core.md)
- [网络安全边界](../advanced/network-security.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 初建线性学习内容及验证问题 |
