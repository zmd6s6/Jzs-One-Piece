---
title: 实验 01：启动最小 HTTP 服务并验证 200 与 404
author: zmd6s6
description: 用 Python 标准库与 curl 看懂客户端服务端和状态码。
category: projects
tags:
  - networking
  - http
  - lab
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 实验 01：启动最小 HTTP 服务并验证 200 与 404

## 要验证的现象
不联网也能在自己电脑启动服务。浏览器、curl 都是客户端；服务监听指定端口，回应 HTTP 请求。

## 前置知识
[一次网页请求](../../networking/foundations/first-network-request.md) → [HTTP 消息](../../networking/application/http-core.md)。

## 环境
Python 3 + curl；建议双终端执行。以下只监听环回 IP，不向局域网暴露服务。

## 步骤
终端 A：
```bash
mkdir -p network-lab && cd network-lab
printf 'hello network\n' > index.html
python -m http.server 8000 --bind 127.0.0.1
```
Windows PowerShell 不支持上述 Unix `printf`，可用 `New-Item -ItemType Directory network-lab -Force`、`Set-Content network-lab/index.html 'hello network'`，进入目录后启动相同 Python 命令。

终端 B：
```bash
curl -i http://127.0.0.1:8000/
curl -i http://127.0.0.1:8000/not-found
```
观察 HTTP 状态、Content-Type、响应体以及终端 A 的请求日志。

## 验收问题
1. 为什么 `127.0.0.1` 是本机环回，不代表从其他电脑可访问？
2. 为什么 `404` 与“TCP 连不上”不能混为一谈？
3. 把端口改成 `8001`，原 URL 为什么失败？

## 记录
保存两份脱敏 `curl -i` 输出，写出“请求地址 → 端口 → 服务进程 → HTTP 响应”的完整链路。结束后在终端 A 按 Ctrl+C。

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 新建动手实验与验收标准 |
