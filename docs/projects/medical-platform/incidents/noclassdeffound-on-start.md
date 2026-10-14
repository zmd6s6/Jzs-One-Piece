---
title: 容器一启动就退出，报"找不到类"
author: zmd6s6
description: 同一个包裸机正常、容器必挂：java -jar 的找类方式与打包布局不匹配导致 NoClassDefFoundError 的完整排查与修复。
category: devops
tags:
  - kubernetes
  - java
  - postmortem
status: active
created: 2026-10-14
updated: 2026-10-14
---

# 容器一启动就退出，报"找不到类"

> 先看：[classpath 白话：Java 是怎么找到类的](../../../backend/java-classpath-basics.md)——`java -cp` 与 `java -jar` 是两套互不相干的找类方式，这篇事故就是两者打架。

## 现象

新发布的镜像在集群里反复重启（K8s 术语 CrashLoopBackOff，"崩溃→退避重试"循环），日志最后一行：

```text
java.lang.NoClassDefFoundError: org/springframework/boot/.../SpringBootServletInitializer
```

（"找不到类"；调用栈开头是 `PropertiesLauncher`，Spring Boot 的一种引导器。）

## 排查推理

1. 类找不到，第一反应"依赖没打进包"→ 挂载镜像看内容：依赖整整齐齐躺在 `/app/lib/`，**包没问题**；
2. 包没问题却找不到 → 转向"启动命令没让它去找那个目录"；
3. 对照裸机启动脚本：有一句 `-Dloader.path=./lib`（"去 lib 目录找依赖"）；容器的启动命令是裸的 `java -jar`——**恰好漏抄了这一句**。裸机正常、容器必挂，分界线找到。

## 根因

`java -jar`（按 jar 内附言找依赖）遇上 ZIP 布局的包（附言没写依赖位置，必须补 `-Dloader.path`）。更隐蔽的是：**同一构建线的另一个服务恰好是 NONE 布局**（附言自带完整清单），裸 `java -jar` 也能跑——把问题掩盖了两个月。三种组合的完整对照表在[classpath 白话](../../../backend/java-classpath-basics.md)。

## 修复

容器启动命令统一为：

```dockerfile
ENTRYPOINT ["sh","-c","exec java ${JAVA_OPTS} -cp '/app/*:/app/lib/*' 主类"]
```

`-cp` 直接给依赖清单，与 jar 附言无关，**对任何打包布局都成立**。

## 预防

1. 构建镜像的说明书（Dockerfile）只放源码仓库，流水线不许自带私藏版（本次漏抄正来自私藏版）；
2. 清单用通配写目录（`lib/*`），不写死带版本号的文件名；
3. 发布前起一个容器做冒烟（访问一次健康地址），起不来的镜像不许进仓库。

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-14 | zmd6s6 | 从《K3s 事故复盘》长文拆分独立成篇 |
