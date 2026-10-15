---
title: 打开 HTTPS 网页，学过的 DNS、IP、TCP、TLS、HTTP 如何配合
author: zmd6s6
description: 学完地址、传输、HTTP 与 HTTPS 后的综合复盘，用外卖配送类比和浏览器实际观察解释一次常见网页访问。
category: networking
tags:
  - http
  - https
  - walkthrough
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 打开 HTTPS 网页，学过的 DNS、IP、TCP、TLS、HTTP 如何配合

## 为什么把“完整请求顺序”放在这里

第一次打开网站时，你只需要懂“浏览器向网站要内容”。现在你已经分别学过地址、运输、请求格式与安全保护，才有能力回答：**每个环节为什么存在？**

依赖回顾：
- [域名、IP、MAC、端口](../foundations/four-kinds-of-address.md)：怎么定位名称、目标、下一跳和程序？
- [IP、路由与本地链路](../ip-subnet-and-routing.md)：数据怎么送出去？
- [TCP 与 UDP](../transport/tcp-vs-udp.md)：数据如何在程序间传送？
- [DNS](../dns-name-to-address.md)：名字怎么查出网络地址？
- [HTTP](./http-core.md)：浏览器到底怎样提出要求？
- [TLS/HTTPS](./https-tls.md)：怎样避免被冒充与窥探？

## 把技术名称变成外卖的六个动作

假设你点外卖，整个过程是：

1. **读懂订单信息**：确定你要找哪家店、点哪道菜（对应浏览器解析网页地址：域名、路径、要用安全连接的方式等）。
2. **查到店的位置**：仅知道店名不够，需要查询地址（对应 DNS：根据网站名字获取适用的地址；可能已经缓存）。
3. **规划送达路线**：确定这趟路下一站在哪里（对应 IP 路由；本地链路也得知道下一跳怎么交付）。
4. **建立合适的通信方式**：像与店家建立一条可持续、可靠的联系渠道（传统 HTTPS 的 TCP 连接）；也可以走另一种现代方案（QUIC，后面解释）。
5. **确认身份并保护对话**：确认你联系的确实是那家店，避免别人冒充、偷看或篡改信息（对应 TLS 加密协商和证书校验）。
6. **点单并接收结果**：按双方约定的格式说“我要这个页面”，网站返回“成功/不存在”和内容（对应 HTTP 请求、响应）；浏览器再解释网页文字、图片与样式。

**注意**：外卖比喻帮助理解职责，不代表互联网真的有一个接单员依次执行六个独立步骤。缓存、代理、连接复用和并行加载可能改变实际流程。

## 一次常见的 HTTPS 请求，逐步展开

下面以首次访问、未命中缓存、采用 HTTP/1.1 + TCP 的一种情况为例。

### 1. 浏览器先读你输入的地址

地址 `https://example.com/products` 大致拆成：

- `https`：打算使用受到安全保护的 HTTP 通信；
- `example.com`：目标网站的域名；
- `/products`：希望取到的网站资源路径。

这个完整的资源定位字符串叫 **URL（统一资源定位符）**，可理解为“网站完整取货单上的定位信息”。

### 2. 由名字查网络地址：DNS

你只写了网站的名字，但网络转发需要找到可达的目标地址。DNS 就像查通讯录，可能返回一个或多个 IPv4/IPv6 地址。浏览器/系统也可能已经把答案保存在缓存中。

**验证**：`nslookup example.com` 能看到一种解析结果，但浏览器可能使用别的缓存、代理或安全 DNS 方式，因此未必完全一致。

### 3. 网络决定把数据先交给谁：IP、路由、链路

IP 是跨网络定位用的地址；**路由表**像导航规则，决定目的地下一站走哪个网络出口。如果目的地不在本地网络，通常会把数据交给默认网关。

在本地 Ethernet/Wi-Fi 链路上，还要完成当前这一跳的交付（如 IPv4 的 ARP 查找下一跳对应的链路地址）。

**不等于**每次打开网页都会重新 ARP；已有缓存时可以复用。**不等于**浏览器手工指挥每台路由器；大部分由系统与网络设备处理。

### 4. 传输机制：TCP 连接或 QUIC

在 HTTP/1.1 + TCP 的示例里，双方先通过 TCP 建立连接。TCP 提供有序、可靠的字节流；其典型建立方式包含 SYN、SYN-ACK、ACK 三次交互，具体见[连接生命周期](../transport/tcp-connection-lifecycle.md)。

HTTP/3 则通常在基于 UDP 的 **QUIC** 上运行。QUIC 提供安全的连接与多个独立数据流，因此**不能断言任何 HTTPS 请求都必须先有 TCP 三次握手**。两种路径都遵循“要有合适的传输机制”这一业务需求。

### 5. 确认对方可信：TLS

传统 HTTPS 会在 TCP 连接上进行 TLS 协商，包含服务器身份证书验证和加密密钥相关协商，确认后才能安全传递应用数据。

HTTP/3 的 QUIC 集成 TLS 1.3 安全握手，与上一种路径不完全一样。若证书名称不匹配，浏览器可能在发送正常 HTTP 请求之前就阻止继续。

### 6. 提出需求并收到结果：HTTP

像点单一样：

```text
请求：请给我 /products 页面
响应：成功，这是对应的页面内容
```

实际 HTTP 响应有状态码、头部和正文。浏览器收到 HTML（网页结构内容）后还可能继续请求图片、CSS（样式）、JavaScript（交互脚本）等资源，才能显示完整页面。

## 真实网络为什么不保证严格按这一顺序走

- **DNS 缓存**：之前查过地址，这次可能不需要重新问服务器。
- **连接复用**：客户端可能直接使用已有 TCP/TLS 连接。
- **HTTP/3**：采用 QUIC 与 TLS 1.3 的整合路径，和 HTTP/1.1 + TCP 的建连细节不同。
- **代理/CDN/服务工作线程**：请求可能被中间组件或浏览器本地机制处理，而不必直接抵达最初设想的源站。
- **并行/预连接**：浏览器可能提前解析、提前建立连接，或同时获取多个资源。

因此，这里教你的是**各技术承担的职责和一种典型因果路径**，不是所有网页请求必定发生的不可更改时间线。

## 亲手对照每个环节

打开系统终端（Windows PowerShell 有时需要写 `curl.exe`）：

```bash
# 只观察域名查询；可能与浏览器实际采用的解析方式不同
nslookup example.com

# 观察 curl 告诉你的名称解析、连接、TLS、HTTP 消息
curl -v https://example.com/ -o /dev/null
```

在浏览器开发者工具的 Network 面板刷新 `https://example.com`，再查看 **Timing（耗时）**（若浏览器提供）和 **Headers（头部）**，识别“找地址、连通道、要页面、收回应”的痕迹。

如想观察 TCP 握手，需用 Wireshark 并满足可抓到新 TCP 连接的条件；**已复用连接时看不到新的三次握手并不说明有故障**。

## 验收：不背图也能解释

1. 在上面六步中，哪一步是“找网站”，哪一步是“把数据送到目的设备”，哪一步是“双方读懂彼此的内容”？
2. 浏览器能拿到 IP，但 TCP 建连失败，DNS 一定坏了吗？
3. TCP 已建立连接，但证书校验失败，为什么仍不能直接发送账号密码？
4. HTTP 返回 404，说明在哪些更早的环节通常已经取得了进展？
5. 同一个网页第二次打开时，为什么可能少了 DNS 查询或新建连接？

如果都能解释清楚，说明你不仅知道这些缩写，还知道**一个真实请求为什么会用到它们**。

## 相关知识

- [HTTP 的语义](./http-core.md)
- [TLS、证书和 HTTPS](./https-tls.md)
- [HTTP/1.1、HTTP/2、HTTP/3 的区别](./http-versions.md)
- [按层诊断实际故障](../operations/troubleshooting-order.md)

## 参考资料

- [MDN：How the Web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works)
- [MDN：How browsers work](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work)
- [Beej：Guide to Network Concepts](https://beej.us/guide/bgnet0/html/)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 新建后置综合复盘，待基础概念学完再讲 HTTPS 请求顺序 |
