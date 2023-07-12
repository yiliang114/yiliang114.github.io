(window.webpackJsonp=window.webpackJsonp||[]).push([[57],{500:function(t,a,e){"use strict";e.r(a);var v=e(3),r=Object(v.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"pc-访问-127-0-0-1-显示-404-报错"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#pc-访问-127-0-0-1-显示-404-报错"}},[t._v("#")]),t._v(" pc 访问 127.0.0.1 显示 404 报错")]),t._v(" "),a("h2",{attrs:{id:"背景"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#背景"}},[t._v("#")]),t._v(" 背景")]),t._v(" "),a("p",[t._v("调试 react-native 的时候进入项目下运行 packager "),a("code",[t._v("react-native start")]),t._v(" 并在另一个命令行窗口"),a("code",[t._v("react-native run-android")]),t._v(" ,首次运行需要等待数分钟并从网上下载 gradle 依赖。因为 android sdk 已经添加到环境变量中，并且 pc 本地访问"),a("code",[t._v("<http://localhost:8081/index.bundle?platform=android>")]),t._v("可以看到编译好的 js 文件内容。接着，模拟器安卓中的"),a("code",[t._v("dev setting")]),t._v(" 已经设置好 pc 的 ip 地址。")]),t._v(" "),a("p",[t._v("此时，能够看到模拟器中的安卓手机大红屏错误。")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://chatflow-files-cdn-1252847684.file.myqcloud.com/image/1578489396953.png",alt:"红屏"}})]),t._v(" "),a("h2",{attrs:{id:"报错内容解读"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#报错内容解读"}},[t._v("#")]),t._v(" 报错内容解读")]),t._v(" "),a("ol",[a("li",[t._v("404 not found")]),t._v(" "),a("li",[t._v("url 是"),a("code",[t._v("http://115.200.16.6:8081/index.bundle?platform=android")])])]),t._v(" "),a("h2",{attrs:{id:"排查过程"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#排查过程"}},[t._v("#")]),t._v(" 排查过程")]),t._v(" "),a("ol",[a("li",[t._v("首先本地访问"),a("code",[t._v("http://115.200.16.6:8081/index.bundle?platform=android")]),t._v(",和"),a("code",[t._v("http://127.0.0.1:8081/index.bundle?platform=android")]),t._v("也是 404 not found")]),t._v(" "),a("li",[t._v("本地访问"),a("code",[t._v("http://localhost:8081/index.bundle?platform=android")]),t._v("正常。")]),t._v(" "),a("li",[a("code",[t._v("react-native start")]),t._v("，"),a("code",[t._v("react-native run-android")]),t._v("命令运行正常。")]),t._v(" "),a("li",[t._v("首先怀疑是否是 hosts 被修改导致的，查看"),a("code",[t._v("C:\\WINDOWS\\System32\\drivers\\etc")]),t._v("得知 hosts 没有被修改，正常。")]),t._v(" "),a("li",[t._v("本地起了一个"),a("code",[t._v("http-server -p 9999")]),t._v(",pc 访问"),a("code",[t._v("localhost：9999")]),t._v("，"),a("code",[t._v("127.0.0.1:9999")]),t._v("以及"),a("code",[t._v("ip:9999")]),t._v("都正常。")]),t._v(" "),a("li",[t._v("关闭"),a("code",[t._v("react-native start")]),t._v(", 使用"),a("code",[t._v("http-server -p 8081")]),t._v("来检验是否是端口 8081 的问题。此时，命令行报错，8081 端口被占用。")])]),t._v(" "),a("p",[a("img",{attrs:{src:"https://chatflow-files-cdn-1252847684.file.myqcloud.com/image/1578489394413.png",alt:"查看端口"}}),a("img",{attrs:{src:"https://chatflow-files-cdn-1252847684.file.myqcloud.com/image/1578489395685.png",alt:"查看pid"}})]),t._v(" "),a("p",[t._v("接着结束 wifi 共享大师（这个软件真的是个坑）。")]),t._v(" "),a("ol",[a("li",[a("p",[t._v("刷新 pc 页面。127.0.0.1 显示正常。reload 模拟器，页面也显示正常了。")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://chatflow-files-cdn-1252847684.file.myqcloud.com/image/1578489398210.png",alt:"pc"}})])])]),t._v(" "),a("p",[a("img",{attrs:{src:"https://chatflow-files-cdn-1252847684.file.myqcloud.com/image/1578489399453.png",alt:"安卓"}})]),t._v(" "),a("h2",{attrs:{id:"总结"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#总结"}},[t._v("#")]),t._v(" 总结")]),t._v(" "),a("p",[t._v("不知道为什么，在 8081 端口本身被占用的情况下"),a("code",[t._v("react-native start")]),t._v("也不会报错。通过这次排错，下次遇到本地访问 localhost 正常，但是访问 127.0.0.1 不正常的情况应该也有可能是端口被占用导致的。最后，既然环境没问题了，helloworld 项目也已经运行，就愉快得开始 react-native 吧~")])])}),[],!1,null,null,null);a.default=r.exports}}]);