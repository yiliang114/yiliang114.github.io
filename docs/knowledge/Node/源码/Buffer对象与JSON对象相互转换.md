---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

```js
> buffer=new Buffer('我爱你，物理');
<Buffer e6 88 91 e7 88 b1 e4 bd a0 ef bc 8c e7 89 a9 e7 90 86>
> json=JSON.stringify(buffer);
'{"type":"Buffer","data":[230,136,145,231,136,177,228,189,160,239,188,140,231,13
7,169,231,144,134]}'
> JSON.parse(json);
{ type: 'Buffer',
  data:
   [ 230,
     136,
     145,
     231,
     136,
     177,
     228,
     189,
     160,
     239,
     188,
     140,
     231,
     137,
     169,
     231,
     144,
     134 ] }
> copy=new Buffer(JSON.parse(json));
<Buffer e6 88 91 e7 88 b1 e4 bd a0 ef bc 8c e7 89 a9 e7 90 86>
> copy.toString();
'我爱你，物理'
>
```

说明：

（1）JSON.stringify 方法将数据对象转换成一个字符串

（2）JSON.parse 方法将字符串转换成对象
