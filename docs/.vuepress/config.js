const headConfig = require("./config/headConf.js");
const pluginsConf = require("./config/pluginsConf.js");

module.exports = {
  title: "yiliang blog",
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
            "campus-recruitment",
            "vue-thanos-snap",
            "browser-cache",
            "code-split",
            "vue-cli@2.x-upgrade",
            "decorator-error"
          ]
        }
      ],
      "/back-end/": ["127.0.0.1-404"],
      "/tools/": ["light-cvm", "mac-install-sublime", "fanqiang"]
    },
    nav: [
      { text: "front-end", link: "/front-end/" },
      { text: "back-end", link: "/back-end/127.0.0.1-404" },
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
  plugins: [
    [
      "@vuepress/google-analytics",
      {
        ga: "UA-156101458-1"
      }
    ]
  ]
};
