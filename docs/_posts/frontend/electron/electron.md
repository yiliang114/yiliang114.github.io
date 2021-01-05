---
title: electron
date: 2018-11-21
aside: false
---

# electron

## api

[中文](https://www.w3cschool.cn/electronmanual/)

[英文](https://electron.atom.io/docs/)

## electron 项目与 web 项目的区别

electron 核心可以分为两个部分，主进程和渲染进程。主进程连接着操作系统和渲染进程，可以看作页面和计算机沟通的桥梁；渲染进程就是熟悉的前端环境了。

传统的 web 环境，我们是不能对用户的系统系统进行操作的，而 electron 相当于 node 环境，我们可以在项目里使用所有 node api。简单理解，就是为 web 项目套上了一个 node 环境的壳。

## 主进程与渲染进程

Electron 运行的`package.json`的 `main`脚本的进程成为**主进程**。在主进程中运行的脚本通过创建 web 也 main 来展示用户界面，一个 electron 应用总是有且只有一个主进程。

electron 使用了 chromium 来展示 web 页面，所以 chromium 的多进程架构也被使用到。每一个 electron 中的 web 页面运行在它自己的**渲染进程**

中。

普通浏览器中，web 页面通常在一个沙盒环境中运行，不允许去接触原生的 i 资源。然而 electron 的用户在 nodejs api 的支持下可以在页面和操作系统中进行一些底层交互。
