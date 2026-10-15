---
title: 带宽很高为何接口仍很慢：建立网络性能分析方法
author: zmd6s6
description: 区分带宽、吞吐、RTT、丢包、连接成本及尾延迟。
category: networking
tags:
  - performance
  - latency
  - throughput
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 带宽很高为何接口仍很慢：建立网络性能分析方法

## 先看一个现象
从两地传文件峰值可以达到百兆，但一个简单接口 P99 仍需好几秒。**带宽**和**延迟**是不同维度：高速公路很宽，不代表每辆车能瞬间到达。

## 六个核心指标
- **带宽 bandwidth**：链路的理论传输能力，常以 bit/s 表示。
- **吞吐 throughput**：实际完成的数据传输速率，可能受 TCP 窗口、拥塞、应用读写等限制。
- **RTT**：请求往返路径时间，粗略衡量网络响应成本。
- **丢包率**：未成功传达的数据包比例（测量点、协议不同，统计意义不同）。
- **抖动 jitter**：时延变化程度。
- **P95/P99**：95%/99% 请求不超过的耗时分位数；P99 能暴露少数慢请求。

## 应用延迟拆账
```text
总耗时 = DNS + 建连 + TLS + 排队 + 服务处理 + 传输 + 客户端处理
```
这是建模思路，各阶段可能并行、复用或重叠，不应机械相加每个工具报告的数字。

## 动手
```bash
curl -sS -o /dev/null -w 'dns:%{time_namelookup} connect:%{time_connect} tls:%{time_appconnect} first-byte:%{time_starttransfer} total:%{time_total}\n' https://example.com
```
这些字段通常是从操作开始计时的累计时间点，不能简单相加；例如“连接阶段耗时”可以用 `time_connect - time_namelookup` 近似推导。若使用代理、连接复用或 HTTP/3，需重新解释含义。

## 优化顺序
1. 先明确 SLO 与目标负载、收集服务端/客户端指标。
2. 区分网络耗时与业务排队/数据库耗时。
3. 比较冷连接、热连接、不同地域和丢包条件。
4. 仅在证据指向网络瓶颈时调窗口、连接池或传输协议。

## 自测
为什么平均值改善了但 P99 可能恶化？为什么增加线程数不一定能解决 RTT 高？

## 相关知识
- [TCP 拥塞控制](../transport/tcp-congestion-control.md)
- [超时与重试](../operations/timeouts-retries-idempotency.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 创建、建立学习入口和参考资料 |
