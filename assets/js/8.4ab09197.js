(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{236:function(t,e,s){"use strict";s.r(e);var a=s(0),i=Object(a.a)({},(function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h3",{attrs:{id:"linux-找不到-iptables-文件"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#linux-找不到-iptables-文件"}},[t._v("#")]),t._v(" linux 找不到 iptables 文件")]),t._v(" "),s("blockquote",[s("p",[t._v("linux 的/etc/sysconfig/下找不到 iptables 文件")])]),t._v(" "),s("h3",{attrs:{id:"问题"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#问题"}},[t._v("#")]),t._v(" 问题")]),t._v(" "),s("p",[t._v("我安装了 linux 的 postfix。本想做些防火墙策略。可是"),s("code",[t._v("service iptables start")]),t._v("或者"),s("code",[t._v("/etc/init.d/iptables start")]),t._v(" 启动不起来。然后发现防火墙策略都是写在"),s("code",[t._v("/etc/sysconfig/iptables")]),t._v("文件里面的。可我发现我也没有这个文件。这该如何解决呢？\n原因一般是没有配置过防火墙，在安装 linux 系统时也已经禁掉了防火墙。")]),t._v(" "),s("h3",{attrs:{id:"解决"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#解决"}},[t._v("#")]),t._v(" 解决")]),t._v(" "),s("p",[t._v("随便写一条 iptables 命令配置个防火墙规则：如：\n"),s("code",[t._v("iptables -P OUTPUT ACCEPT")]),t._v(" 。。。。")]),t._v(" "),s("p",[t._v("然后用命令："),s("code",[t._v("service iptables save")]),t._v("进行保存，默认就保存到文件里。这时"),s("code",[t._v("/etc/sysconfig/iptables")]),t._v("既有了这个文件。防火墙也可以启动了。接下来要写策略，也可以直接写在"),s("code",[t._v("/etc/sysconfig/iptables")]),t._v(" 里了。")])])}),[],!1,null,null,null);e.default=i.exports}}]);