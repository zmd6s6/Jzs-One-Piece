---
title: 健康探针：K8s 怎么判断程序死活
author: zmd6s6
description: 探针三件套（liveness/readiness/startup）各自回答什么问题、挂了会怎样；为什么必须打分组端点而不是综合健康报告。
category: devops
tags:
  - kubernetes
  - internals
status: active
created: 2026-10-14
updated: 2026-10-14
---

# 健康探针：K8s 怎么判断程序死活

K8s 用"探针"（定期访问一个地址）判断程序状态。三件套各管一件事：

| 探针 | 回答的问题 | 失败的后果 |
|---|---|---|
| **liveness** | 进程还活着吗 | 杀掉重启 |
| **readiness** | 能接客了吗 | 暂时不给它分流（别的副本顶着） |
| **startup** | 启动期保护 | 启动慢的程序不被前两者误杀 |

## 关键规则：打分组端点，不打综合报告

Spring Boot 程序有两种健康地址：

- `/actuator/health`——**综合报告**：汇总数据库、注册中心等所有依赖的状态，**任何一个坏就是失败**；
- `/actuator/health/liveness` 和 `/readiness`——**分组端点**：只回答进程本身的状态，不掺外部依赖（Spring Boot 在 K8s 环境默认提供）。

探针打综合报告 = 把"进程死活"的判决权交给了外部依赖——依赖抖一下，所有副本被轮流杀一遍（完整案例见[探针杀容器事故](../../../projects/medical-platform/incidents/probe-kills-healthy-container.md)）。

## 慢启动：用 startupProbe，别调大延迟

Java 服务冷启动可达数分钟。正确做法是 `startupProbe`（period × failureThreshold 给足容忍时间，如 10 秒 × 60 次 = 10 分钟），启动成功后才交给前两者接管。把普通探针的 initialDelay 调很大是错误姿势——它对"每次重启都慢"不成立。

## "Running 是谎言"

没有探针时，绿色 Running 只说明"容器没退出"。验收 = 分组端点返回正常 + 一条真实业务请求通过。

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-14 | zmd6s6 | 从《原理篇》长文拆分独立成篇 |
