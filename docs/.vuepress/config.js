/*
 * @Author: mrjzhang
 * @Date: 2020-01-28 21:06:46
 * @LastEditors  : mrjzhang
 * @LastEditTime : 2020-02-08 10:22:58
 */
const headConfig = require("./config/headConf.js");
const pluginsConf = require("./config/pluginsConf.js");

module.exports = {
  title: "易良同学的博客",
  description: "Welcome to my blog site",
  base: "/",
  head: headConfig,
  themeConfig: {
    logo: "/assets/img/logo.jpg",
    repo: "yiliang114/yiliang114.github.io",
    smoothScroll: true,
    editLinks: true,
    sidebarDepth: 2,
    sidebar: {
      "/front-end/": [
        {
          title: "前端",
          collapsable: false,
          children: [
            "Vue-Script-Static-file-Uncaught-SyntaxError",
            "browser-cache",
            "campus-recruitment",
            "can-not-find-js-or-css-files-of-nginx",
            "code-split",
            "common-use-to-cross-domain-for-fe",
            "css-show-ellipsis-when-multi-line",
            "decorator-error",
            "element-table-content-newline",
            "mobx@4.x-Array.map-in-strict",
            "vue-cli@2.x-upgrade",
            "vue-import-ttf-font",
            "vue-input-enter-event-in-chinese-method",
            "vue-style-background-image-blank",
            "vue-thanos-snap"
          ]
        }
      ],
      "/ios-and-android/": ["127.0.0.1-404"],
      "/code-and-life/": ["cname-forget", "technical-debt"],
      "/tools/": [
        "add-subline-into-right-hand-menu",
        "add-vscode-into-right-hand-menu",
        "fanqiang",
        "jetbrains-exclude-node_modules",
        "light-cvm",
        "mac-install-sublime",
        "solo-migration",
        "vim",
        "vscode-vue-file-template"
      ],
      "/back-end/": ["linux-iptables", "ubuntu-docker-jenkins"],
      "/go/": [
        "environment-setup-for-mac-developer",
        "environment-setup-for-win-developer"
      ],
      "/node/": ["process-env"]
    },
    nav: [
      { text: "front-end", link: "/front-end/browser-cache" },
      { text: "code-and-life", link: "/code-and-life/cname-forget" },
      { text: "ios-and-android", link: "/ios-and-android/127.0.0.1-404" },
      { text: "tools", link: "/tools/light-cvm" },
      {
        text: "Contact",
        items: [
          {
            text: "github",
            link: "https://github.com/yiliang114"
          },
          {
            text: "知乎",
            link: "https://www.zhihu.com/people/Mrz2J"
          },
          {
            text: "掘金",
            link: "https://juejin.im/user/58809a6db123db0061cfd1c3"
          }
        ]
      }
    ]
  },
  plugins: pluginsConf
};
