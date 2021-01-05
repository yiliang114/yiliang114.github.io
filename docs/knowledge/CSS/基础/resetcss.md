---
layout: CustomPages
title: 基础
date: 2020-11-21
aside: false
draft: true
---

### 为什么要初始化 CSS 样式

- 因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对 CSS 初始化往往会出现浏览器之间的页面显示差异
- 当然，初始化样式会对 SEO 有一定的影响，但鱼和熊掌不可兼得，但力求影响最小的情况下初始化
- 最简单的初始化方法： \* {padding: 0; margin: 0;} （强烈不建议）
- 可以使用 reset.css 或 Normalize.css 做 CSS 初始化

### Normalize.css 理解

Normalize.css 是一种现代的，为 HTML5 准备的优质替代方案。
创造 normalize.css 有下几个目的：

- 保护有用的浏览器默认样式而不是完全去掉它们
- 一般化的样式：为大部分 HTML 元素提供
- 修复浏览器自身的 bug 并保证各浏览器的一致性
- 优化 CSS 可用性：用一些小技巧
- 解释代码：用注释和详细的文档来

### 如何解决不同浏览器的样式兼容性问题？

- 在确定问题原因和有问题的浏览器后，使用单独的样式表，仅供出现问题的浏览器加载。这种方法需要使用服务器端渲染。
- 使用已经处理好此类问题的库，比如 Bootstrap。
- 使用 `autoprefixer` 自动生成 CSS 属性前缀。
- 使用 Reset CSS 或 Normalize.css。
