const autometa_options = {
  site: {
    name: '易良 yiliang'
  },
  canonical_base: 'https://yiliang.site'
}

const path = require('path')
const head = require('./config/head.js')
const nav = require('./config/nav')
const sidebar = require('./config/sidebar')

module.exports = {
  title: '易良同学的博客',
  description: 'Welcome to my blog site',
  base: '/',
  head,
  theme: path.resolve(__dirname, '../../lib'),
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
  plugins: [
    // autometa
    ['autometa', autometa_options],
    // 对象式插件转化过来的
    ['vuepress-plugin-sitemap', { hostname: 'https://yiliang.site', outFile: 'sitemap.xml' }],
    [
      'baidu-tongji',
      {
        hm: '9aff301c4ae8ff27118e8bb605bb3b09'
      }
    ],
    [
      '@vuepress/google-analytics',
      {
        ga: 'UA-156101458-1'
      }
    ],
    [
      'vuepress-plugin-comment',
      {
        choosen: 'valine',
        options: {
          el: '#valine-vuepress-comment',
          appId: 'cRV8Jbg7FAogFru8NahlRtqM-gzGzoHsz',
          appKey: '0FMTf3f9xbHRDDwWByIoiyOI',
          visitor: true, // 阅读量统计
          avatar: 'robohash',
          placeholder: '欢迎留言与我分享您的想法...',
          path: '<%- frontmatter.to.path %>'
        },
        container: '#commits-container'
      }
    ]
  ],
  nav: [
    { text: 'HOME', link: '/' },
    { text: 'ABOUT', link: '/about/' },
    { text: 'TAGS', link: '/tags/' },
    {
      text: '关于我',
      type: 'url',
      link: 'http://yiliang.site/resume/'
    }
  ],
  pagination: {
    perPage: 5
  },
  header: {
    background: {
      // url: '/assets/img/header-image-01.jpg',
      useGeo: true
    },
    showTitle: true
  },
  infoCard: {
    headerBackground: {
      // url: '/assets/img/header-image-01.jpg',
      useGeo: true
    }
  },

  lastUpdated: true
}
