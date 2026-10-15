---
title: 实验 08：从拒绝、超时到 HTTPS 失败做一次完整诊断
author: zmd6s6
description: 区分四类失败现象，形成可复用的故障树和证据记录。
category: projects
tags:
  - networking
  - debugging
  - lab
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 实验 08：从拒绝、超时到 HTTPS 失败做一次完整诊断

## 场景与前置知识
你接到“Java 客户端无法连接某服务”的报障。不要立刻把超时调大；先证明失败发生在哪一层。

先复习：[排障顺序](../../networking/operations/troubleshooting-order.md)、[端口拒绝与超时](../../networking/tcp-udp-refused-vs-timeout.md)、[TLS](../../networking/application/https-tls.md)。

## 四组独立测试
### A. 本机无监听：验证拒绝
确保本机 `127.0.0.1:9999` 未监听：
```bash
curl -v --connect-timeout 2 http://127.0.0.1:9999/
```
一般会出现连接拒绝；若有本机程序占用该端口，换另一个空闲端口。

### B. 服务在监听：验证 HTTP
另一终端启动：
```bash
python -m http.server 8000 --bind 127.0.0.1
```
执行 `curl -v http://127.0.0.1:8000/`；能收到 HTTP 状态码，和 A 的 TCP 连接失败形成对照。

### C. 应用层等待：验证“超时并不只来自网络丢包”
新建 `slow.py`：
```python
from http.server import BaseHTTPRequestHandler, HTTPServer
import time

class Slow(BaseHTTPRequestHandler):
    def do_GET(self):
        time.sleep(3)
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"done")

HTTPServer(("127.0.0.1", 8001), Slow).serve_forever()
```
启动 `python slow.py`；另一终端调用：
```bash
curl -v --max-time 1 http://127.0.0.1:8001/
```
这次 TCP 可以建立，但**总体请求期限先耗尽**。服务端在客户端取消后写响应，可能看到 broken pipe 等异常；这是预期可观察行为之一。

### D. TLS 与 HTTP 对照
```bash
curl -v https://example.com/ -o /dev/null
```
选择公开、授权测试的站点；观察是否完成 TCP/TLS 以及 HTTP 是否给出响应。禁止为省事永久添加 `-k` 关闭证书校验。

## 最终验收
写一份完整的故障诊断单：
1. 每个场景的**原始错误与时间**。
2. 按 DNS / 连接 / TLS / HTTP / 应用处理定位所在层。
3. 至少一项原始日志/pcap/curl 证据。
4. 解释为什么不能只凭“超时”断言一定是防火墙丢包。
5. 给出修复行动及一项可持续预防措施（例如诊断模板或超时指标）。

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 新建动手实验与验收标准 |
