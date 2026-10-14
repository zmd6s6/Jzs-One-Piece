---
title: classpath 白话：Java 是怎么找到类的
author: zmd6s6
description: 用"借书清单"的类比讲清 classpath、jar 包的 MANIFEST、java -cp 与 java -jar 的区别——理解这个能解释所有 NoClassDefFoundError 类启动失败。
category: backend
tags:
  - java
  - classloading
  - fundamentals
status: active
created: 2026-10-14
updated: 2026-10-14
---

# classpath 白话：Java 是怎么找到类的

## 先看一个现象

同一个 Java 程序，在服务器上用启动脚本跑得好好的，打进 Docker 镜像就起不来，报：

```text
java.lang.NoClassDefFoundError: org/springframework/boot/.../SpringBootServletInitializer
```

翻译成人话："我要用的这个类，**找不到**"。程序明明完整地打成了包，为什么找不到？——因为**"包里有"和"运行时找得到"是两回事**，中间隔着一个 **classpath**。

## classpath = 借书清单

Java 程序由无数个"类"（class，可以理解为一张张写好做法的卡片）组成。JVM 启动时并不会翻遍整台电脑找卡片，而是**按一张清单去指定的地方拿**——这张清单就是 **classpath**（`-cp` 参数给的就是它）。

```bash
java -cp "myapp.jar:lib/*" com.example.Main
```

读法：启动 `com.example.Main` 这个主类时，需要的卡片去两个地方找——`myapp.jar` 和 `lib` 目录下的所有 jar（`*` 是通配符，自动展开成那目录里的每个 jar 文件）。

**关键推论**：清单上没写的地方，就算东西就在旁边，JVM 也视而不见。

## jar 包和它内附的"清单附言"（MANIFEST）

**jar 文件**本质是一个 zip 压缩包，里面装着一堆类。它还可以带一份**内置说明文件**（`META-INF/MANIFEST.MF`，简称 MANIFEST），里面能写两件重要的事：

1. **Main-Class**：入口主类是谁——写了它，才能用 `java -jar myapp.jar` 直接启动（否则必须像上面那样手动指定主类）；
2. **Class-Path**：附带的借书清单——`java -jar` 启动时**只看这个附言**，**忽略**你在命令行传的 `-cp`！

这就埋下了大坑：**`java -cp` 和 `java -jar` 是两套互不相干的找类方式**：

| 启动方式 | 找类的依据 |
|---|---|
| `java -cp 清单 主类` | 你命令行给的清单（最直白、最不容易出错） |
| `java -jar xxx.jar` | jar 内 MANIFEST 附言写的 Main-Class 和 Class-Path |

## Spring Boot 的两种"附言"（事故的真正来源）

Spring Boot（Java 最常用的应用框架）打薄包时有两种附言写法（术语叫布局，layout）：

- **NONE 布局**：附言写"Main-Class = 你的主类 + Class-Path = lib/ 下的那一串 jar"——`java -jar` 靠附言里的清单能找到依赖，**能跑**；
- **ZIP 布局**：附言写"Main-Class = PropertiesLauncher（一个专门的引导器）"，**但不写清单**——它期望你在启动命令上再补一句 `-Dloader.path=./lib` 告诉它去哪找。**忘了这句，依赖一个都找不到**，立刻报本文开头那个 NoClassDefFoundError。

所以同一个包、同一条 `java -jar` 命令，换一种打包布局就可能从"能跑"变"必挂"——除非你的启动方式跟布局无关（`java -cp` 通配就无关）。

## 实战应用

- [K3s 事故复盘：一次容器启动失败的剖析](../devops/k3s-incident-principles.md)——裸机启动脚本带了 `-Dloader.path`、容器入口漏抄了这一句的真实案例；
- [K3s 选型记录第 4 条](../devops/k3s-decision-records.md)——为什么最终统一用 `java -cp '/app/*:/app/lib/*'`（对任何布局免疫）。

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-14 | zmd6s6（AI 辅助） | 创建（含基础知识串联） |
