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

你已经知道地址与传输，才能讨论双方究竟按什么格式“点单”，以及账号密码如何安全交换。完整 HTTPS 请求顺序要到前几篇都学过之后再看。

## 按路径学

1. [输入网站名字后，如何找到地址（DNS）](../dns-name-to-address.md)
2. [浏览器怎样说“我要什么”，网站怎样答复（HTTP）](./http-core.md)
3. [怎样给这段对话加身份核验和加密保护（HTTPS/TLS）](./https-tls.md)
4. [不同 HTTP 版本改变了哪些传输效率问题](./http-versions.md)
5. **[综合复盘：完整 HTTPS 网页请求为什么有这些步骤](./browser-request-walkthrough.md)**
6. [聊天与远程调用为什么有 WebSocket 和 gRPC](./websocket-grpc.md)

## 按症状找
| 现象 | 先学 |
|---|---|
| 域名解析不稳定 | [DNS](../dns-name-to-address.md) |
| 返回 400/401/404/502 | [HTTP](./http-core.md) |
| 证书错误、TLS 握手失败 | [HTTPS](./https-tls.md) |
| 实时推送或服务间 RPC | [WebSocket/gRPC](./websocket-grpc.md) |

## 本阶段如何验收

能解释 DNS 解决找地址、HTTP 解决业务格式、TLS 解决通信安全，最后不用背图就能复盘一种典型 HTTPS 请求。

不能独立解释时，请回到首次出现该名词的文章，而不是重新背一遍缩写。

## 按决策查
- 先明确业务通信语义，再选协议/框架；不要单纯追求“新版本”。
## 相关知识
- [总学习地图](../README.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 初建线性学习内容及验证问题 |
| 2026-10-15 | zmd6s6 | 旧 DNS 笔记纳入应用层主线，取消新旧版本区分 |
| 2026-10-15 | zmd6s6 | 按真正零基础的知识依赖重排入口，增加日常场景与阶段验收 |
