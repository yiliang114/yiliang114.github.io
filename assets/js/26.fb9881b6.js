(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{382:function(t,a,e){"use strict";e.r(a);var s=e(4),n=Object(s.a)({},(function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h2",{attrs:{id:"vue-灭霸响指效果"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#vue-灭霸响指效果"}},[t._v("#")]),t._v(" vue 灭霸响指效果")]),t._v(" "),e("h3",{attrs:{id:"写在前面"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#写在前面"}},[t._v("#")]),t._v(" 写在前面")]),t._v(" "),e("p",[t._v("灭霸打响指的消失效果。效果来源于 Google 搜索“灭霸” 或者 “thanos”。算是蹭热度的一个 "),e("code",[t._v("Feature")]),t._v(", 我通过 "),e("code",[t._v("F12")]),t._v(" 试图去查看是如何实现的，也抠了一些音频、图片资源下来。后来在 github 上找到了一个现有的项目 "),e("a",{attrs:{href:"https://github.com/lichking24/Thanos_Dust",target:"_blank",rel:"noopener noreferrer"}},[t._v("Thanos_Dust"),e("OutboundLink")],1),t._v(", 所以参考了部分它的代码。 其实它的代码已经算比较完善了，在它的基础上，我用 vue 来写了一下，加了一些英雄，修复了一些 bug ，加了一些效果之类的。")]),t._v(" "),e("p",[e("img",{attrs:{src:"https://chatflow-files-cdn-1256085166.file.myqcloud.com/2019/5/4/16a8266169f61670.png",alt:""}})]),t._v(" "),e("p",[e("img",{attrs:{src:"https://chatflow-files-cdn-1256085166.file.myqcloud.com/2019/5/4/16a8266527ad7ad6.png",alt:""}})]),t._v(" "),e("h3",{attrs:{id:"demo"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#demo"}},[t._v("#")]),t._v(" demo")]),t._v(" "),e("ul",[e("li",[t._v("点击一下手套，伴随音效和响指的动画，会有一半的英雄消失。")]),t._v(" "),e("li",[t._v("消失之后，再点一下，消失的英雄又会回来。")])]),t._v(" "),e("p",[t._v("可以点击下面的链接体验一下")]),t._v(" "),e("p",[e("a",{attrs:{href:"https://yiliang114.github.io/vue-thanos-snap/index.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("demos"),e("OutboundLink")],1)]),t._v(" "),e("p",[e("img",{attrs:{src:"https://chatflow-files-cdn-1256085166.file.myqcloud.com/2019/5/4/16a8275b08db2b4d.png",alt:""}})]),t._v(" "),e("h3",{attrs:{id:"细节"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#细节"}},[t._v("#")]),t._v(" 细节")]),t._v(" "),e("ul",[e("li",[e("p",[t._v("随机选取一半的英雄，是通过下面的算法进行选取的：")]),t._v(" "),e("div",{staticClass:"language-js extra-class"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[t._v("arr"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("sort")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0.5")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v(" Math"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("random")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])])]),t._v(" "),e("li",[e("p",[t._v("被选中的英雄灰飞烟灭的效果解释：")]),t._v(" "),e("ol",[e("li",[t._v("使用 "),e("a",{attrs:{href:"http://html2canvas.hertzen.com/",target:"_blank",rel:"noopener noreferrer"}},[t._v("html2canvas"),e("OutboundLink")],1),t._v(" 库将每一个英雄所在的 "),e("code",[t._v("dom")]),t._v(" 节点渲染为一个 "),e("code",[t._v("canvas")]),t._v(" 节点")]),t._v(" "),e("li",[t._v("通过 "),e("a",{attrs:{href:"https://github.com/yiliang114/vue-thanos-snap/blob/master/src/components/Main.vue/#L117",target:"_blank",rel:"noopener noreferrer"}},[t._v("generateFrames"),e("OutboundLink")],1),t._v(" 方法，将整块的 "),e("code",[t._v("canvas")]),t._v(" 画布图像按像素分割成许多块")]),t._v(" "),e("li",[t._v("创建一个跟选中的英雄所在的 "),e("code",[t._v("dom")]),t._v(" 节点同一个位置、同样的大小的容器覆盖原 "),e("code",[t._v("dom")]),t._v(" 节点")]),t._v(" "),e("li",[t._v("把第二步创建的块绘制到新的画布上，并都通过 "),e("code",[t._v("appendChild")]),t._v(" 方法添加到第三步创建的父容器中")]),t._v(" "),e("li",[t._v("随机设置每一块的 "),e("code",[t._v("rotate")]),t._v(" 角度和 "),e("code",[t._v("translate")]),t._v(" 像素，就能完成灰飞烟灭的效果")]),t._v(" "),e("li",[t._v("将被覆盖的英雄的 "),e("code",[t._v("dom")]),t._v(" 节点设置为不可见的，就完成了响指操作。")])])]),t._v(" "),e("li",[e("p",[t._v("翻转时间，英雄又回来的效果是将原来的 "),e("code",[t._v("dom")]),t._v(" 节点设置为可见的，并加了回复动画。（ "),e("code",[t._v("google")]),t._v(" 的原版恢复动画是将 "),e("code",[t._v("color")]),t._v(" 设置为 "),e("code",[t._v("green")]),t._v(" ，因为这里没什么文字效果并不明显，就设置成了 "),e("code",[t._v("background-color")]),t._v(" ）")])])]),t._v(" "),e("h3",{attrs:{id:"最后"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#最后"}},[t._v("#")]),t._v(" 最后")]),t._v(" "),e("p",[t._v("整个过程其实跟 vue 没什么关系，无论用什么前端技术栈都可以。以前也没有接触过 canvas ，似乎觉得还有点意思， 后面可能慢慢还会做一些改动，会继续学习 canvas 。最后附上"),e("a",{attrs:{href:"https://github.com/yiliang114/vue-thanos-snap",target:"_blank",rel:"noopener noreferrer"}},[t._v(" github 地址"),e("OutboundLink")],1),t._v(".")])])}),[],!1,null,null,null);a.default=n.exports}}]);