---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 面向对象的三大特性

1. 封装
1. 继承
1. 多态

### 原型链的知识

1. 创建对象有几种方法
2. 原型、构造函数、实例、原型链
3. 继承
4. `instanceof`的原理
5. `new` 运算符

### 语法糖

var a = {} 其实是 var a = new Object() 的语法糖
var a = [] 其实是 var a = new Array() 的语法糖
function Foo(){} 其实是 var Foo = new Function(){} 的语法糖
使用 instanceof 判断一个函数是否是一个变量的构造函数

### 作用域

JS 没有块级作用域，只有函数和全局作用域。
