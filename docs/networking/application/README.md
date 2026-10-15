---
title: 第五阶段：应用层协议与安全连接
author: zmd6s6
description: 从 DNS、HTTP 到 TLS，再到 HTTP/3，理解用户看到的网络行为。
category: networking
tags:
  - map
  - application
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 第五阶段：应用层协议与安全连接

## 按路径学
1. [DNS：从名字到地址](../dns-name-to-address.md)
2. [HTTP 请求、响应、状态码和连接复用](./http-core.md)
3. [HTTPS 与 TLS 证书验证](./https-tls.md)
4. [HTTP/1.1、HTTP/2、HTTP/3 的取舍](./http-versions.md)
5. [WebSocket 与 gRPC 适合何时使用](./websocket-grpc.md)

## 按症状找
| 现象 | 先学 |
|---|---|
| 域名解析不稳定 | [DNS](../dns-name-to-address.md) |
| 返回 400/401/404/502 | [HTTP](./http-core.md) |
| 证书错误、TLS 握手失败 | [HTTPS](./https-tls.md) |
| 实时推送或服务间 RPC | [WebSocket/gRPC](./websocket-grpc.md) |

## 按决策查
- 先明确业务通信语义，再选协议/框架；不要单纯追求“新版本”。
## 相关知识
- [总学习地图](../README.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 初建线性学习内容及验证问题 |
| 2026-10-15 | zmd6s6 | 旧 DNS 笔记纳入应用层主线，取消新旧版本区分 |
