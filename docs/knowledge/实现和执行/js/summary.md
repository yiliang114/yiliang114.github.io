---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 实现 (5).add(3).minus(2) 功能。

例： 5 + 3 - 2，结果为 6

```js
Number.prototype.add = function(n) {
  return this.valueOf() + n;
};
Number.prototype.minus = function(n) {
  return this.valueOf() - n;
};
```

### 实现一个字符串匹配算法，从长度为 n 的字符串 S 中，查找是否存在字符串 T，T 的长度是 m，若存在返回所在位置。

```js
const find = (S, T) => {
  if (S.length < T.length) return -1;
  for (let i = 0; i < S.length; i++) {
    if (S.slice(i, i + T.length) === T) return i;
  }
  return -1;
};
```

### 为什么普通 `for` 循环的性能远远高于 `forEach` 的性能，请解释其中的原因。

- for 循环没有任何额外的函数调用栈和上下文；
- forEach 函数签名实际上是

```js
array.forEach(function(currentValue, index, arr), thisValue)
```

它不是普通的 for 循环的语法糖，还有诸多参数和上下文需要在执行的时候考虑进来，这里可能拖慢性能；

### input 搜索如何防抖，如何处理中文输入

防抖就不说了，主要是这里提到的中文输入问题，其实看过 elementui 框架源码的童鞋都应该知道，elementui 是通过 compositionstart & compositionend 做的中文输入处理：
相关代码：

```html
<input
  ref="input"
  @compositionstart="handleComposition"
  @compositionupdate="handleComposition"
  @compositionend="handleComposition"
  \
/>
```

这 3 个方法是原生的方法，这里简单介绍下，官方定义如下 compositionstart 事件触发于一段文字的输入之前（类似于 keydown 事件，但是该事件仅在若干可见字符的输入之前，而这些可见字符的输入可能需要一连串的键盘操作、语音识别或者点击输入法的备选词）
简单来说就是切换中文输入法时在打拼音时(此时 input 内还没有填入真正的内容)，会首先触发 compositionstart，然后每打一个拼音字母，触发 compositionupdate，最后将输入好的中文填入 input 中时触发 compositionend。触发 compositionstart 时，文本框会填入 “虚拟文本”（待确认文本），同时触发 input 事件；在触发 compositionend 时，就是填入实际内容后（已确认文本）,所以这里如果不想触发 input 事件的话就得设置一个 bool 变量来控制。
[![image](https://user-images.githubusercontent.com/34699694/58140376-8f5e9580-7c71-11e9-987e-5fe39fce5e90.png)](https://user-images.githubusercontent.com/34699694/58140376-8f5e9580-7c71-11e9-987e-5fe39fce5e90.png)
根据上图可以看到

输入到 input 框触发 input 事件
失去焦点后内容有改变触发 change 事件
识别到你开始使用中文输入法触发**compositionstart **事件
未输入结束但还在输入中触发**compositionupdate **事件
输入完成（也就是我们回车或者选择了对应的文字插入到输入框的时刻）触发 compositionend 事件。

那么问题来了 使用这几个事件能做什么？
因为 input 组件常常跟 form 表单一起出现，需要做表单验证
[![image](https://user-images.githubusercontent.com/34699694/58140402-b1581800-7c71-11e9-97b9-9c696f3a0061.png)](https://user-images.githubusercontent.com/34699694/58140402-b1581800-7c71-11e9-97b9-9c696f3a0061.png)
为了解决中文输入法输入内容时还没将中文插入到输入框就验证的问题

我们希望中文输入完成以后才验证

### 编程题

url 有三种情况

>

```js
https://www.xx.cn/api?keyword=&level1=&local_batch_id=&elective=&local_province_id=33
https://www.xx.cn/api?keyword=&level1=&local_batch_id=&elective=800&local_province_id=33
https://www.xx.cn/api?keyword=&level1=&local_batch_id=&elective=800,700&local_province_id=33
```

> 匹配 elective 后的数字输出（写出你认为的最优解法）:

```js
[] || ['800'] || ['800', '700'];
```

```js
function getUrlValue(url) {
  if (!url) return;
  let res = url.match(/(?<=elective=)(\d+(,\d+)*)/);
  return res ? res[0].split(',') : [];
}
```

### 考虑到性能问题，如何快速从一个巨大的数组中随机获取部分元素。

比如有个数组有 100K 个元素，从中不重复随机选取 10K 个元素。

由于随机从 100K 个数据中随机选取 10k 个数据，可采用统计学中随机采样点的选取进行随机选取，如在 0-50 之间生成五个随机数，然后依次将每个随机数进行加 50 进行取值，性能应该是最好的。
