---
title: 计算机网络学习资料库：权威教材、图解帖和抓包实战
author: zmd6s6
description: 按阶段筛选公开可访问的高质量网络资料，区分教程、原理深读、实战手册与标准。
category: networking
tags:
  - resources
  - reading
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 计算机网络学习资料库：权威教材、图解帖和抓包实战

> 选材准则：优先作者原站/课程官网；辅助资料只做补充，核心概念以规范和抓包互证；文章版本与系统环境会影响实验命令。本页只收录链接与阅读建议，不转载受版权保护的全文。

## 零基础主线（第 1–5 阶段）
| 资料 | 适合阶段 | 阅读建议 |
|---|---|---|
| [Beej's Guide to Networking Concepts](https://beej.us/guide/bgnet0/) | 零基础 | 免费英文入门，有分层概念与基础编程认知；先读核心章节 |
| [Practical Networking — Network Fundamentals](https://www.practicalnetworking.net/classes/network-fundamentals/) | IP/子网、交换、路由 | 从二进制子网划分到 ARP、路由、TCP 的连续课程目录，部分完整课程可能需额外报名 |
| [Practical Networking — Series](https://www.practicalnetworking.net/series/) | ARP/NAT 等 | 分主题连续文章，按前置阅读，特别适合补缺口 |
| [小林 coding：图解计算机网络](https://xiaolincoding.com/network/) | TCP/HTTP/DNS | 中文图解；建议做二次推导而不是直接记结论 |
| [小林 coding 源代码目录](https://github.com/xiaolincoder/CS-Base/tree/main/network) | 检索与离线目录 | 辅助查找具体篇目、阅读勘误 |
| [MDN：HTTP 概述（中文）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Guides/Overview) | HTTP | 用官方持续更新的文档理解 HTTP 语义及版本 |
| [What happens when…](https://github.com/alex/what-happens-when) | 串联知识 | 从浏览器输入地址到 DNS、TCP、TLS、HTTP；内容范围广，具体细节需结合标准校对 |

## 深读帖子（第 4 阶段以后）
| 文章 | 适用时机 | 阅读重点与提醒 |
|---|---|---|
| [酷壳：TCP 的那些事儿（上）](https://coolshell.islumi.com/articles/11564) | 已懂握手/重传后 | 陈皓的经典深入分析，2014 年文章；涉及协议和实现细节时请用较新 RFC 核对 |
| [Linux tcp(7) 手册](https://man7.org/linux/man-pages/man7/tcp.7.html) | 调 Socket 参数前 | 选项与 Linux 实现行为，优先看适用内核与版本 |
| [RFC 9293（TCP）](https://www.rfc-editor.org/rfc/rfc9293) | 进阶校验 TCP | TCP 的现代整合规范；先按问题检索，不建议从头通读 |
| [RFC 9000（QUIC）](https://www.rfc-editor.org/rfc/rfc9000) | HTTP/3 深读 | QUIC 的连接、多路复用与可靠传输规范 |
| [MDN HTTP 文档库](https://developer.mozilla.org/zh-CN/docs/Web/HTTP) | HTTP 缓存、方法、状态码 | 解决接口设计和浏览器交互的细节问题 |

## 真正动手的实践资源
| 资源 | 实践价值 | 建议配套 |
|---|---|---|
| [Kurose / Ross 官方 Wireshark Labs（第 9 版）](https://gaia.cs.umass.edu/kurose_ross/wireshark.php) | 有入门、HTTP、DNS、TCP、UDP、IP、NAT、ARP、DHCP、TLS 等作业和抓包样本 | 第 3 周起每阶段做一个实验；遵守课程版权说明 |
| [Wireshark User's Guide](https://www.wireshark.org/docs/wsug_html/) | 捕获接口、显示过滤器、Follow Stream、统计 | 抓包前读 Capture/Display Filters |
| [Wireshark Capture Filters](https://wiki.wireshark.org/CaptureFilters) | 避免搞混捕获与显示过滤语法 | 配套[抓包笔记](./operations/packet-capture-basics.md) |
| [Everything curl](https://everything.curl.dev/) | HTTP、DNS、TLS、超时、代理的命令实践 | 每次排障保留完整命令和脱敏输出 |
| [Beej's Guide to Network Programming](https://beej.us/guide/bgnet/) | C/C++ Socket 入门到完整程序 | 实现自定义 TCP Echo/分帧 |
| [Stanford CS144 2026](https://web.stanford.edu/class/cs144/) | 在 C/C++ 中逐步实现 TCP/IP 相关组件 | **进阶挑战**：课程有前置条件，不适合第一周直接开做 |
| [Netty 4.x User Guide](https://netty.io/wiki/user-guide-for-4.x.html) | Java 事件循环和 ChannelPipeline | 先独立写 Socket/NIO 再学 |
| [Qt QTcpSocket 官方 API](https://doc.qt.io/qt-6/qtcpsocket.html) | Qt 客户端通信、信号与生命周期 | 对照 Qt 所用版本 |
| [Oracle Socket Tutorials](https://docs.oracle.com/javase/tutorial/networking/sockets/) | Java 基本 Socket 服务端/客户端 | 文档基于 JDK 8，作为概念入门非最新最佳实践 |

## 教材如何选
1. 主教材：Kurose/Ross《计算机网络：自顶向下方法》；可结合[作者官方实验](https://gaia.cs.umass.edu/kurose_ross/wireshark.php)使用。**阅读路径以本知识库的零基础递进顺序为主**。
2. 辅助教材：Stevens《TCP/IP 详解 卷 1：协议》，查包头、状态和协议细节时用，不作为新手第一本。
3. 系统视角：《Computer Networks: A Systems Approach》由 Peterson/Davie 编著，可作体系化补充；版本与可访问性以出版方/作者页面为准。

## 经验贴质量评估
读任何“某个参数一调就快了”的帖子时，先问：
- 有无清楚的 OS/内核/协议版本和拓扑？
- 有无抓包或监控等可验证证据？
- 观测结果和原因是否分开？
- 是否把代理行为、应用实现误说成网络协议必然行为？
- 是否解释副作用、资源成本与回滚方式？

## 相关知识
- [16 周学习地图](./README.md)
- [8 个动手实验](../projects/networking-labs/README.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 创建、建立学习入口和参考资料 |
