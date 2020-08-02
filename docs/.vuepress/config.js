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
      lang: 'zh-CN'
    }
  },
  // TODO: 开启之后，cache-loader 会导致开发阶段修改 vue 组件错误。
  evergreen: false,

  // chainWebpack: (config, isServer) => {
  //   if (isServer === false) {
  //     config.optimization.splitChunks({
  //       maxInitialRequests: 5,
  //       cacheGroups: {
  //         vue: {
  //           test: /[\\/]node_modules[\\/](vue|vue-router|vssue)[\\/]/,
  //           name: 'vendor.vue',
  //           chunks: 'all'
  //         },
  //         commons: {
  //           test: /[\\/]node_modules[\\/]/,
  //           priority: -10,
  //           name: 'vendor.commons',
  //           chunks: 'all'
  //         }
  //       }
  //     })
  //   }
  // },

  theme: path.resolve(__dirname, '../../lib'),
  themeConfig: {
    title: "Yiliang's Blog",
    logo: '/assets/images/logo.jpg',
    repo: 'yiliang114/yiliang114.github.io',
    smoothScroll: true,
    editLinks: true,
    sidebarDepth: 2,
    sidebar,

    lang: 'zh-CN',

    personalInfo: {
      nickname: 'yiliang114',
      avatar: '/assets/images/avatar.jpeg',
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
        // url:
        //   'https://chatflow-files-cdn-1252847684.cos.ap-nanjing.myqcloud.com/images/4TVbbaNAw9Q-min.jpg',
        useGeo: true
      },
      showTitle: true
    },

    footer: {
      poweredBy: false,
      poweredByTheme: false,
      custom:
        'Copyright 2018-present <a href="https://github.com/yiliang114" target="_blank">yiliang114</a> | MIT License',
      recordVarChar: '浙ICP备16046652号'
    },

    nav: [
      { text: '首页', link: '/', exact: true },
      { text: '文章', link: '/posts/', exact: false },
      { text: '友链', link: '/links/', exact: false }
      // TODO: 暂时隐藏
      // { text: '分类', link: '/posts/categories/', exact: true }
      // {
      //   text: '关于我',
      //   link: 'https://resume.yiliang.site'
      // }
    ],

    pagination: {
      perPage: 5
    },

    comments: {
      owner: 'yiliang114',
      repo: 'yiliang114.github.io',
      clientId: '48fbb5f715409b48da06',
      clientSecret: 'c9e49316010d9e3336a6662545cba8b0ab903044',
      autoCreateIssue: true
    },

    infoCard: {
      headerBackground: {
        // url: '/assets/img/header-image-01.jpg',
        useGeo: true
      }
    },

    // 友情链接
    friendLinks: [
      {
        title: 'Omi',
        icon:
          'https://camo.githubusercontent.com/5a3ce051411cca4d8abd0e0abff879bb5a871520/68747470733a2f2f74656e63656e742e6769746875622e696f2f6f6d692f6173736574732f6f6d692d6c6f676f323031392e737667',
        description: 'Front End Cross-Frameworks Framework',
        link: 'https://github.com/Tencent/omi'
      },
      {
        title: 'CloudBase Framework',
        icon: 'https://avatars0.githubusercontent.com/u/40630849?s=200&v=4',
        description: '云开发官方出品的前后端一体化部署工具',
        link: 'https://github.com/TencentCloudBase/cloudbase-framework'
      },
      {
        title: "Evan's blog",
        icon: 'https://xugaoyi.com/img/EB-logo.png',
        description: 'Web前端技术博客，积跬步以至千里，致敬每个爱学习的你。',
        link: 'https://xugaoyi.com/'
      }
    ],

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
    ]
    // [
    //   'vuepress-plugin-comment',
    //   {
    //     choosen: 'valine',
    //     options: {
    //       el: '#valine-vuepress-comment',
    //       appId: 'cRV8Jbg7FAogFru8NahlRtqM-gzGzoHsz',
    //       appKey: '0FMTf3f9xbHRDDwWByIoiyOI',
    //       visitor: true, // 阅读量统计
    //       avatar: 'robohash',
    //       placeholder: '欢迎留言与我分享您的想法...',
    //       path: '<%- frontmatter.to.path %>'
    //     },
    //     container: '#commits-container'
    //   }
    // ]
  ]
}
