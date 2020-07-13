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
    title: "Yiliang's Blog",
    logo: '/assets/img/logo.jpg',
    repo: 'yiliang114/yiliang114.github.io',
    smoothScroll: true,
    editLinks: true,
    sidebarDepth: 2,
    sidebar,
    nav,
    personalInfo: {
      name: 'yiliang114',
      avatar: 'https://chatflow-files-cdn-1256085166.cos.ap-chengdu.myqcloud.com/images/avatar.jpg',
      headerBackgroundImg:
        'https://chatflow-files-cdn-1256085166.cos.ap-chengdu.myqcloud.com/images/santiago-gomez-WpZmGDzOAi0.jpg',
      description: 'In me the tiger sniffs the rose<br/>正在努力',
      email: '1144323068@qq.com',
      location: 'ShenZhen, China',
      organization: '不知名某公司'
    },
    header: {
      home: {
        title: 'Top Blog',
        subtitle: '好好生活，慢慢相遇',
        headerImage:
          'https://chatflow-files-cdn-1256085166.cos.ap-chengdu.myqcloud.com/images/klerk-OomNPPv1Rpk.jpg'
      },
      tags: {
        title: 'Tags',
        subtitle: '遇见你花光了我所有的运气',
        headerImage:
          'https://chatflow-files-cdn-1256085166.cos.ap-chengdu.myqcloud.com/images/leone-venter-VieM9BdZKFo.jpg'
      },
      postHeaderImg:
        'https://chatflow-files-cdn-1256085166.cos.ap-chengdu.myqcloud.com/images/purzlbaum-kxAaw2bO1Z8.jpg'
    },
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
