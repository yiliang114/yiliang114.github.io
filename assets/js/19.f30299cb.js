(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{225:function(t,e,a){"use strict";a.r(e);var s=a(0),o=Object(s.a)({},(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"移除-mobx-vscode-装饰器报错"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#移除-mobx-vscode-装饰器报错"}},[t._v("#")]),t._v(" 移除 mobx vscode 装饰器报错")]),t._v(" "),a("p",[t._v("不知各位有没有在使用 vscode 写 mobx+react 的时候，遇到过 "),a("code",[t._v("experimentalDecorators")]),t._v(" warning？ 我花了一点时间来解决这个问题，希望你看了下文之后能够不会浪费自己宝贵的时间。")]),t._v(" "),a("h2",{attrs:{id:"问题截图"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#问题截图"}},[t._v("#")]),t._v(" 问题截图")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://chatflow-files-cdn-1256085166.file.myqcloud.com/4m7YE-image.png",alt:""}})]),t._v(" "),a("p",[a("img",{attrs:{src:"https://chatflow-files-cdn-1256085166.file.myqcloud.com/CxSMn-image.png",alt:""}})]),t._v(" "),a("p",[t._v("当我在 vscode 新创建一个 react+mobx 项目的时候，遇到了下面这个警告。")]),t._v(" "),a("p",[a("strong",[t._v("Experimental support for decorators is a feature that is subject to change in a future release. Set the ‘experimentalDecorators’ option to remove this warning.")])]),t._v(" "),a("p",[t._v("每当我新引入"),a("code",[t._v("MobX")]),t._v("的 "),a("code",[t._v("@observable")]),t._v(" 装饰器时，vscode 并不识别，并将相关的 react class 以及 声明的 observable 属性都下划红线。")]),t._v(" "),a("p",[t._v("不过 webpack 编译项目的时候并没有错误，只是 vscode 一直下划线警告我，很难受。")]),t._v(" "),a("p",[t._v("下面说一个解决办法：")]),t._v(" "),a("h2",{attrs:{id:"解决办法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#解决办法"}},[t._v("#")]),t._v(" 解决办法")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://chatflow-files-cdn-1256085166.file.myqcloud.com/64727-image.png",alt:""}})]),t._v(" "),a("p",[t._v("在项目的根目录创建一个"),a("code",[t._v("tsconfig.json")]),t._v("，并在文件里输入下面的配置：")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v('{\n    "compilerOptions": {\n        "experimentalDecorators": true,\n        "allowJs": true\n    }\n}\n')])])]),a("p",[t._v("重启一下 vscode 或者 关闭文件 tab 重新打开之后，你就应该看不到"),a("code",[t._v("experimentalDecorators")]),t._v(" 警告了。")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://chatflow-files-cdn-1256085166.file.myqcloud.com/beiWw-image.png",alt:""}})]),t._v(" "),a("p",[t._v("希望对你有用，感谢阅读。")])])}),[],!1,null,null,null);e.default=o.exports}}]);