---
title: Graphql
date: 2020-11-21
draft: true
---

## 什么是 Graphql

GraphQL 是一种 API 查询语言。API 接口的返回值可以从静态变为动态，即调用者来声明接口返回什么数据，可以进一步解耦前后端。在 Graphal 中，预先定义 Schema 和声明 Type 来达到动态获取接口数据的目的：

- 对于数据模型的抽象是通过 Type 来描述的
- 对于接口获取数据的逻辑是通过 Schema 来描述的

## 为什么要使用 Graphql：

- 接口数量众多维护成本高
- 接口扩展成本高
- 接口响应的数据格式无法预知
- 减少无用数据的请求， 按需获取
- 强类型约束（API 的数据格式让前端来定义，而不是后端定义）

## Type（数据模型的抽象）

Type 简单可以分为两种，一种叫做 Scalar Type(标量类型)，另一种叫做 Object Type(对象类型)：

- Scalar Type（标量类型）：内建的标量包含，String、Int、Float、Boolean、Enum
- Object Type（对象类型）：感觉类似于 TypeScript 的接口类型
- Type Modifier（类型修饰符）：用于表明是否必填等

## Schema（模式）

定义了字段的类型、数据的结构，描述了接口数据请求的规则

## # Query（查询、操作类型）

查询类型： query（查询）、mutation（更改）和 subscription（订阅）

- query（查询）：当获取数据时，应当选取 Query 类型
- mutation（更改）：当尝试修改数据时，应当使用 mutation 类型
- subscription（订阅）：当希望数据更改时，可以进行消息推送，使用 subscription 类型

## # Resolver（解析函数）

提供相关 Query 所返回数据的逻辑。Query 和与之对应的 Resolver 是同名的，这样在 GraphQL 才能把它们对应起来。解析的过程可能是递归的，只要遇到非标量类型，会尝试继续解析，如果遇到标量类型，那么解析完成，这个过程叫做解析链。
