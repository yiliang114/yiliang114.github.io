(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{471:function(t,e,a){"use strict";a.r(e);var i=a(3),s=Object(i.a)({},(function(){var t=this,e=t._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h3",{attrs:{id:"多个-origin-区分用户名"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#多个-origin-区分用户名"}},[t._v("#")]),t._v(" 多个 origin 区分用户名")]),t._v(" "),e("p",[t._v("前提条件："),e("strong",[t._v("git 客户端版本大于 2.13")])]),t._v(" "),e("p",[t._v("首先，假设你在 E:\\codes 下存放所有的 git repo。现在建立两个特殊的目录：")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("E:\\codes\\github --\x3e 专门存放托管于 github 的项目\nE:\\codes\\gitlab --\x3e 专门存放托管于 gitlab 的项目\n")])])]),e("p",[t._v("打开 git 的全局配置文件（一般是在 C:\\Users**{用户名}**.gitconfig），配置如下：")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v('[user]\n    name = xxxxx\n    email = xxxxx@qq.com\n\n[includeIf "gitdir:codes/github/"]\n    path = ./.github\n\n[includeIf "gitdir:codes/gitlab/"]\n    path = ./.gitlab\n')])])]),e("p",[t._v("在全局"),e("code",[t._v(".gitconfig")]),t._v("文件夹相同的位置，创建 "),e("code",[t._v(".github")]),t._v(" 和 "),e("code",[t._v(".gitlab")]),t._v(" 文件，内容如下：")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("# .github\n[user]\n    email = xxxxx@gmail.com\n# .gitlab\n[user]\n    email = xxxxx@qq.com\n")])])]),e("p",[t._v("这样配置以后，如果你是在 "),e("code",[t._v("E:\\codes\\gitlab")]),t._v(" 下的某个项目时，你的 email 是 "),e("code",[t._v("xxxxx@qq.com")]),t._v("，如果你是在 "),e("code",[t._v("E:\\codes\\github")]),t._v(" 下的某个项目时，你的 email 是 "),e("code",[t._v("xxxxx@gmail.com")]),t._v("，其它情况下，是 "),e("code",[t._v("xxxxx@qq.com")]),t._v(".")]),t._v(" "),e("p",[t._v("或者换个思路，全局配置 email 为 "),e("code",[t._v("xxxxx@gmail.com")]),t._v("，然后特定目录下的指定为 "),e("code",[t._v("xxxxx@qq.com")]),t._v(".")]),t._v(" "),e("p",[t._v('有关于 "Conditional Includes" 的更多介绍，请查阅官方文档：https://git-scm.com/docs/git-config#_conditional_includes')])])}),[],!1,null,null,null);e.default=s.exports}}]);