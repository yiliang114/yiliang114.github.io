---
layout: CustomPages
title: 基础
date: 2020-11-21
aside: false
draft: true
---

### CSS 选择器分类

- 标签选择
- id 选择器
- class 选择器
- 后代选择 （div a）
- 子代选择 （div > p）
- 相邻选择 （div + p）
- 通配符选择 （\*）
- 否定选择器 :not(.link){}
- 属性选择器
- 伪类选择器
- 伪元素选择器 ::before{}

### CSS 哪些属性可以继承？哪些属性不可以继承？

- 可以继承的样式：font-size、font-family、color、list-style、cursor
- 不可继承的样式：width、height、border、padding、margin、background

### 请你说说 CSS 有什么特殊性?（优先级、计算特殊值）

优先级

1. 同类型，同级别的样式后者先于前者
2. ID > 类样式 > 标签 > \*
3. 内联>ID 选择器>伪类>属性选择器>类选择器>标签选择器>通用选择器(\*)>继承的样式
4. 具体 > 泛化的，特殊性即 css 优先级
5. 近的 > 远的 (内嵌样式 > 内部样式表 > 外联样式表)
   - 内嵌样式：内嵌在元素中，<span style="color:red">span</span>
   - 内部样式表：在页面中的样式，写在<style></style>中的样式
   - 外联样式表：单独存在一个 css 文件中，通过 link 引入或 import 导入的样式
6. !important 权重最高，比 inline style 还要高

计算特殊性值
important > 内嵌 > ID > 类 > 标签 | 伪类 | 属性选择 > 伪对象 > 继承 > 通配符
权重、特殊性计算法：
CSS 样式选择器分为 4 个等级，a、b、c、d

1.  如果样式是行内样式（通过 Style=“”定义），那么 a=1，1,0,0,0
2.  b 为 ID 选择器的总数 0,1,0,0
3.  c 为属性选择器，伪类选择器和 class 类选择器的数量。0,0,1,0
4.  d 为标签、伪元素选择器的数量 0,0,0,1
5.  !important 权重最高，比 inline style 还要高

### CSS 优先级算法如何计算？

- 优先级就近原则，同权重情况下样式定义最近者为准
- 载入样式以最后载入的定位为准
- 优先级为: `!important > id > class > tag` important 比 内联优先级高

元素选择符： 1
class 选择符： 10
id 选择符：100
元素标签：1000
