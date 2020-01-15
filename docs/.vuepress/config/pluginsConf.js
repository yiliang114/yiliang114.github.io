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
  "go-top"
];
