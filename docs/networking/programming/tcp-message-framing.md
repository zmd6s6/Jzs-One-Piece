---
title: 一次 send 为什么不等于一次 recv：TCP 消息边界如何设计
author: zmd6s6
description: 通过长度前缀实现跨 C++/Java 的可靠应用消息解析。
category: networking
tags:
  - tcp
  - protocol
  - framing
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 一次 send 为什么不等于一次 recv：TCP 消息边界如何设计

## 先用一个生活问题入门

你连续发了两条聊天消息，但对方一次读取时可能只读到半条，或把两条一起读到了。传输并没有出错，是因为 TCP 提供连续字节，不负责记住你的业务分句。

## 读技术细节前先认识术语

- **字节流**：连续排列的字节，像没有自动断句的录音。
- **粘包/半包（俗称）**：业务读取与发送写入次数不一一对应的常见现象；不是 TCP 出错的正式故障类型。
- **消息帧（framing）**：人为给字节流设计边界的方法，像给每个包裹贴上长度标签。
- **长度前缀**：在内容前先写内容的字节数，方便接收方知道应当继续读多少。
- **字节序**：多字节数字的排列约定，像先写高位还是低位；双方不一致会读错长度。

**建议已经学过**：[bit/byte 是什么](../foundations/bits-bytes-and-packets.md) → [TCP 字节流](../transport/tcp-vs-udp.md) → [Socket](./socket-lifecycle.md)。

**先做一个最小验证或推演**：假设发送两条消息 `Hi` 和 `OK`，为它们各加 4 字节大端长度前缀，再指出读到一个字节时为什么还不能解出完整消息。

## 把问题对应到实际网络
客户端连续发送两段 JSON，服务端一次 `recv()` 可能读到半段、一段半或两段。这是正常的：**TCP 只提供有序字节流，不保存业务消息边界**。开发者必须自定义“第几字节到第几字节属于一条消息”。

## 常见分帧方案
- 固定长度：简单，但浪费空间且不适合大幅变长数据。
- 特殊分隔符：例如换行；必须处理数据转义。
- **长度前缀**：先写固定宽度长度，再写正文；二进制消息常用。
- 自描述格式：如完整 HTTP 格式，语义更丰富但解析更复杂。

## 定义最小协议
约定前 4 字节为 **无符号 32 位、网络字节序（大端）** 的正文长度；之后正好读取对应字节数：

```text
00 00 00 05  68 65 6c 6c 6f
└─ 长度=5 ┘  └─ ASCII "hello" ─┘
```

**网络字节序**一般指多字节整数按大端顺序传输。C/C++ 可以用 `htonl` / `ntohl`；Java `ByteBuffer` 默认大端（但仍要明确说明协议字节序）。不能依赖 C++ 结构体内存布局直接跨平台发送。

## 正确读取循环
```python
def read_exact(sock, n):
    chunks = []
    while n:
        chunk = sock.recv(n)
        if not chunk:
            raise EOFError("connection closed before frame complete")
        chunks.append(chunk)
        n -= len(chunk)
    return b"".join(chunks)
```
先 `read_exact(sock, 4)`，解析长度，再检查 `0 <= length <= 1_048_576` 等上限，最后读正文。生产实现还需要处理超时、缓冲区上限和拒绝畸形输入。

## 自测
为什么不能直接 `recv(4)` 然后立刻假定必然读满 4 字节？

## 相关知识
- [TCP 可靠性](../transport/tcp-reliability.md)
- [超时重试](../operations/timeouts-retries-idempotency.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 创建、加入复现方法与自测问题 |
| 2026-10-15 | zmd6s6 | 增补真实场景、术语白话解释、知识前置和可观察例子 |
