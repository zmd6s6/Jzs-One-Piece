---
title: 一个接口连不上，如何按层排查而不是碰运气
author: zmd6s6
description: 以 DNS、路由、传输、TLS、HTTP 为顺序建立可执行故障树。
category: networking
tags:
  - debugging
  - network
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 一个接口连不上，如何按层排查而不是碰运气

## 先用生活问题理解这一篇

手机说“无法连接”，有可能是没有 Wi-Fi、名字没查到、对方的窗口没开，或对方已收到但拒绝处理。一个笼统报错不足以告诉你是哪一环坏了。

## 这些专业词分别是干什么的

- **排障（troubleshooting）**：通过证据一步步缩小原因范围，而不是连续乱改配置。
- **复现**：能够再次触发同一问题，方便比较不同测试结果。
- **DNS**：负责按名字查询网络地址，像电话簿。
- **路由**：网络设备根据目标地址决定下一跳，像路口导航。
- **TLS**：保护通信及验证身份的机制，像核对证件后使用密封通道。

**前置知识**：[DNS](../dns-name-to-address.md) → [路由](../ip-subnet-and-routing.md) → [TCP 拒绝超时](../tcp-udp-refused-vs-timeout.md) → [HTTP](../application/http-core.md)。

**最小观察或推演**：拿一张纸画五个框：“网站名字 → 目标位置 → 端口连接 → 连接安全 → 业务响应”，每次诊断都指出是在哪一个框上拿到了证据。

## 再回到真实技术现象
“服务访问不了”本身没有诊断价值：它可能是名字解析、路由、端口、防火墙、证书、网关、应用线程池中的任一环节。

## 观察顺序
1. **确定目标**：真实访问的域名、IP、端口、协议和时间；确认是否有代理/CDN/容器网络。
2. **域名解析**：`nslookup example.com` / `dig example.com`，比较预期 IP 和实际结果；若是 IP 直连则跳过。
3. **本机与路由**：Windows `ipconfig /all`、`route print`；Linux `ip addr`、`ip route get 1.1.1.1`。
4. **端口连接**：Windows `Test-NetConnection example.com -Port 443`；Linux/macOS `nc -vz example.com 443`（具体 nc 选项依发行版而异）。
5. **TLS 和 HTTP**：`curl -v https://example.com/` 看握手、状态码、响应时间；必要时使用 `openssl s_client`。
6. **应用与服务端**：查进程监听、连接数、日志、线程、数据库依赖、上游代理错误。

## 建议记录模板
```text
时间戳：
客户端网络位置：
目标域名 / IP / 端口 / 协议：
复现命令：
成功 / 失败日志：
已排除的可能性：
下一次验证动作：
```

## 错误解释要留边界
- `connection refused` 往往说明收到主动拒绝（可能是无监听或防火墙 REJECT），不意味着整个路径必然完全可用。
- `timeout` 表示在期限内没有得到预期结果，可能是丢包、过滤、错误路由、服务负载等。
- `ping` 通只说明一些 ICMP 交互成功，不能替代 TCP/TLS/HTTP 检查。

## 自测
DNS 正确且 TCP 443 可连接，但 HTTPS 请求报证书域名不匹配，下一步该查哪一层？

## 相关知识
- [DNS](../dns-name-to-address.md)
- [端口拒绝与超时](../tcp-udp-refused-vs-timeout.md)
- [抓包方法](./packet-capture-basics.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 创建、加入复现方法与自测问题 |
| 2026-10-15 | zmd6s6 | 从具体情境解释术语、补前置知识和可验证动作，降低阅读门槛 |
