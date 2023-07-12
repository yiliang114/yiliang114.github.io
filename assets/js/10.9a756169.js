(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{453:function(t,s,a){"use strict";a.r(s);var e=a(3),n=Object(e.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h2",{attrs:{id:"vscode-标签的展开收起"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#vscode-标签的展开收起"}},[t._v("#")]),t._v(" vscode 标签的展开收起")]),t._v(" "),s("p",[t._v("首选项-设置（可用图形化直接搜索，或用 JSON 格式显示）, 用户设置(User Settings)")]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"[javascript]"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"editor.foldingStrategy"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"indentation"')]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"[javascriptreact]"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"editor.foldingStrategy"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"indentation"')]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"[typescript]"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"editor.foldingStrategy"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"indentation"')]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"[typescriptreact]"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"editor.foldingStrategy"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"indentation"')]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("foldingStrategy：控制计算折叠范围的策略。auto 将使用语言特定的折叠策略 (若可用)。indentation 将使用基于缩进的折叠策略。")]),t._v(" "),s("p",[t._v("全局设置")]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"editor.foldingStrategy"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"indentation"')]),t._v("\n")])])]),s("h3",{attrs:{id:"bug"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#bug"}},[t._v("#")]),t._v(" bug")]),t._v(" "),s("p",[t._v("默认情况下， vscode 的 foldingStrategy 策略是 auto， 针对 vue, js 一类的的语言，折叠代码块之后会看不到末尾的 "),s("code",[t._v("}")]),t._v(" 例如：\n"),s("img",{attrs:{src:"https://user-images.githubusercontent.com/11473889/97098288-3bea4580-16b6-11eb-87e6-eb75fbbd083e.png",alt:"image"}})]),t._v(" "),s("p",[t._v("如果全局设置 "),s("code",[t._v('"editor.foldingStrategy": "indentation"')]),t._v(" 这一类的语言代码块折叠、收起正常了, 如下图\n"),s("img",{attrs:{src:"https://user-images.githubusercontent.com/11473889/97098316-92f01a80-16b6-11eb-995a-c476db6bb4e8.png",alt:"image"}})]),t._v(" "),s("p",[t._v("但是如果你经常在 vscode 中写 markdown 文件的话，你会发现这么配置之后，markdown 的标题无法收起、展开了，\n"),s("img",{attrs:{src:"https://user-images.githubusercontent.com/11473889/97098340-cd59b780-16b6-11eb-912e-a673059467c6.png",alt:"image"}})]),t._v(" "),s("p",[t._v("此时只需要为 markdown 语言设定一个自定义的 "),s("code",[t._v("auto")]),t._v(" 属性即可。")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://user-images.githubusercontent.com/11473889/97098360-07c35480-16b7-11eb-939e-d01a7f6263b7.png",alt:"image"}})]),t._v(" "),s("h3",{attrs:{id:"代码块-全文-折叠-展开-快捷键"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#代码块-全文-折叠-展开-快捷键"}},[t._v("#")]),t._v(" 代码块/全文 折叠/展开 快捷键")]),t._v(" "),s("p",[t._v("要操作光标所在"),s("code",[t._v("文件")]),t._v("中的所有代码块：")]),t._v(" "),s("ul",[s("li",[t._v("折叠所有 "),s("code",[t._v("Ctrl+K+0")])]),t._v(" "),s("li",[t._v("展开所有 "),s("code",[t._v("Ctrl+K+J")])])]),t._v(" "),s("p",[t._v("仅仅操作光标所处"),s("code",[t._v("代码块")]),t._v("内的代码：")]),t._v(" "),s("ul",[s("li",[t._v("折叠 "),s("code",[t._v("Ctrl+Shift+[")])]),t._v(" "),s("li",[t._v("展开 "),s("code",[t._v("Ctrl+Shift+]")])])])])}),[],!1,null,null,null);s.default=n.exports}}]);