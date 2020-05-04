const head = require('./config/head.js')
const plugins = require('./config/plugins.js')
const nav = require('./config/nav')
const sidebar = require('./config/sidebar')

module.exports = {
  title: '易良同学的博客',
  description: 'Welcome to my blog site',
  base: '/',
  head,
  themeConfig: {
    logo: '/assets/img/logo.jpg',
    repo: 'yiliang114/yiliang114.github.io',
    smoothScroll: true,
    editLinks: true,
    sidebarDepth: 2,
    sidebar,
    nav,
    footer: {
      repo: 'github.com/yiliang114/yiliang114.github.io',
      // 页脚信息
      createYear: 2019, // 博客创建年份
      copyrightInfo: 'YiLiang', // 博客版权信息，支持 html 标签
      footerBgImg: '/img/footer.png' // 可选的，页脚背景图，只在首页显示
    }
  },
  plugins
}
