/*
 * @Author: mrjzhang
 * @Date: 2020-01-28 21:06:46
 * @LastEditors  : mrjzhang
 * @LastEditTime : 2020-01-28 21:45:06
 */

const autometa_options = {
  site: {
    name: "易良 yiliang"
  },
  canonical_base: "https://yiliang.site"
};

module.exports = [
  "@vuepress/active-header-links",
  "@vuepress/back-to-top",
  "@vuepress/medium-zoom",
  [
    "@vuepress/google-analytics",
    {
      ga: "UA-156101458-1"
    }
  ],
  // vuepress-plugin-dynamic-title
  [
    "dynamic-title",
    {
      showIcon: "/favicon.ico",
      showText: "(/≧▽≦/)咦！又好了！",
      hideIcon: "/failure.ico",
      hideText: "(●—●)喔哟，崩溃啦！",
      recoverTime: 2000
    }
  ],
  // vuepress-plugin-cursor-effects
  "cursor-effects",
  // vuepress-plugin-go-top
  "go-top",
  // 百度站点自动推送
  "vuepress-plugin-baidu-autopush",
  // 代码拷贝
  ["vuepress-plugin-code-copy", true],
  // autometa
  ["autometa", autometa_options],
  // 对象式插件转化过来的
  ["vuepress-plugin-sitemap", { hostname: "https://yiliang.site" }]
];
