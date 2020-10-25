---
title: '数据库系统原理'
draft: true
---

## Struts 框架

### 定义：Struts 是流行和成熟的基于 MVC 设计模式的 Web 应用程序框架。

Model1 = JSP + JavaBean

Model2 = JSP + Servlet + JavaBean

Struts 中 action 就是 Controller，Struts2 是 webwork 的升级同时吸收两者的优势，不是一个全新的框架。

Struts2：servlet2.4 jsp2.0 java5(注解)

搭建 struts2 的步骤：

Jar -> 创建 web 项目 -> 完成配置 -> 创建 action 并测试

核心配置文件：web.xml struts.xml struts.properties

Struts2 不再与 Servlet API 耦合，无需传入 HttpServletRequest 和 HttpServletResponse

### struts2 提供了 3 种方式访问 Servlet API

1. ActionContext
2. 实现 Aware 接口
3. ServletActionContext

### 动态方法调用

1.指定 method 属性 2.感叹号方式 3.通配符方式 -> 解决 action 太多的问题

### 多个配置文件的方式 方法：include 包含的方式

###吧默认 Action - 解决无法匹配的 Action

### 后缀名 struts.action.extension

### 接收参数 1.使用 Action 的属性接收 2.使用 DomainModel 接收 3.实现 ModelDriven 接口

代码地址:[struts](https://github.com/lemonjing/struts)
