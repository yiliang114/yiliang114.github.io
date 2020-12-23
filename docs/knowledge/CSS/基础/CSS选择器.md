---
layout: CustomPages
title: 基础
date: 2020-11-21
aside: false
draft: true
---

### CSS 中类 (classes) 和 ID 的区别

- 书写上的差别：class 名用“.”号开头来定义，id 名用“#”号开头来定义；
- 优先级不同（权重不同）
- 调用上的区别：在同一个 html 网页页面中 class 是可以被多次调用的（在不同的地方）。而 id 名作为标签的身份则是唯一的，id 在页面中只能出现一次。在 js 脚本中经常会用到 id 来修改一个标签的属性
- id 作为元素的标签，用于区分不同结构和内容，而 class 作为一个样式，它可以应用到任何结构和内容上。
- 在布局思路上，一般坚持这样的原则：id 是先确定页面的结构和内容，然后再为它定义样式：而 class 相反，它先定义好一类样式，然后再页面中根据需要把类样式应用到不同的元素和内容上面。
- 在实际应用时，class 更多的被应用到文字版块以及页面修饰等方面，而 id 更多地被用来实现宏伟布局和设计包含块，或包含框的样式。

一般原则： 类应该应用于概念上相似的元素，这些元素可以出现在同一页面上的多个位置，而 ID 应该应用于不同的唯一的元素

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

### CSS3 属性选择器

| 选择器              | 描述                                                         |
| ------------------- | ------------------------------------------------------------ |
| [attribute]         | 用于选取带有指定属性的元素。                                 |
| [attribute=value]   | 用于选取带有指定属性和值的元素。                             |
| [attribute~=value]  | 用于选取属性值中包含指定词汇的元素。                         |
| [attribute\|=value] | 用于选取带有以指定值开头的属性值的元素，该值必须是整个单词。 |
| [attribute^=value]  | 匹配属性值以指定值开头的每个元素。                           |
| [attribute$=value]  | 匹配属性值以指定值结尾的每个元素。                           |
| [attribute*=value]  | 匹配属性值中包含指定值的每个元素。                           |

### CSS 选择器有哪些？

- id 选择器 #id
- 类选择器 .class
- 标签选择器 div, h1, p
- 相邻选择器 h1 + p
- 子选择器 ul > li
- 后代选择器 li a
- 通配符选择器 \*
- 属性选择器 a[rel='external']
- 伪类选择器 a:hover, li:nth-child

### css 选择器有哪些？

> 在 CSS 中，选择器是一种模式，用于选择需要添加样式的元素。
> "CSS" 列指示该属性是在哪个 CSS 版本中定义的。（CSS1、CSS2 还是 CSS3。）

| 选择器                                                                                            | 例子                  | 例子描述                                            | CSS |
| ------------------------------------------------------------------------------------------------- | --------------------- | --------------------------------------------------- | --- |
| [._class_](http://www.w3school.com.cn/cssref/selector_class.asp)                                  | .intro                | 选择 class="intro" 的所有元素。                     | 1   |
| [#_id_](http://www.w3school.com.cn/cssref/selector_id.asp)                                        | #firstname            | 选择 id="firstname" 的所有元素。                    | 1   |
| [\*](http://www.w3school.com.cn/cssref/selector_all.asp)                                          | \*                    | 选择所有元素。                                      | 2   |
| [_element_](http://www.w3school.com.cn/cssref/selector_element.asp)                               | p                     | 选择所有 <p> 元素。                                 | 1   |
| [_element_,_element_](http://www.w3school.com.cn/cssref/selector_element_comma.asp)               | div,p                 | 选择所有 <div> 元素和所有 <p> 元素。                | 1   |
| [_element_ _element_](http://www.w3school.com.cn/cssref/selector_element_element.asp)             | div p                 | 选择 <div> 元素内部的所有 <p> 元素。                | 1   |
| [_element_>_element_](http://www.w3school.com.cn/cssref/selector_element_gt.asp)                  | div>p                 | 选择父元素为 <div> 元素的所有 <p> 元素。            | 2   |
| [_element_+_element_](http://www.w3school.com.cn/cssref/selector_element_plus.asp)                | div+p                 | 选择紧接在 <div> 元素之后的所有 <p> 元素。          | 2   |
| [[_attribute_\]](http://www.w3school.com.cn/cssref/selector_attribute.asp)                        | [target]              | 选择带有 target 属性所有元素。                      | 2   |
| [[_attribute_=_value_\]](http://www.w3school.com.cn/cssref/selector_attribute_value.asp)          | [target=_blank]       | 选择 target="\_blank" 的所有元素。                  | 2   |
| [[_attribute_~=_value_\]](http://www.w3school.com.cn/cssref/selector_attribute_value_contain.asp) | [title~=flower]       | 选择 title 属性包含单词 "flower" 的所有元素。       | 2   |
| [[_attribute_\|=_value_\]](http://www.w3school.com.cn/cssref/selector_attribute_value_start.asp)  | [lang\|=en]           | 选择 lang 属性值以 "en" 开头的所有元素。            | 2   |
| [:link](http://www.w3school.com.cn/cssref/selector_link.asp)                                      | a:link                | 选择所有未被访问的链接。                            | 1   |
| [:visited](http://www.w3school.com.cn/cssref/selector_visited.asp)                                | a:visited             | 选择所有已被访问的链接。                            | 1   |
| [:active](http://www.w3school.com.cn/cssref/selector_active.asp)                                  | a:active              | 选择活动链接。                                      | 1   |
| [:hover](http://www.w3school.com.cn/cssref/selector_hover.asp)                                    | a:hover               | 选择鼠标指针位于其上的链接。                        | 1   |
| [:focus](http://www.w3school.com.cn/cssref/selector_focus.asp)                                    | input:focus           | 选择获得焦点的 input 元素。                         | 2   |
| [:first-letter](http://www.w3school.com.cn/cssref/selector_first-letter.asp)                      | p:first-letter        | 选择每个 <p> 元素的首字母。                         | 1   |
| [:first-line](http://www.w3school.com.cn/cssref/selector_first-line.asp)                          | p:first-line          | 选择每个 <p> 元素的首行。                           | 1   |
| [:first-child](http://www.w3school.com.cn/cssref/selector_first-child.asp)                        | p:first-child         | 选择属于父元素的第一个子元素的每个 <p> 元素。       | 2   |
| [:before](http://www.w3school.com.cn/cssref/selector_before.asp)                                  | p:before              | 在每个 <p> 元素的内容之前插入内容。                 | 2   |
| [:after](http://www.w3school.com.cn/cssref/selector_after.asp)                                    | p:after               | 在每个 <p> 元素的内容之后插入内容。                 | 2   |
| [:lang(_language_)](http://www.w3school.com.cn/cssref/selector_lang.asp)                          | p:lang(it)            | 选择带有以 "it" 开头的 lang 属性值的每个 <p> 元素。 | 2   |
| [_element1_~_element2_](http://www.w3school.com.cn/cssref/selector_gen_sibling.asp)               | p~ul                  | 选择前面有 <p> 元素的每个 <ul> 元素。               | 3   |
| [[_attribute_^=_value_\]](http://www.w3school.com.cn/cssref/selector_attr_begin.asp)              | a[src^="https"]       | 选择其 src 属性值以 "https" 开头的每个 <a> 元素。   | 3   |
| [[_attribute_\$=_value_\]](http://www.w3school.com.cn/cssref/selector_attr_end.asp)               | a[src$=".pdf"]        | 选择其 src 属性以 ".pdf" 结尾的所有 <a> 元素。      | 3   |
| [[*attribute\*\*=*value\*\]](http://www.w3school.com.cn/cssref/selector_attr_contain.asp)         | a[src*="abc"]         | 选择其 src 属性中包含 "abc" 子串的每个 <a> 元素。   | 3   |
| [:first-of-type](http://www.w3school.com.cn/cssref/selector_first-of-type.asp)                    | p:first-of-type       | 选择属于其父元素的首个 <p> 元素的每个 <p> 元素。    | 3   |
| [:last-of-type](http://www.w3school.com.cn/cssref/selector_last-of-type.asp)                      | p:last-of-type        | 选择属于其父元素的最后 <p> 元素的每个 <p> 元素。    | 3   |
| [:only-of-type](http://www.w3school.com.cn/cssref/selector_only-of-type.asp)                      | p:only-of-type        | 选择属于其父元素唯一的 <p> 元素的每个 <p> 元素。    | 3   |
| [:only-child](http://www.w3school.com.cn/cssref/selector_only-child.asp)                          | p:only-child          | 选择属于其父元素的唯一子元素的每个 <p> 元素。       | 3   |
| [:nth-child(_n_)](http://www.w3school.com.cn/cssref/selector_nth-child.asp)                       | p:nth-child(2)        | 选择属于其父元素的第二个子元素的每个 <p> 元素。     | 3   |
| [:nth-last-child(_n_)](http://www.w3school.com.cn/cssref/selector_nth-last-child.asp)             | p:nth-last-child(2)   | 同上，从最后一个子元素开始计数。                    | 3   |
| [:nth-of-type(_n_)](http://www.w3school.com.cn/cssref/selector_nth-of-type.asp)                   | p:nth-of-type(2)      | 选择属于其父元素第二个 <p> 元素的每个 <p> 元素。    | 3   |
| [:nth-last-of-type(_n_)](http://www.w3school.com.cn/cssref/selector_nth-last-of-type.asp)         | p:nth-last-of-type(2) | 同上，但是从最后一个子元素开始计数。                | 3   |
| [:last-child](http://www.w3school.com.cn/cssref/selector_last-child.asp)                          | p:last-child          | 选择属于其父元素最后一个子元素每个 <p> 元素。       | 3   |
| [:root](http://www.w3school.com.cn/cssref/selector_root.asp)                                      | :root                 | 选择文档的根元素。                                  | 3   |
| [:empty](http://www.w3school.com.cn/cssref/selector_empty.asp)                                    | p:empty               | 选择没有子元素的每个 <p> 元素（包括文本节点）。     | 3   |
| [:target](http://www.w3school.com.cn/cssref/selector_target.asp)                                  | #news:target          | 选择当前活动的 #news 元素。                         | 3   |
| [:enabled](http://www.w3school.com.cn/cssref/selector_enabled.asp)                                | input:enabled         | 选择每个启用的 <input> 元素。                       | 3   |
| [:disabled](http://www.w3school.com.cn/cssref/selector_disabled.asp)                              | input:disabled        | 选择每个禁用的 <input> 元素                         | 3   |
| [:checked](http://www.w3school.com.cn/cssref/selector_checked.asp)                                | input:checked         | 选择每个被选中的 <input> 元素。                     | 3   |
| [:not(_selector_)](http://www.w3school.com.cn/cssref/selector_not.asp)                            | :not(p)               | 选择非 <p> 元素的每个元素。                         | 3   |
| [::selection](http://www.w3school.com.cn/cssref/selector_selection.asp)                           | ::selection           | 选择被用户选取的元素部分。                          | 3   |

### CSS 有哪些继承属性

- `font`
- `word-break`
- `letter-spacing`
- `text-align`
- `text-rendering`
- `word-spacing`
- `white-space`
- `text-indent`
- `text-transform`
- `text-shadow`
- `line-height`
- `color`
- `visibility`
- `cursor`

### CSS 哪些属性可以继承？哪些属性不可以继承？

- 可以继承的样式：font-size、font-family、color、list-style、cursor
- 不可继承的样式：width、height、border、padding、margin、background

### CSS 不同选择器的权重(CSS 层叠的规则)

！important 规则最重要，大于其它规则
行内样式规则，加 1000
对于选择器中给定的各个 ID 属性值，加 100
对于选择器中给定的各个类属性、属性选择器或者伪类选择器，加 10
对于选择其中给定的各个元素标签选择器，加 1
如果权值一样，则按照样式规则的先后顺序来应用，顺序靠后的覆盖靠前的规则

### CSS 优先级算法如何计算？

- 优先级就近原则，同权重情况下样式定义最近者为准
- 载入样式以最后载入的定位为准
- 优先级为: `!important > id > class > tag` important 比 内联优先级高

元素选择符： 1
class 选择符： 10
id 选择符：100
元素标签：1000

### CSS 如何计算选择器优先？

- 相同权重，定义最近者为准：行内样式 > 内部样式 > 外部样式
- 含外部载入样式时，后载入样式覆盖其前面的载入的样式和内部样式
- 选择器优先级: 行内样式[1000] > id[100] > class[10] > Tag[1]
- 在同一组属性设置中，!important 优先级最高，高于行内样式

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
    比如结果为：1093 比 1100，按位比较，从左到右，只要一位高于则立即胜出，否则继续比较。

### CSS 选择器的优先级是如何计算的？

浏览器通过优先级规则，判断元素展示哪些样式。优先级通过 4 个维度指标确定，我们假定以`a、b、c、d`命名，分别代表以下含义：

1. `a`表示是否使用内联样式（inline style）。如果使用，`a`为 1，否则为 0。
2. `b`表示 ID 选择器的数量。
3. `c`表示类选择器、属性选择器和伪类选择器数量之和。
4. `d`表示标签（类型）选择器和伪元素选择器之和。

优先级的结果并非通过以上四个值生成一个得分，而是每个值分开比较。`a、b、c、d`权重从左到右，依次减小。判断优先级时，从左到右，一一比较，直到比较出最大值，即可停止。所以，如果`b`的值不同，那么`c`和`d`不管多大，都不会对结果产生影响。比如`0，1，0，0`的优先级高于`0，0，10，10`。

当出现优先级相等的情况时，最晚出现的样式规则会被采纳。如果你在样式表里写了相同的规则（无论是在该文件内部还是其它样式文件中），那么最后出现的（在文件底部的）样式优先级更高，因此会被采纳。

在写样式时，我会使用较低的优先级，这样这些样式可以轻易地覆盖掉。尤其对写 UI 组件的时候更为重要，这样使用者就不需要通过非常复杂的优先级规则或使用`!important`的方式，去覆盖组件的样式了。

### css 定义的权重

以下是权重的规则：标签的权重为 1，class 的权重为 10，id 的权重为 100，以下例子是演示各种定义的权重值

```css
/*权重为1*/
div {
}
/*权重为10*/
.class1 {
}
/*权重为100*/
#id1 {
}
/*权重为100+1=101*/
#id1 div {
}
/*权重为10+1=11*/
.class1 div {
}
/*权重为10+10+1=21*/
.class1 .class2 div {
}
```

如果权重相同，则最后定义的样式会起作用，但是应该避免这种情况出现

### 浏览器 CSS 匹配顺序：

浏览器 CSS 匹配不是从左到右进行查找，而是从右到左进行查找。比如`#divBox p span.red{color:red;}`，浏览器的查找顺序如下：先查找 html 中所有 class='red'的 span 元素，找到后，再查找其父辈元素中是否有 p 元素，再判断 p 的父元素中是否有 id 为 divBox 的 div 元素，如果都存在则匹配上。浏览器从右到左进行查找的好处是为了尽早过滤掉一些无关的样式规则和元素。

### CSS 选择器有哪些

1. **\*通用选择器**：选择所有元素，**不参与计算优先级**，兼容性 IE6+
2. **#X id 选择器**：选择 id 值为 X 的元素，兼容性：IE6+
3. **.X 类选择器**： 选择 class 包含 X 的元素，兼容性：IE6+
4. **X Y 后代选择器**： 选择满足 X 选择器的后代节点中满足 Y 选择器的元素，兼容性：IE6+
5. **X 元素选择器**： 选择标所有签为 X 的元素，兼容性：IE6+
6. **:link，：visited，：focus，：hover，：active 链接状态**： 选择特定状态的链接元素，顺序 LoVe HAte，兼容性: IE4+
7. **X + Y 直接兄弟选择器**：在**X 之后第一个兄弟节点**中选择满足 Y 选择器的元素，兼容性： IE7+
8. **X > Y 子选择器**： 选择 X 的子元素中满足 Y 选择器的元素，兼容性： IE7+
9. **X ~ Y 兄弟**： 选择**X 之后所有兄弟节点**中满足 Y 选择器的元素，兼容性： IE7+
10. **[attr]**：选择所有设置了 attr 属性的元素，兼容性 IE7+
11. **[attr=value]**：选择属性值刚好为 value 的元素
12. **[attr~=value]**：选择属性值为空白符分隔，其中一个的值刚好是 value 的元素
13. **[attr|=value]**：选择属性值刚好为 value 或者 value-开头的元素
14. **[attr^=value]**：选择属性值以 value 开头的元素
15. **[attr$=value]**：选择属性值以 value 结尾的元素
16. **[attr*=value]**：选择属性值中包含 value 的元素
17. **[:checked]**：选择单选框，复选框，下拉框中选中状态下的元素，兼容性：IE9+
18. **X:after, X::after**：after 伪元素，选择元素虚拟子元素（元素的最后一个子元素），CSS3 中::表示伪元素。兼容性:after 为 IE8+，::after 为 IE9+
19. **:hover**：鼠标移入状态的元素，兼容性 a 标签 IE4+， 所有元素 IE7+
20. **:not(selector)**：选择不符合 selector 的元素。**不参与计算优先级**，兼容性：IE9+
21. **::first-letter**：伪元素，选择块元素第一行的第一个字母，兼容性 IE5.5+
22. **::first-line**：伪元素，选择块元素的第一行，兼容性 IE5.5+
23. **:nth-child(an + b)**：伪类，选择前面有 an + b - 1 个兄弟节点的元素，其中 n
    &gt;= 0， 兼容性 IE9+
24. **:nth-last-child(an + b)**：伪类，选择后面有 an + b - 1 个兄弟节点的元素
    其中 n &gt;= 0，兼容性 IE9+
25. **X:nth-of-type(an+b)**：伪类，X 为选择器，**解析得到元素标签**，选择**前面**有 an + b - 1 个**相同标签**兄弟节点的元素。兼容性 IE9+
26. **X:nth-last-of-type(an+b)**：伪类，X 为选择器，解析得到元素标签，选择**后面**有 an+b-1 个相同**标签**兄弟节点的元素。兼容性 IE9+
27. **X:first-child**：伪类，选择满足 X 选择器的元素，且这个元素是其父节点的第一个子元素。兼容性 IE7+
28. **X:last-child**：伪类，选择满足 X 选择器的元素，且这个元素是其父节点的最后一个子元素。兼容性 IE9+
29. **X:only-child**：伪类，选择满足 X 选择器的元素，且这个元素是其父元素的唯一子元素。兼容性 IE9+
30. **X:only-of-type**：伪类，选择 X 选择的元素，**解析得到元素标签**，如果该元素没有相同类型的兄弟节点时选中它。兼容性 IE9+
31. **X:first-of-type**：伪类，选择 X 选择的元素，**解析得到元素标签**，如果该元素
    是此此类型元素的第一个兄弟。选中它。兼容性 IE9+

### CSS 选择符有哪些？哪些属性可以继承？

1.  id 选择器（ # myid）
2.  类选择器（.myclassname）
3.  标签选择器（div, h1, p）
4.  相邻选择器（h1 + p）
5.  子选择器（ul > li）
6.  后代选择器（li a）
7.  通配符选择器（ \* ）
8.  属性选择器（a[rel = "external"]）
9.  伪类选择器（a: hover, li:nth-child）

- 可继承的样式： font-size font-family color, text-indent;
- 不可继承的样式：border padding margin width height ;
- 优先级就近原则，同权重情况下样式定义最近者为准;
- 载入样式以最后载入的定位为准;
