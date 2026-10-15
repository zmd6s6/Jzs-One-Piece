---
title: 浏览器怎样向网站提出要求：HTTP 请求与响应是什么
author: zmd6s6
description: 从餐厅点单开始认识 HTTP、GET/POST、状态码、消息头和消息体，并能用浏览器亲眼验证。
category: networking
tags:
  - http
  - application
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 浏览器怎样向网站提出要求：HTTP 请求与响应是什么

## 从点餐理解“双方怎么说话”

你走进餐厅，说“我要一碗面”；服务员答复“好的”，或“抱歉，今天没有”。除了把消息送过去，双方还得能**听懂消息的格式与含义**。

网络也一样：[IP](../ip-subnet-and-routing.md)负责找到目的地，[TCP/UDP](../transport/tcp-vs-udp.md)等机制负责传输，但这些并不自动定义“我要网页”“我要提交表单”是什么意思。

**HTTP（超文本传输协议）**就是浏览器、网页服务和许多接口用来交流的一套规则。名字里虽然有“超文本”，但它也能传图片、JSON、文件等类型的内容。

## 五个第一次要懂的词

- **请求（request）**：由客户端发起的消息，说明要什么。类比点菜单。
- **响应（response）**：服务器对请求的答复。类比厨房给出“成功/没有/出错”并送餐。
- **方法（method）**：请求打算做什么。例如 `GET` 常用于读取，`POST` 常用于提交数据；它们是通信语义，具体业务效果仍取决于服务端实现。
- **状态码（status code）**：响应结果的三位数字，例如 `200` 代表成功，`404` 代表当前目标资源找不到，`500` 代表服务器处理出现问题。
- **消息头（header）**与**消息体（body）**：头类似单据的说明栏（格式、类型等），体类似真正要送的内容（例如网页文字或 JSON）。

## 一次 HTTP/1.1 对话长什么样

下面是示意，不是你必须背的语法：

```http
GET /menu HTTP/1.1
Host: example.com

```

它大致表示：**“请读取 example.com 这个网站里的 /menu。”**

```http
HTTP/1.1 200 OK
Content-Type: text/plain

today: noodles
```

这一段表示：**“请求成功，返回的是纯文字，内容是 today: noodles。”**

`Host` 指明服务端要处理的网站名称；`Content-Type` 指明正文是什么类型。浏览器会按这些规则解释结果。

真实通信可能使用 HTTP/2 或 HTTP/3，其网络上的二进制表达形式不完全像上面文字，但“请求方法、响应状态、头部、内容”的核心语义仍相通。

## 亲手验证：状态码到底在哪里

1. 用浏览器打开 `https://example.com`，按 `F12` 打开开发者工具的 Network 面板，刷新。
2. 点开获取页面的那一行，找到 **Status**（状态）、**Headers**（头部）、**Response**（返回正文）等栏目。
3. 尝试访问一个不存在的路径，例如 `https://example.com/a-page-that-does-not-exist-123`。很多服务器会返回 `404`，但服务站点也可能选择不同的响应方式，**以实际观察为准**。
4. 可选命令（装有 curl 时）：`curl -i https://example.com`。其中 `-i` 表示把响应头一起显示出来。

注意：**返回 404 并不等于网络不通**。恰恰说明通常已经与某个能够给出 HTTP 响应的服务交流成功。TLS 握手失败则不一定能得到 HTTP 状态码。

## 不要混淆的事情

- **HTTP 无状态**意味着 HTTP 本身不要求保存前一条请求的应用状态；使用 Cookie、会话或令牌，网站仍可以实现登录。
- **网络连接成功**只说明底层通道具备通信条件，不表示 HTTP 一定返回 200，也不保证数据库写入成功。
- 浏览器一次打开页面，可能为了图片、脚本等资源发出更多请求；它们不必总是同一条连接。

## 验收：面对结果，解释是哪一类问题

- `200` 和 `404` 是“运输线路的故障码”吗？
- 什么区别是请求、响应、状态码、消息头、正文？
- 为什么登录成功之后，再次打开其他页面仍能识别你的登录身份？

## 相关知识

- [DNS：先找到服务地址](../dns-name-to-address.md)
- [HTTPS/TLS：让通信更安全](./https-tls.md)
- [完整网页请求的复盘](./browser-request-walkthrough.md)

## 参考资料

- [MDN：HTTP 概述](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Guides/Overview)
- [MDN：Client-Server overview](https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 初建线性学习内容及验证问题 |
| 2026-10-15 | zmd6s6 | 依据权威教程重写零基础解释，补充生活场景、机制边界、亲手验证与验收题 |
