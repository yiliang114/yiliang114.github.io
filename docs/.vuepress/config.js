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
      repo: 'https://github.com/yiliang114/yiliang114.github.io',
      // 页脚信息
      createYear: 2019, // 博客创建年份
      footerBgImg: '/img/footer.png', // 可选的，页脚背景图，只在首页显示
      // 备案号
      internetContentProvider: '浙ICP备16046652号-3',
      sns: [
        {
          iconClass: 'icon-QQ',
          title: 'QQ',
          link: 'tencent://message/?uin=1144323068&Site=&Menu=yesUrl'
        },
        {
          iconClass: 'icon-youjian',
          title: '发邮件',
          link: 'mailto:1144323068@qq.com'
        },
        {
          iconClass: 'icon-github',
          title: 'GitHub',
          link: 'https://github.com/yiliang114'
        },
        {
          iconClass: 'icon-erji',
          title: '听音乐',
          link: 'https://music.163.com/#/playlist?id=126140745'
        }
      ]
    }
  },
  plugins
}
