---
title: '正则表达式'
date: '2020-09-04'
category: 正则
---

# 正则表达式

## 1. 概述

正则表达式用于文本内容的查找和替换。[正则表达式在线工具](https://regexr.com/)

## 2. 匹配单个字符

**.** 可以用来匹配任何的单个字符，但是在绝大多数实现里面，不能匹配换行符；

**.** 是元字符，表示它有特殊的含义，而不是字符本身的含义。如果需要匹配 . ，在 . 前面加上 \ 。

正则表达式一般是区分大小写的，但是也有些实现是不区分。

**正则表达式**

```
nam.
```

**匹配结果**

My **name** is Zheng.

## 3. 匹配一组字符

**[ ]** 定义一个字符集合；

0-9、a-z 定义了一个字符区间，区间使用 ASCII 码来确定，字符区间在 [ ] 中使用。

**-** 只有在 [ ] 之间才是元字符，在 [ ] 之外就是一个普通字符；

**^** 在 [ ] 中是取非操作。

**应用**

匹配以 abc 为开头，并且最后一个字母不为数字的字符串：

**正则表达式**

```
abc[^0-9]
```

**匹配结果**

1.  **abcd**
2.  abc1
3.  abc2

## 4. 使用元字符

### 匹配空白字符

| 元字符 |         说明         |
| :----: | :------------------: |
|  [\b]  | 回退（删除）一个字符 |
|   \f   |        换页符        |
|   \n   |        换行符        |
|   \r   |        回车符        |
|   \t   |        制表符        |
|   \v   |      垂直制表符      |

\r\n 是 Windows 中的文本行结束标签，在 Unix/Linux 则是 \n。

\r\n\r\n 可以匹配 Windows 下的空白行，因为它匹配两个连续的行尾标签，而这正是两条记录之间的空白行；

### 匹配特定的字符类别

#### 数字元字符

| 元字符 |           说明            |
| :----: | :-----------------------: |
|   \d   |  数字字符，等价于 [0-9]   |
|   \D   | 非数字字符，等价于 [^0-9] |

#### 字母数字元字符

| 元字符 |                      说明                      |
| :----: | :--------------------------------------------: |
|   \w   | 大小写字母，下划线和数字，等价于 [a-zA-Z0-9\_] |
|   \W   |                   对 \w 取非                   |

#### 空白字符元字符

| 元字符 |                 说明                  |
| :----: | :-----------------------------------: |
|   \s   | 任何一个空白字符，等价于 [\f\n\r\t\v] |
|   \S   |              对 \s 取非               |

\x 匹配十六进制字符，\0 匹配八进制，例如 \x0A 对应 ASCII 字符 10，等价于 \n。

## 5. 重复匹配

- `\+` 匹配 1 个或者多个字符
- \*\*\*\* \* 匹配 0 个或者多个
- `*?` 匹配 0 个或者 1 个

**应用**

匹配邮箱地址。

**正则表达式**

```
[\w.]+@\w+\.\w+
```

[\w.] 匹配的是字母数字或者 . ，在其后面加上 + ，表示匹配多次。在字符集合 [ ] 里，. 不是元字符；

**匹配结果**

**abc.def<span>@</span>qq.com**

- **{n}** 匹配 n 个字符
- **{m, n}** 匹配 m\~n 个字符
- **{m,}** 至少匹配 m 个字符

\* 和 + 都是贪婪型元字符，会匹配尽可能多的内容。在后面加 ? 可以转换为懒惰型元字符，例如 \*?、+? 和 {m, n}? 。

**正则表达式**

```
a.+c
```

由于 + 是贪婪型的，因此 .+ 会匹配更可能多的内容，所以会把整个 abcabcabc 文本都匹配，而不是只匹配前面的 abc 文本。用懒惰型可以实现匹配前面的。

**匹配结果**

**abcabcabc**

## 6. 位置匹配

### 单词边界

**\b** 可以匹配一个单词的边界，边界是指位于 \w 和 \W 之间的位置；**\B** 匹配一个不是单词边界的位置。

\b 只匹配位置，不匹配字符，因此 \babc\b 匹配出来的结果为 3 个字符。

### 字符串边界

**^** 匹配整个字符串的开头，**\$** 匹配结尾。

^ 元字符在字符集合中用作求非，在字符集合外用作匹配字符串的开头。

分行匹配模式（multiline）下，换行被当做字符串的边界。

**应用**

匹配代码中以 // 开始的注释行

**正则表达式**

```
^\s*\/\/.*$
```

**匹配结果**

1. public void fun() {
2. &nbsp;&nbsp;&nbsp;&nbsp; **// 注释 1**
3. &nbsp;&nbsp;&nbsp;&nbsp; int a = 1;
4. &nbsp;&nbsp;&nbsp;&nbsp; int b = 2;
5. &nbsp;&nbsp;&nbsp;&nbsp; **// 注释 2**
6. &nbsp;&nbsp;&nbsp;&nbsp; int c = a + b;
7. }

## 7. 使用子表达式

使用 **( )** 定义一个子表达式。子表达式的内容可以当成一个独立元素，即可以将它看成一个字符，并且使用 \* 等元字符。

子表达式可以嵌套，但是嵌套层次过深会变得很难理解。

**正则表达式**

```
(ab){2,}
```

**匹配结果**

**ababab**

**|** 是或元字符，它把左边和右边所有的部分都看成单独的两个部分，两个部分只要有一个匹配就行。

**正则表达式**

```
(19|20)\d{2}
```

**匹配结果**

1.  **1900**
2.  **2010**
3.  1020

**应用**

匹配 IP 地址。

IP 地址中每部分都是 0-255 的数字，用正则表达式匹配时以下情况是合法的：

- 一位数字
- 不以 0 开头的两位数字
- 1 开头的三位数
- 2 开头，第 2 位是 0-4 的三位数
- 25 开头，第 3 位是 0-5 的三位数

**正则表达式**

```
((25[0-5]|(2[0-4]\d)|(1\d{2})|([1-9]\d)|(\d))\.){3}(25[0-5]|(2[0-4]\d)|(1\d{2})|([1-9]\d)|(\d))
```

**匹配结果**

1.  **192.168.0.1**
2.  00.00.00.00
3.  555.555.555.555

## 8. 回溯引用

回溯引用使用 **\n** 来引用某个子表达式，其中 n 代表的是子表达式的序号，从 1 开始。它和子表达式匹配的内容一致，比如子表达式匹配到 abc，那么回溯引用部分也需要匹配 abc 。

**应用**

匹配 HTML 中合法的标题元素。

**正则表达式**

\1 将回溯引用子表达式 (h[1-6]) 匹配的内容，也就是说必须和子表达式匹配的内容一致。

```
<(h[1-6])>\w*?<\/\1>
```

**匹配结果**

1.  **&lt;h1>x&lt;/h1>**
2.  **&lt;h2>x&lt;/h2>**
3.  &lt;h3>x&lt;/h1>

### 替换

需要用到两个正则表达式。

**应用**

修改电话号码格式。

**文本**

313-555-1234

**查找正则表达式**

```
(\d{3})(-)(\d{3})(-)(\d{4})
```

**替换正则表达式**

在第一个子表达式查找的结果加上 () ，然后加一个空格，在第三个和第五个字表达式查找的结果中间加上 - 进行分隔。

```
($1) $3-$5
```

**结果**

(313) 555-1234

### 大小写转换

| 元字符 |                说明                |
| :----: | :--------------------------------: |
|   \l   |        把下个字符转换为小写        |
|   \u   |        把下个字符转换为大写        |
|   \L   | 把\L 和\E 之间的字符全部转换为小写 |
|   \U   | 把\U 和\E 之间的字符全部转换为大写 |
|   \E   |           结束\L 或者\U            |

**应用**

把文本的第二个和第三个字符转换为大写。

**文本**

abcd

**查找**

```
(\w)(\w{2})(\w)
```

**替换**

```
$1\U$2\E$3
```

**结果**

aBCd

## 9. 前后查找

前后查找规定了匹配的内容首尾应该匹配的内容，但是又不包含首尾匹配的内容。向前查找用 **?=** 来定义，它规定了尾部匹配的内容，这个匹配的内容在 ?= 之后定义。所谓向前查找，就是规定了一个匹配的内容，然后以这个内容为尾部向前面查找需要匹配的内容。向后匹配用 ?<= 定义（注: javaScript 不支持向后匹配, java 对其支持也不完善）。

**应用**

查找出邮件地址 @ 字符前面的部分。

**正则表达式**

```
\w+(?=@)
```

**结果**

**abc** @qq.com

对向前和向后查找取非，只要把 = 替换成 ! 即可，比如 (?=) 替换成 (?!) 。取非操作使得匹配那些首尾不符合要求的内容。

## 10. 嵌入条件

### 回溯引用条件

条件判断为某个子表达式是否匹配，如果匹配则需要继续匹配条件表达式后面的内容。

**正则表达式**

子表达式 (\\() 匹配一个左括号，其后的 ? 表示匹配 0 个或者 1 个。 ?(1) 为条件，当子表达式 1 匹配时条件成立，需要执行 \) 匹配，也就是匹配右括号。

```
(\()?abc(?(1)\))
```

**结果**

1.  **(abc)**
2.  **abc**
3.  (abc

### 前后查找条件

条件为定义的首尾是否匹配，如果匹配，则继续执行后面的匹配。注意，首尾不包含在匹配的内容中。

**正则表达式**

?(?=-) 为前向查找条件，只有在以 - 为前向查找的结尾能匹配 \d{5} ，才继续匹配 -\d{4} 。

```
\d{5}(?(?=-)-\d{4})
```

**结果**

1.  **11111**
2.  22222-
3.  **33333-4444**

#### 创建正则表达式

1. 使用一个正则表达式字面量

```js
const regex = /^[a-zA-Z]+[0-9]*\W?_$/gi;
```

2. 调用 RegExp 对象的构造函数

```js
const regex = new RegExp(pattern, [, flags]);
```

#### 特殊字符

- ^ 匹配输入的开始
- \$ 匹配输入的结束
- \* 0 次或多次 {0，}
- \+ 1 次或多次 {1，}
- ?
  - 0 次或者 1 次 {0,1}。
  - 用于先行断言
  - 如果紧跟在任何量词 \*、 +、? 或 {} 的后面，将会使量词变为非贪婪
    - 对 "123abc" 用 /\d+/ 将会返回 "123"，
    - 用 /\d+?/,那么就只会匹配到 "1"。
- . 匹配除换行符之外的任何单个字符
- (x) 匹配 'x' 并且记住匹配项
- (?:x) 匹配 'x' 但是不记住匹配项
- x(?=y) 配'x'仅仅当'x'后面跟着'y'.这种叫做正向肯定查找。
- x(?!y) 匹配'x'仅仅当'x'后面不跟着'y',这个叫做正向否定查找。
- x|y 匹配‘x’或者‘y’。
- {n} 重复 n 次
- {n, m} 匹配至少 n 次，最多 m 次
- [xyz] 代表 x 或 y 或 z
- [^xyz] 不是 x 或 y 或 z
- \d 数字
- \D 非数字
- \s 空白字符，包括空格、制表符、换页符和换行符。
- \S 非空白字符
- \w 单词字符（字母、数字或者下划线） [A-Za-z0-9_]
- \W 非单字字符。[^a-za-z0-9_]
- \3 表示第三个分组
- \b 词的边界
  - /\bm/匹配“moon”中得‘m’；
- \B 非单词边界

#### 使用正则表达式的方法

- exec 一个在字符串中执行查找匹配的 RegExp 方法，它返回一个数组（未匹配到则返回 null）。
- test 一个在字符串中测试是否匹配的 RegExp 方法，它返回 true 或 false。
- match 一个在字符串中执行查找匹配的 String 方法，它返回一个数组或者在未匹配到时返回 null。
- search 一个在字符串中测试匹配的 String 方法，它返回匹配到的位置索引，或者在失败时返回-1。
- replace 一个在字符串中执行查找匹配的 String 方法，并且使用替换字符串替换掉匹配到的子字符串。
- split 一个使用正则表达式或者一个固定字符串分隔一个字符串，并将分隔后的子字符串存储到数组中的 String 方法。

#### 练习

匹配结尾的数字

```js
/\d+$/g;
```

统一空格个数
字符串内如有空格，但是空格的数量可能不一致，通过正则将空格的个数统一变为一个。

```js
let reg = /\s+/g;
str.replace(reg, ' ');
```

判断字符串是不是由数字组成

```js
str.test(/^\d+$/);
```

电话号码正则

- 区号必填为 3-4 位的数字
- 区号之后用“-”与电话号码连接电话号码为 7-8 位的数字
- 分机号码为 3-4 位的数字，非必填，但若填写则以“-”与电话号码相连接

```js
/^\d{3,4}-\d{7,8}(-\d{3,4})?$/;
```

手机号码正则表达式
正则验证手机号，忽略前面的 0，支持 130-139，150-159。忽略前面 0 之后判断它是 11 位的。

```js
/^0*1(3|5)\d{9}$/;
```

使用正则表达式实现删除字符串中的空格

```js
function trim(str) {
  let reg = /^\s+|\s+$/g;
  return str.replace(reg, '');
}
```

限制文本框只能输入数字和两位小数点等等

```js
/^\d*\.\d{0,2}$/;
```

只能输入小写的英文字母和小数点，和冒号，正反斜杠(：./\)

```js
/^[a-z\.:\/\\]*$/;
```

替换小数点前内容为指定内容
例如：infomarket.php?id=197 替换为 test.php?id=197

```js
var reg = /^[^\.]+/;
var target = '---------';
str = str.replace(reg, target);
```

只匹配中文的正则表达式

```js
/[\u4E00-\u9FA5\uf900-\ufa2d]/gi;
```

返回字符串的中文字符个数
先去掉非中文字符，再返回 length 属性。

```js
function cLength(str) {
  var reg = /[^\u4E00-\u9FA5\uf900-\ufa2d]/g;
  //匹配非中文的正则表达式
  var temp = str.replace(reg, '');
  return temp.length;
}
```

正则表达式取得匹配 IP 地址前三段
只要匹配掉最后一段并且替换为空字符串就行了

```js
function getPreThrstr(str) {
  let reg = /\.\d{1,3}$/;
  return str.replace(reg, '');
}
```

匹配<ul>与</ul>之间的内容

```js
/<ul>[\s\S]+?</ul>/i
```

用正则表达式获得文件名
c:\images\tupian\006.jpg
可能是直接在盘符根目录下，也可能在好几层目录下，要求替换到只剩文件名。
首先匹配非左右斜线字符 0 或多个，然后是左右斜线一个或者多个。

```js
function getFileName(str) {
  var reg = /[^\\\/]*[\\\/]+/g;
  // xxx\ 或是 xxx/
  str = str.replace(reg, '');
  return str;
}
```

绝对路径变相对路径
"http://23.123.22.12/image/somepic.gif"转换为："/image/somepic.gif"

```js
var reg = /http:\/\/[^\/]+/;
str = str.replace(reg, '');
```

用户名正则
用于用户名注册，，用户名只 能用 中文、英文、数字、下划线、4-16 个字符。

```js
/^[\u4E00-\u9FA5\uf900-\ufa2d\w]{4,16}$/;
```

匹配英文地址
规则如下:
包含 "点", "字母","空格","逗号","数字"，但开头和结尾不能是除字母外任何字符。

```js
/^[a-zA-Z][\.a-zA-Z,0-9]*[a-zA-Z]$/;
```

正则匹配价格
开头数字若干位，可能有一个小数点，小数点后面可以有两位数字。

```js
/^\d+(\.\d{2})?$/;
```

身份证号码的匹配
身份证号码可以是 15 位或者是 18 位，其中最后一位可以是 X。其它全是数字

```js
/^(\d{14}|\d{17})(X|x)$/;
```

单词首字母大写
每单词首字大写，其他小写。如 blue idea 转换为 Blue Idea，BLUE IDEA 也转换为 Blue Idea

```js
function firstCharUpper(str) {
  str = str.toLowerCase();
  let reg = /\b(\w)/g;
  return str.replace(reg, m => m.toUpperCase());
}
```

正则验证日期格式
yyyy-mm-dd 格式
4 位数字，横线，1 或者 2 位数字，再横线，最后又是 1 或者 2 位数字。

```js
/^\d{4}-\d{1,2}-\d{1,2}$/;
```

去掉文件的后缀名
www.abc.com/dc/fda.asp 变为 www.abc.com/dc/fda

```js
function removeExp(str) {
  return str.replace(/\.\w$/, '');
}
```

验证邮箱的正则表达式
开始必须是一个或者多个单词字符或者是-，加上@，然后又是一个或者多个单词字符或者是-。然后是点“.”和单词字符和-的组合，可以有一个或者
多个组合。

```js
/^[\w-]+@\w+\.\w+$/;
```

正则判断标签是否闭合
例如：<img xxx=”xxx” 就是没有闭合的标签；

<p>p的内容，同样也是没闭合的标签。

标签可能有两种方式闭合，<img xxx=”xxx” /> 或者是<p> xxx </p>。

```js
/<([a-z]+)(\s*\w*?\s*=\s*".+?")*(\s*?>[\s\S]*?(<\/\1>)+|\s*\/>)/i;
```

正则判断是否为数字与字母的混合
不能小于 12 位，且必须为字母和数字的混

```js
/^(([a-z]+[0-9]+)|([0-9]+[a-z]+))[a-z0-9]*$/i;
```

将阿拉伯数字替换为中文大写形式

```js
function replaceReg(reg, str) {
  let arr = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  let reg = /\d/g;
  return str.replace(reg, function (m) {
    return arr[m];
  });
}
```

去掉标签的所有属性

<td style="width: 23px; height: 26px;" align="left">***</td>
变成没有任何属性的
<td>***</td>
思路：非捕获匹配属性，捕获匹配标签，使用捕获结果替换掉字符串。正则如下：
```js
/(<td)\s(?:\s*\w*?\s*=\s*".+?")*?\s*?(>)/
```

#### 元字符

|  元字符   |                                      作用                                      |
| :-------: | :----------------------------------------------------------------------------: |
|     .     |                         匹配任意字符除了换行符和回车符                         |
|    []     |           匹配方括号内的任意字符。比如 [0-9] 就可以用来匹配任意数字            |
|     ^     | ^9，这样使用代表匹配以 9 开头。[`^`9]，这样使用代表不匹配方括号内除了 9 的字符 |
|  {1, 2}   |                               匹配 1 到 2 位字符                               |
| (yiliang) |                          只匹配和 yiliang 相同字符串                           |
|    \|     |                              匹配 \| 前后任意字符                              |
|    \      |                                      转义                                      |
|    \*     |                       只匹配出现 0 次及以上 \* 前的字符                        |
|     +     |                        只匹配出现 1 次及以上 + 前的字符                        |
|     ?     |                                 ? 之前字符可选                                 |

#### 修饰语

| 修饰语 |    作用    |
| :----: | :--------: |
|   i    | 忽略大小写 |
|   g    |  全局搜索  |
|   m    |    多行    |

#### 字符简写

| 简写 |         作用         |
| :--: | :------------------: |
|  \w  | 匹配字母数字或下划线 |
|  \W  |      和上面相反      |
|  \s  |   匹配任意的空白符   |
|  \S  |      和上面相反      |
|  \d  |       匹配数字       |
|  \D  |      和上面相反      |
|  \b  | 匹配单词的开始或结束 |
|  \B  |      和上面相反      |

#### 网站

https://www.cnblogs.com/moqiutao/p/6513628.html

### 题目

#### 将下面的字符串，每隔三个字符添加一个空格。

```js
var string = 'seregesbgfsert';
```

> 看到这道题目的时候，首先想到的解决办法应该是正则表达式，如果是数组的操作那就错了。

> 个人答案

```shell
> string.replace(/(\w{4})/g, "$1 ");
< "wefe trsb dfrh y"
```

#### 写一个函数验证手机号合法性

```js
var num = '15010585812';
/^1\d{10}$/.test(num);

// 目前手机号码的范围是
/^1[3|4|5|7|8][0-9]{9}$/;
```

#### 写一个函数，将 URL 参数转换为对象返回（考虑参数有小数点的情况）

```js
function fn(url) {
  var obj = {};
  var params = url.match(/([\?|&|]\w*=[\w\.]*)/g).map(str => str.slice(1));
  params.map(item => {
    var arr = item.split("=");
    obj[arr[0]] = arr[1];
  });
  return obj;
}
var url = "http://www.baidu.com/login?username=hehe&password=123456&num=12.4";
console.log(fn(url));
// 结果
{
  num: "12.4",
  password: "123456",
  username: "hehe"
}
```

#### 写一个 email 的验证(搜狗)

`/^[\w|\d|-|_|\.]+@[\d|\w|-]+(\.[\w|\d|-]+)*\.[\w|\d]{2,6}$/.test("1204183885@qq.com")`

> 规则：
>
> - 开头是字母（a-zA-Z）或者数字、中划线、下划线或者是点
> - @后可以是字母、数组或者中划线

#### 校验填入的内容只能为汉字、数字和字母

`/^[\u4e00-\u9fa50-9a-zA-Z]*$/.test('123木头人er')`

#### 校验数字

`/^[0-9]+(.[0-9]+)?$/.test()`

#### 移除字符串首尾空白

`str.replace(/^\s+|\s+$/, "");`

> 去除字符串中的所有空白`str.replace(/\s+/g, "");`

#### 网址

https://zhuanlan.zhihu.com/p/33608746
https://www.imooc.com/article/3591
https://juejin.im/post/5aab72fd518825188038af9b

#### 正则表达式

相加:

```
var a=/a/gi;
var b=/b/gi;
var c=new RegExp(a.source+b.source,'gi');
```

正则表达式 `g` 符号一次执行之后，会带有一个标记，下一次再执行是从这个标记开始的，而不是从头，所以说 `g` 的正则表达式最好不要多次执行。

#### 菜鸟正则 ？？？

- runoo+b，可以匹配 runoob、runooob、runoooooob 等，+ 号代表前面的字符必须至少出现一次（1 次或多次）。

- runoo*b，可以匹配 runob、runoob、runoooooob 等，* 号代表字符可以不出现，也可以出现一次或者多次（0 次、或 1 次、或多次）。
- colou?r 可以匹配 color 或者 colour，? 问号代表前面的字符最多只可以出现一次（0 次、或 1 次）。

  \f 匹配一个换页符。等价于 \x0c 和 \cL。
  \n 匹配一个换行符。等价于 \x0a 和 \cJ。
  \r 匹配一个回车符。等价于 \x0d 和 \cM。
  \s 匹配任何空白字符，包括空格、制表符、换页符等等。等价于 [ \f\n\r\t\v]。
  \S 匹配任何非空白字符。等价于 [^ \f\n\r\t\v]。

  \$ 字符串的结尾
  ^ 字符串的开头
  ( )标记一个子表达式的开始和结束位置 \*匹配前面的子表达式零次或多次 +匹配前面的子表达式一次或多次
  .匹配除换行符 \n 之外的任何单字符
  ?匹配前面的子表达式零次或一次
  |指明两项之间的一个选择。

  \*、+和?限定符都是贪婪的，因为它们会尽可能多的匹配文字，只有在它们的后面加上一个?就可以实现非贪婪或最小匹配。

  限定符
  限定符用来指定正则表达式的一个给定组件必须要出现多少次才能满足匹配。有 \* 或 + 或 ? 或 {n} 或 {n,} 或 {n,m} 共 6 种。

  定位符
  定位符使您能够将正则表达式固定到行首或行尾。

  ^ 匹配输入字符串开始的位置。如果设置了 RegExp 对象的 Multiline 属性，^ 还会与 \n 或 \r 之后的位置匹配。
  $ 匹配输入字符串结尾的位置。如果设置了 RegExp 对象的 Multiline 属性，$ 还会与 \n 或 \r 之前的位置匹配。
  \b 匹配一个字边界，即字与空格间的位置。

#### 怎么用正则去除字符串前后空格

#### 手写一个正则表达式验证邮箱

#### js 正则表达式，判断字符串是否是在中文， 是否包含中文，是否不包含特殊字符，是否是纯中文等

https://www.cnblogs.com/Garnett-Boy/p/6010850.html

## replace 的几个特殊字符串

还有其它两个 $` 和 $'。

- `$&` 最后匹配的字符.
- `\$`` 最后匹配到的字符之前的字符.
- `$'` 最后匹配到的字符之后的字符.

```
'--1++'.replace( /1/, '$`' ); // ----++
'--1++'.replace( /1/, '$\''); // --++++
'-1+'.replace( /1/, '$&'); // -1+
```
