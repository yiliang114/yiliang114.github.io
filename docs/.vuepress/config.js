const head = require("./config/head.js");
const plugins = require("./config/plugins.js");
const nav = require("./config/nav");
const sidebar = require("./config/sidebar");

module.exports = {
  title: "易良同学的博客",
  description: "Welcome to my blog site",
  base: "/",
  head,
  themeConfig: {
    logo: "/assets/img/logo.jpg",
    repo: "yiliang114/yiliang114.github.io",
    smoothScroll: true,
    editLinks: true,
    sidebarDepth: 2,
    sidebar,
    nav
  },
  plugins
};
