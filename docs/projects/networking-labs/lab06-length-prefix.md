---
title: 实验 06：自己写一个不会把 TCP 半包当故障的协议
author: zmd6s6
description: 在环回地址实现 4 字节大端长度前缀的 Python TCP 通信。
category: projects
tags:
  - networking
  - tcp
  - framing
  - lab
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 实验 06：自己写一个不会把 TCP 半包当故障的协议

## 目标
客户端连续发送两条长度前缀消息；服务端逐条正确解析并回显。测试关键是**故意拆开多次 send**，验证协议不会依赖分包碰巧对齐。

## 前置知识
[TCP 消息边界](../../networking/programming/tcp-message-framing.md)。

## 服务端 server.py
```python
import socket
import struct

def recv_exact(conn, length):
    out = bytearray()
    while len(out) < length:
        chunk = conn.recv(length - len(out))
        if not chunk:
            raise EOFError("peer closed")
        out.extend(chunk)
    return bytes(out)

with socket.socket() as server:
    server.bind(("127.0.0.1", 9000))
    server.listen(1)
    print("listening 127.0.0.1:9000")
    conn, address = server.accept()
    with conn:
        while True:
            try:
                header = recv_exact(conn, 4)
                (length,) = struct.unpack("!I", header)
                if length > 1024 * 1024:
                    raise ValueError("frame too large")
                payload = recv_exact(conn, length)
            except EOFError:
                break
            conn.sendall(header + payload)
            print("echo:", payload)
```

## 客户端 client.py
```python
import socket
import struct

def recv_exact(sock, count):
    data = bytearray()
    while len(data) < count:
        piece = sock.recv(count - len(data))
        if not piece:
            raise EOFError("closed")
        data.extend(piece)
    return bytes(data)

with socket.create_connection(("127.0.0.1", 9000), timeout=3) as s:
    for message in (b"hello", b"second message"):
        frame = struct.pack("!I", len(message)) + message
        s.sendall(frame[:2])
        s.sendall(frame[2:])
        n = struct.unpack("!I", recv_exact(s, 4))[0]
        got = recv_exact(s, n)
        print(got)
```

运行：先 `python server.py`，另一个终端 `python client.py`。客户端应打印两条与发送一致的数据。

## 验收与边界
- 能解释为什么 `recv(4)` 不能保证读满头部。
- 能说明 `!I` 表示大端无符号 32 位整数。
- 能说出生产中还需要超时、连接数限制、异常隔离、长度上限、完整性/鉴权等机制。
- 本示例服务端一次只处理一个连接，**不是生产并发服务端**。

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 新建动手实验与验收标准 |
