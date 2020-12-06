const autometa_options = {
  site: {
    name: '易良 yiliang',
  },
  canonical_base: 'https://yiliang.site',
};

const path = require('path');
const head = require('./config/head.js');

module.exports = {
  title: '易良同学的博客',
  base: '/',
  head,

  description:
    'web前端技术博客,简洁至上,专注web前端学习与总结。JavaScript,js,ES6,TypeScript,vue,python,css3,html5,Node,git,github等技术文章。',

  evergreen: true,

  chainWebpack: (config, isServer) => {
    if (isServer === false) {
      config.optimization.splitChunks({
        maxInitialRequests: 5,
        cacheGroups: {
          vue: {
            test: /[\\/]node_modules[\\/](vue|vue-router|vssue)[\\/]/,
            name: 'vendor.vue',
            chunks: 'all',
          },
          commons: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            name: 'vendor.commons',
            chunks: 'all',
          },
        },
      });
    }
  },

  theme: path.resolve(__dirname, '../../lib'),

  themeConfig: {
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
          link: 'https://github.com/yiliang114',
        },
        twitter: {
          account: 'yiliang',
          link: 'https://twitter.com/yiliang79503471',
        },
        weibo: {
          account: '@易良同学',
          link: 'https://weibo.com/u/3386520174',
        },
        zhihu: {
          account: '易良',
          link: 'https://www.zhihu.com/people/Mrz2J',
        },
        csdn: {
          account: 'yiliang',
          link: 'https://blog.csdn.net/GreekMrzzJ',
        },
        juejin: {
          account: 'yiliang',
          link: 'https://juejin.im/user/58809a6db123db0061cfd1c3',
        },
      },
    },

    header: {
      background: {
        // url: '/images/2.jpg',
        useGeo: true,
      },
      showTitle: true,
    },

    footer: {
      poweredBy: false,
      poweredByTheme: false,
      custom:
        'Copyright 2018-present <a href="https://github.com/yiliang114" target="_blank">yiliang114</a> | MIT License',
      recordVarChar: '浙ICP备16046652号',
    },

    nav: [
      { text: '首页', link: '/', exact: true },
      { text: '文章', link: '/posts/', exact: false },
      { text: '友链', link: '/links/', exact: false },
      { text: '算法', link: '/arithmetic/', exact: false },
      { text: '私语', link: '/whisper', exact: false },
      { text: '拉钩', link: '/lagou', exact: false },
      { text: '分类', link: '/posts/categories/', exact: true },
      // {
      //   text: '关于我',
      //   link: 'https://resume.yiliang.site',
      // },
    ],

    pagination: {
      perPage: 5,
    },

    comments: {
      owner: 'yiliang114',
      repo: 'yiliang114.github.io',
      clientId: '48fbb5f715409b48da06',
      clientSecret: 'c9e49316010d9e3336a6662545cba8b0ab903044',
      autoCreateIssue: true,
    },

    infoCard: {
      headerBackground: {
        // url: '/assets/img/header-image-01.jpg',
        useGeo: true,
      },
    },

    // 友情链接
    friendLinks: [
      {
        name: "Evan's blog",
        avatar: 'https://cdn.jsdelivr.net/gh/xugaoyi/image_store/blog/20200103123203.jpg',
        desc: 'Web前端技术博客，积跬步以至千里，致敬每个爱学习的你。',
        link: 'https://xugaoyi.com/',
      },
      {
        name: 'znote',
        avatar: 'https://zpj80231.gitee.io/znote/vuepress/head-fish.jpg',
        desc: '荷尽已无擎雨盖，菊残犹有傲霜枝',
        link: 'https://zpj80231.gitee.io/znote/',
      },
    ],

    lastUpdated: true,
  },

  plugins: [
    // autometa
    ['autometa', autometa_options],
    // 对象式插件转化过来的
    ['vuepress-plugin-sitemap', { hostname: 'https://yiliang.site', outFile: 'sitemap.xml' }],
    [
      'baidu-tongji',
      {
        hm: '9aff301c4ae8ff27118e8bb605bb3b09',
      },
    ],
    [
      '@vuepress/google-analytics',
      {
        ga: 'UA-156101458-1',
      },
    ],
    // 代码拷贝
    ['vuepress-plugin-code-copy', true],
  ],
};
