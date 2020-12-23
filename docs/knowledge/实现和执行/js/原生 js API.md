---
title: 类型转换
date: '2020-11-02'
draft: true
---

### 已知 ID 的 Input 输入框，希望获取这个输入框的输入值，怎么做？(不使用第三方框架)

```js
document.getElementById('ID').value;
```

### 希望获取到页面中所有的 checkbox 怎么做？(不使用第三方框架)

```js
var domList = document.getElementsByTagName('input')
var checkBoxList = [];
var len = domList.length;　　//缓存到局部变量
while (len--) {　　//使用 while 的效率会比 for 循环更高
　　 if (domList[len].type == ‘checkbox’) {
　　 checkBoxList.push(domList[len]);
　　}
}
```

### 设置一个已知 ID 的 DIV 的 html 内容为 xxxx，字体颜色设置为黑色(不使用第三方框架)

```js
var dom = document.getElementById('ID');
dom.innerHTML = 'xxxx';
dom.style.color = '#000';
```
