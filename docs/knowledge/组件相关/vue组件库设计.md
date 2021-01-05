---
title: vue组件库设计
date: '2020-10-26'
draft: true
---

## 如何创建一个 vue 组件库脚手架

https://www.cnblogs.com/tiedaweishao/p/7825997.html

https://github.com/VV-UI/VV-UI/blob/master/packages/row/src/row.js

## 如何设计构思一个 vue 组件库的 api 和功能

参考 element iview 等现有的组件库

https://github.com/ElemeFE/element/blob/dev/packages/button/src/button.vue

## 没有专业的 UI 设计怎么办？

直接去找你喜欢的图片就完事了？ 什么？

http://demo.cssmoban.com/cssthemes5/twts_141_PurpleAdmin/pages/charts/chartjs.html# ## 在开发组件库中遇到的 css 问题

- postcss 的使用和处理

## 如何在开发组件库的过程中单元测试、持续集成

## 发布

### 如何书写标准的 Readme？

总结一下现在比较成熟的开源框架的 readme 的特点

最好是能够输出一个在线的提供给其他开发者的 readme 网站，提供流行的徽章的地址

### issue 模板

### 按需加载插件

### vscode idea 代码提示插件

### example 中写几个 demo

- 官网
- TodoList
- weekly
- 重写一个博客
- vue-cli 脚手架模板

### 适配移动端

- 媒体查询
- rem vw 等适配 ，不过这是 css 问题

### css 问题

- icon 怎么使用雪碧图 ？ 以降低图片文件的大小
- 字体全局设置，需要保证 window mac linux 下的表现一致
- css 的单位 vw 之类的单位，如何快速保证自适应
- 各个浏览器之间的适配，预处理工具（less）后处理工具（postcss）的使用

### vue 问题

- vue 组件中 template 中的标签，是根据 UI 组件库中的 vue 实例的 name 来决定的，比如 button name 是 `bl-button` 或者 `BlButton`, 那么在 template 中使用的标签就可以是 `bl-button`

### 开发者标准

- git commit 标准
- eslint prettier 代码标准
- css bem 命名标准
- 能不能根据 css 的 bem 标准，衍生出一个关于 vue 的组件命名规范？
- vue 命名规范
- 更新日志

### for unknown

- Css 的 bem 规范
- postcss 介绍、插件的使用 postcss-salad
- mixins

### UI 选择

个人博客类型： http://www.17sucai.com/pins/30191.html

## 移动端组件库

### TODO

1. 按需加载
2. 组件库的拆包
3. 可视化的 example （内嵌一个移动端手机页面）
4. site 站点
5. icon svg 大小的处理
6. 正常尺寸、min 文件不同版本的的 cdn 版本、npm 版本 build
7. code 与 demo 的展示结合， 一键拷贝代码
8. issues 模板
9. eslint commitlint 规范
10. common utils 等之类的代码复用
11. ts
12. 分预览版和正式版，dev 分支 push 触发预览版的发布，提供一个组件库页面； 正式版类似
13. 组件库 t1-cli 用于校验一些信息之类的。

### 要点

1. 内嵌一个 h5，开发环境下，组件的编辑实时可见。
2. css 文件单独提取出来。
3. 文档自动编译生成。

### 组件库按需加载原理
