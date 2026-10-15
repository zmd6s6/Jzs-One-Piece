---
title: 计算机网络 8 个动手实验：从能看见包到能排障
author: zmd6s6
description: 从零基础到 C++/Java 跨语言通信与网络故障定位的可复现实验路线。
category: projects
tags:
  - networking
  - labs
  - map
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 计算机网络 8 个动手实验：从能看见包到能排障

> 这是独立于基础知识域的**练习工程与实践记录入口**。概念请先看[计算机网络 16 周学习路线](../../networking/README.md)，实验环境、测试命令、观察结果和故障结论留在这里。

## 按路径做（建议依次完成）
| 实验 | 建议周次 | 目标 | 通过条件 |
|---|---|---|---|
| [01 本地 HTTP 服务](./lab01-http-local.md) | 1–2 | 建立客户端/服务端最小直觉 | 解释 200/404 和端口 |
| [02 DNS 对比](./lab02-dns-observation.md) | 2–3 | 解析结果与应用访问分离 | 说出 A/AAAA 与缓存局限 |
| [03 子网路由](./lab03-subnet-routing.md) | 3–4 | 分辨同网段/下一跳 | 独立完成 CIDR 计算 |
| [04 ARP 与 ICMP](./lab04-arp-icmp.md) | 4 | 看清局域网交付和诊断 | 讲清 ARP/ICMP 的不同 |
| [05 TCP 握手抓包](./lab05-tcp-handshake.md) | 5–7 | 追踪 SYN/ACK/FIN/RST | 对上双方端口和 seq/ack |
| [06 TCP 消息分帧](./lab06-length-prefix.md) | 10 | 解决读不全/读到多帧 | 连续消息正确解析 |
| [07 Java 服务端 × Qt 客户端](./lab07-java-qt-echo.md) | 11–12 | 跨语言通信设计 | 双方使用相同字节序和协议 |
| [08 综合故障定位](./lab08-network-debug.md) | 13–16 | 从“连不上”找到协议层原因 | 提交诊断记录和验证证据 |

## 按症状找
| 症状 | 实验 |
|---|---|
| 想知道请求发到哪里、返回了什么 | [01](./lab01-http-local.md) |
| 域名解析正常但服务不通 | [02](./lab02-dns-observation.md) + [08](./lab08-network-debug.md) |
| 怀疑握手异常、端口拒绝 | [05](./lab05-tcp-handshake.md) + [08](./lab08-network-debug.md) |
| TCP “粘包/半包” | [06](./lab06-length-prefix.md) |
| Java 与 Qt 互通需要统一协议 | [07](./lab07-java-qt-echo.md) |

## 按决策查
- 只在自有机器、环回地址或明确授权环境抓包/测试；避免未经许可扫描他人设备。
- 记录：目标、环境、预期、命令、观测、解释、与基础知识的对应关系。
- 同一个实验失败先保留输出，再修改条件；不要把假设写成已验证结论。

## 验收模板
```text
实验编号：
OS / 软件版本：
前置知识：
复现命令：
实际输出/截图/pcap 路径：
预期与实际差异：
为什么会这样（指向知识笔记）：
下一步验证：
```

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 新建动手实验与验收标准 |
