---
title: WebSocket 和 gRPC 分别适合哪类通信
author: zmd6s6
description: 比较长连接双向消息与类型化 RPC 的通信模型。
category: networking
tags:
  - websocket
  - grpc
  - api
status: active
created: 2026-10-15
updated: 2026-10-15
---

# WebSocket 和 gRPC 分别适合哪类通信

## 先看一个现象
页面需要实时接收业务推送，服务 A 又要频繁调用服务 B。都能用 HTTP 轮询实现，但通信语义和效率未必合适。

## 两种常见工具
- **WebSocket**：在建立后提供双向消息通信通道，像电话双方随时说话；适合浏览器实时互动、实时通知等。连接持续存在需要考虑心跳、断线重连、鉴权、背压。
- **gRPC**：基于接口定义（常用 Protocol Buffers）提供类似调用本地函数的远程调用抽象，常基于 HTTP/2；适合明确类型契约的服务间 RPC，也支持流式通信。

**RPC（Remote Procedure Call）** 是“向远方服务调用函数”的编程抽象，并不能消除网络超时、不确定执行结果等分布式问题。

## 选择提示
需要浏览器实时双向消息，先考虑 WebSocket；跨语言内部服务、高频类型化调用，可评估 gRPC；普通资源查询和开放接口，REST/HTTP 往往更简单。

## 自测
为什么远程 RPC 超时后不能无条件重试一次“创建订单”？为什么 WebSocket 断线重连不等于消息自动补发？

## 相关知识
- [超时、重试与幂等](../operations/timeouts-retries-idempotency.md)
- [消息帧](../programming/tcp-message-framing.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 初建线性学习内容及验证问题 |
