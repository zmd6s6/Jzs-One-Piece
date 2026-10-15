---
title: 计算机网络学习资料库：权威教材、图解帖和抓包实战
author: zmd6s6
description: 将公开的权威教程与实践资源按零基础、机制深读、动手实验、进阶规范分级，标注每篇需要的前置知识。
category: networking
tags:
  - resources
  - reading
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 计算机网络学习资料：严格按零基础、原理深化和动手验证分级

## 为什么不推荐一开始就看“浏览器输入 URL 到网页出现的完整过程”

你刚接触计算机网络时，可能连“客户端”“字节”“端口”都没学过。此时读复杂请求流程，虽然看到很多名称，却不知道哪一个能解决哪一个问题。**适合进阶复盘的文章，不一定适合作为第一课。**

下面每一项都标注“读之前该懂什么”。**站外资料是辅助材料，本知识库的八阶段顺序才是学习主线。** 只提供作者原站或权威来源的链接，不搬运原文。

## 入口级：完全零基础可以先读

| 资源 | 先准备什么 | 为什么选它、怎么用 |
|---|---|---|
| [MDN：How does the Internet work?](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work) | 会用浏览器即可 | 首先解释互联网和网站的区别、网络设备如何互联；配[网页与客户端第一课](./foundations/first-network-request.md) |
| [MDN：How the Web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works) | 知道客户端、服务器即可 | 使用商店等类比建立网页请求直觉；里面提到的 TCP/IP、HTTP 等先不死背，回到知识库逐项学习 |
| [Beej's Guide to Network Concepts](https://beej.us/guide/bgnet0/html/) | 概念部分适合初学；编程实验需要一点 Python 基础 | 从 bytes、IP、传输等内容分步理解，选章节读，不必一上来做全部编程习题 |
| [Practical Networking：Network Fundamentals](https://www.practicalnetworking.net/classes/network-fundamentals/) | 已认识地址与网卡 | 课程安排清楚，从二进制、子网到 ARP、交换与转发；页面有公开教学大纲，部分课堂内容可能需报名，**不要误以为所有课程完整免费** |

推荐做法：第一轮只选 MDN 的第一篇和本知识库[第一阶段](./foundations/README.md)，每学一篇问“这个机制解决哪个具体麻烦”，再挑 Beej 对照概念。

## 机制级：懂基本地址以后，再深入

| 资源 | 适合什么时候阅读 | 观察或验证什么 |
|---|---|---|
| [Practical Networking：Packet Traveling 系列](https://www.practicalnetworking.net/series/) | 认识 IP/MAC/网关以后 | 通过 Packet Traveling、ARP、NAT 等前后相连的系列理解实际转发，**按该系列顺序阅读** |
| [Practical Networking：Traditional ARP](https://www.practicalnetworking.net/series/arp/traditional-arp/) | 学到本地交付、ARP 后 | 对比“同网段查目标 MAC”与“跨网段查网关 MAC” |
| [小林 coding《图解网络》](https://xiaolincoding.com/network/) | 已懂地址、TCP/UDP 基础后 | 中文图解 TCP、HTTP 等深一点的机制；作者说明主要面向已有一点网络基础的程序员 |
| [陈皓《TCP 的那些事儿（上）》](https://coolshell.cn/articles/11564.html) | 学完 TCP 可靠性与连接后 | 深挖确认、滑动窗口与设计取舍；老文章中的版本细节要用现代规范校验 |
| [MDN：HTTP 文档](https://developer.mozilla.org/zh-CN/docs/Web/HTTP) | 已读过[HTTP 入门](./application/http-core.md) | 请求方法、状态、缓存、HTTPS、版本等专题逐项核对 |
| [WHAT HAPPENS WHEN…](https://github.com/alex/what-happens-when) | **必须学完 DNS、IP、TCP、HTTP、TLS 之后** | 用于完整流程回顾；作为补充，不要第一天就读或直接背答案 |

## 实践级：能解释基本原理之后亲眼看证据

| 资源 | 需要先懂什么 | 建议的练习 |
|---|---|---|
| [Kurose/Ross 官方 Wireshark Labs](https://gaia.cs.umass.edu/kurose_ross/wireshark.php) | 基础分层及各协议作用 | 从 Getting Started 开始，再按 DNS、HTTP、TCP、IP 等主题选实验；观察真实报文 |
| [Wireshark User's Guide](https://www.wireshark.org/docs/wsug_html/) | 知道“什么是抓包” | 找网卡、抓一段流量、使用显示过滤器；尊重隐私和授权 |
| [Everything curl](https://everything.curl.dev/) | 知道 HTTP 请求与状态码 | 对比 `curl -i` 与 `curl -v` 能分别看什么；观察 DNS、TLS、状态码 |
| [Beej's Guide to Network Programming](https://beej.us/guide/bgnet/) | 已学[Socket](./programming/socket-lifecycle.md)，有 C 编程基础 | 做最小客户端/服务器、理解字节序和消息边界 |
| [Oracle Java Socket Tutorials](https://docs.oracle.com/javase/tutorial/networking/sockets/) | 已懂 TCP 与端口，会基础 Java | 写连接、发送、读取与 Echo；此文以较旧 JDK 教学，注意平台版本 |
| [Qt QTcpSocket 官方文档](https://doc.qt.io/qt-6/qtcpsocket.html) | 已懂 TCP 和事件循环，会基础 Qt | 观察 connected、readyRead 与线程归属 |
| [Netty 4.x User Guide](https://netty.io/wiki/user-guide-for-4.x.html) | 会 Java Socket/NIO | 建立 pipeline、handler 与消息解码器，别直接复制并发参数 |

## 深度级：不要作为真正的第一本教材

| 资源 | 为什么在后面读 |
|---|---|
| [Kurose/Ross《计算机网络：自顶向下方法》及官方教学网站](https://gaia.cs.umass.edu/kurose_ross/wireshark.php) | 系统性强，但抽象概念很多；已经具备一轮直觉再读更容易理解 |
| [Stanford CS144](https://web.stanford.edu/class/cs144/) | 大学计算机网络课程及 C++ 项目，有明确编程与系统知识前置要求，适合完成第六阶段后挑战 |
| [RFC 9293：TCP](https://www.rfc-editor.org/rfc/rfc9293) | 权威协议细节查证资料；不建议零基础从头阅读 |
| [RFC 9000：QUIC](https://www.rfc-editor.org/rfc/rfc9000) | 理解 HTTP/3 和 QUIC 实现时查证 |
| [Linux tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html) | Linux 行为与 Socket 选项的具体参考，实操要核对内核版本 |

## 怎样判断一个经验贴值不值得信

看到“调整某个参数能解决网络慢”时，至少问：

1. 作者有没有说清楚操作系统、内核、协议版本、测试拓扑？
2. 有没有提供命令输出、抓包或监控指标，不只是主观“感觉变快”？
3. 有没有把观察事实与猜测分开，并对不同可能原因做过排除？
4. 有没有讲明白副作用、失败情况和回滚办法？
5. 这篇是在讲*协议必然行为*，还是只讲*某个系统的实现*？

实践和真实复盘应保存到项目域，而不是把事故文字塞进基础知识章节。

## 相关知识

- [按阶段学习与验收](./README.md)
- [零基础术语表](./glossary.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 创建、建立学习入口和参考资料 |
| 2026-10-15 | zmd6s6 | 修正学习资料索引跨项目域链接 |
| 2026-10-15 | zmd6s6 | 移除资料表内按周学习建议，改为知识前置与阶段实践 |
| 2026-10-15 | zmd6s6 | 核对官方资料，按前置知识重分阅读梯度，修复酷壳原文链接，移除零基础阶段术语轰炸 |
