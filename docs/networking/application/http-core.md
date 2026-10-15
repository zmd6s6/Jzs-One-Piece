---
title: 一个 HTTP 请求到底包含什么：方法、状态码、头和身体
author: zmd6s6
description: 理解 HTTP 无状态语义、请求/响应、缓存与连接复用。
category: networking
tags:
  - http
  - application
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 一个 HTTP 请求到底包含什么：方法、状态码、头和身体

## 先看一个现象
客户端报 502、404、超时，看起来都像“接口失败”，却对应不同层次。HTTP 是**应用层的请求/响应协议**：类似业务双方约定请求表单和回复格式，网络连接只是承载它的运输工具。

## 用 HTTP/1.1 看结构
```http
GET /api/items?page=1 HTTP/1.1
Host: example.com
Accept: application/json

```
典型响应：
```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 2

{}
```
**方法**描述意图（GET 查询、POST 提交等）；**状态码**表明响应结果（2xx 成功、3xx 重定向、4xx 客户端侧请求问题、5xx 服务端/网关失败）；**头部**携带元数据；**响应体**承载内容。

## 无状态不等于不能登录
HTTP 协议本身不要求服务端记住上一次请求；Cookie、会话、Token 是应用建立状态关联的机制。

## 请求响应与传输连接别混淆
HTTP/1.1 可以在同一 TCP 连接上传多个顺序请求（连接复用）；HTTP/2 可以在一个连接中复用多条流；HTTP/3 在 QUIC 上工作。不要把“一次 HTTP 请求”等同于“一次 TCP 连接”。

## 动手
```bash
curl -i https://example.com
curl -v --http1.1 https://example.com -o /dev/null
```
观察状态行、头与 HTTP 版本。`-I` 发送 HEAD 请求，某些服务对 HEAD 与 GET 处理不完全一致。

## 自测
为什么 200 OK 也可能返回错误的业务数据？502 和 DNS 失败哪个更靠近应用层？

## 相关知识
- [HTTPS](./https-tls.md)
- [HTTP 版本](./http-versions.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 初建线性学习内容及验证问题 |
