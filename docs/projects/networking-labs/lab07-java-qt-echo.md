---
title: 实验 07：用 Java 服务端与 Qt 客户端实现跨语言协议
author: zmd6s6
description: 用统一长度前缀、字节序和编码让 Java 与 Qt 正确通信。
category: projects
tags:
  - networking
  - java
  - qt
  - cpp
  - lab
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 实验 07：用 Java 服务端与 Qt 客户端实现跨语言协议

## 要验证的现象
如果协议格式明确，Java 服务端和 Qt/C++ 客户端可以不用共享语言实现；否则字节序、编码、消息边界最容易引发误判。

## 前置知识
[消息边界](../../networking/programming/tcp-message-framing.md) → [Java Socket/NIO](../../networking/programming/java-nio-netty.md) → [Qt 网络](../../networking/programming/qt-network.md)。

## 协议约定
`[4 字节无符号大端长度] + [UTF-8 原始字节]`；测试发送 `hello`，响应仍为 `hello`。限定最大 1 MiB，只允许本机连接。

## Java 最小服务端 EchoServer.java
```java
import java.io.*;
import java.net.*;

public class EchoServer {
    public static void main(String[] args) throws Exception {
        try (ServerSocket server = new ServerSocket(
                9001, 10, InetAddress.getByName("127.0.0.1"))) {
            System.out.println("Listening on 127.0.0.1:9001");
            try (Socket socket = server.accept()) {
                socket.setSoTimeout(3000);
                DataInputStream in = new DataInputStream(socket.getInputStream());
                DataOutputStream out = new DataOutputStream(socket.getOutputStream());
                int n = in.readInt(); // big-endian signed Java int
                if (n < 0 || n > 1024 * 1024) throw new IOException("bad length");
                byte[] body = new byte[n];
                in.readFully(body);
                out.writeInt(n);
                out.write(body);
                out.flush();
            }
        }
    }
}
```
运行 `javac EchoServer.java && java EchoServer`（Windows CMD 可分为两条命令）。

## Qt 6 控制台客户端（main.cpp）
```cpp
#include <QCoreApplication>
#include <QTcpSocket>
#include <QDataStream>
#include <QDebug>
#include <QByteArray>

int main(int argc, char **argv) {
    QCoreApplication app(argc, argv);
    QTcpSocket socket;
    socket.connectToHost("127.0.0.1", 9001);
    if (!socket.waitForConnected(3000)) {
        qWarning() << socket.errorString(); return 1;
    }
    QByteArray packet;
    QDataStream out(&packet, QIODevice::WriteOnly);
    out.setByteOrder(QDataStream::BigEndian);
    out << quint32(5);
    packet.append("hello", 5);
    socket.write(packet);
    if (!socket.waitForBytesWritten(3000)) return 2;
    QByteArray received;
    // read until 4-byte header + declared payload length
    while (received.size() < 9) {
        if (!socket.waitForReadyRead(3000)) return 3;
        received += socket.readAll();
    }
    qDebug() << received.toHex(); // expect 0000000568656c6c6f
    return received.toHex() == "0000000568656c6c6f" ? 0 : 4;
}
```
Qt 6 CMake 链接 `Qt6::Core` 与 `Qt6::Network`。上述同步等待只适用于**控制台实验**；正式 GUI 程序要使用异步信号槽，并以首部长度计算期望消息大小，不能固定读 9 字节。

## 验收
- 对照 Java 的 `DataInputStream.readInt` 与 Qt 的 `QDataStream::BigEndian`。
- 抓包找出长度 `00 00 00 05` 和 UTF-8 消息字节。
- 人为改错字节序，记录不同结果并解释原因。
- 讨论：一次读入为什么可能不足 9 字节？多连接服务端应如何改？

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 新建动手实验与验收标准 |
