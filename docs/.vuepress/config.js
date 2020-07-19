const autometa_options = {
  site: {
    name: '易良 yiliang'
  },
  canonical_base: 'https://yiliang.site'
}

const path = require('path')
const head = require('./config/head.js')
const sidebar = require('./config/sidebar')

module.exports = {
  title: '易良同学的博客',
  description: 'Welcome to my blog site',
  base: '/',
  head,
  locales: {
    '/': {
      lang: 'en-US'
    }
  },
  evergreen: true,

  chainWebpack: (config, isServer) => {
    if (isServer === false) {
      config.optimization.splitChunks({
        maxInitialRequests: 5,
        cacheGroups: {
          vue: {
            test: /[\\/]node_modules[\\/](vue|vue-router|vssue)[\\/]/,
            name: 'vendor.vue',
            chunks: 'all'
          },
          commons: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            name: 'vendor.commons',
            chunks: 'all'
          }
        }
      })
    }
  },

  theme: path.resolve(__dirname, '../../lib'),
  themeConfig: {
    title: "Yiliang's Blog",
    logo: '/assets/img/logo.jpg',
    repo: 'yiliang114/yiliang114.github.io',
    smoothScroll: true,
    editLinks: true,
    sidebarDepth: 2,
    sidebar,

    lang: 'en-US',

    personalInfo: {
      nickname: 'yiliang114',
      avatar: 'https://chatflow-files-cdn-1256085166.cos.ap-chengdu.myqcloud.com/images/avatar.jpg',
      description: 'Happy Coding <br/>正在努力',
      email: '1144323068@qq.com',
      location: 'ShenZhen, China',
      organization: 'Tencent',

      sns: {
        github: {
          account: 'yiliang',
          link: 'https://github.com/yiliang114'
        },
        twitter: {
          account: 'yiliang',
          link: 'https://twitter.com/yiliang79503471'
        },
        weibo: {
          account: '@易良同学',
          link: 'https://weibo.com/u/3386520174'
        },
        zhihu: {
          account: '易良',
          link: 'https://www.zhihu.com/people/Mrz2J'
        },
        csdn: {
          account: 'yiliang',
          link: 'https://blog.csdn.net/GreekMrzzJ'
        },
        juejin: {
          account: 'yiliang',
          link: 'https://juejin.im/user/58809a6db123db0061cfd1c3'
        }
      }
    },

    header: {
      background: {
        // url: '/assets/img/header-image-01.jpg',
        useGeo: true
      },
      showTitle: true
    },

    footer: {
      poweredBy: true,
      poweredByTheme: true,
      custom:
        'Copyright 2018-present <a href="https://github.com/yiliang114" target="_blank">yiliang114</a> | MIT License'
    },

    nav: [
      { text: 'Home', link: '/', exact: true },
      { text: 'Posts', link: '/posts/', exact: false },
      {
        text: '关于我',
        link: 'http://yiliang.site/resume/'
      }
    ],
    pagination: {
      perPage: 5
    },
    infoCard: {
      headerBackground: {
        // url: '/assets/img/header-image-01.jpg',
        useGeo: true
      }
    },

    lastUpdated: true
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
  ]
}
