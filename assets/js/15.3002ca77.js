(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{213:function(e,s,t){"use strict";t.r(s);var c=t(0),v=Object(c.a)({},(function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h3",{attrs:{id:"vue-项目部署找不到-js-css-文件"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#vue-项目部署找不到-js-css-文件"}},[e._v("#")]),e._v(" vue 项目部署找不到 js css 文件")]),e._v(" "),t("p",[t("img",{attrs:{src:"https://chatflow-files-cdn-1256085166.file.myqcloud.com/20190105154109600.png",alt:"在这里插入图片描述"}}),e._v("\n很多时候 "),t("code",[e._v("npm run build")]),e._v(" 之后， "),t("code",[e._v("index.html")]),e._v(" 文件中 webpack 自动插入的 js 文件 css 文件的相对目录总是不对，发布到服务器上之后，nginx 找不到文件。")]),e._v(" "),t("h4",{attrs:{id:"vue-cli-3"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#vue-cli-3"}},[e._v("#")]),e._v(" vue-cli@3")]),e._v(" "),t("p",[e._v("在 vue-cli@3 中你需要为你 webpack 插入到 "),t("code",[e._v("index.html")]),e._v(" 中 的所有文件添加一个 "),t("code",[e._v("baseUrl")]),e._v(". 你需要在项目的根目录新建一个 "),t("code",[e._v("vue.config.js")]),e._v(", 添加如下内容：")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("...\nmodule.exports = {\n  baseUrl: isProd\n    ? '/baseXXX/'\n    : '/',\n    ....\n}\n")])])]),t("p",[e._v("这里需要注意的是 dev 环境下不需要添加 "),t("code",[e._v("baseUrl")]),e._v(" 。")]),e._v(" "),t("h4",{attrs:{id:"vue-cli-2"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#vue-cli-2"}},[e._v("#")]),e._v(" vue-cli@2")]),e._v(" "),t("p",[e._v("针对 非 vue-cli@3 生成的项目，你如果不关心 webpack 里面是如何实现的，你只需要找到 "),t("code",[e._v("config/index.js")]),e._v(" ， 修改其中的 "),t("code",[e._v("build")]),e._v(" 中的 "),t("code",[e._v("assetsPublicPath")]),e._v(" 即可。")]),e._v(" "),t("p",[e._v("为了验证一下是否可行，你可以本地 build 一下，然后查看 "),t("code",[e._v("dist/index.html")]),e._v(" 中引用的 js css 文件的路径是否携带上你刚刚设置的 "),t("code",[e._v("assetsPublicPath")]),e._v(" 即可。")]),e._v(" "),t("p",[e._v("而关心为啥这样设置就可以的同学们，继续看 "),t("code",[e._v("build/webpack.base.conf.js")]),e._v(" 文件，\n"),t("img",{attrs:{src:"https://chatflow-files-cdn-1256085166.file.myqcloud.com/20190105153832561.png",alt:"在这里插入图片描述"}})]),e._v(" "),t("p",[e._v("非 "),t("code",[e._v("production")]),e._v(" mode 下，是在"),t("code",[e._v("config/index.js")]),e._v(" 中设置的，这里的 "),t("code",[e._v("publicPath")]),e._v(" 默认是\n"),t("img",{attrs:{src:"https://chatflow-files-cdn-1256085166.file.myqcloud.com/20190105153930278.png",alt:"在这里插入图片描述"}})])])}),[],!1,null,null,null);s.default=v.exports}}]);