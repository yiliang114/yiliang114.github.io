const autometa_options = {
  site: {
    name: '易良 yiliang'
  },
  canonical_base: 'https://yiliang.site'
}

module.exports = [
  '@vuepress/active-header-links',
  '@vuepress/back-to-top',
  '@vuepress/medium-zoom',
  [
    '@vuepress/google-analytics',
    {
      ga: 'UA-156101458-1'
    }
  ],
  [
    'dynamic-title',
    {
      showIcon: '/favicon.ico',
      showText: '(/≧▽≦/)咦！又好了！',
      hideIcon: '/failure.ico',
      hideText: '(●—●)喔哟，崩溃啦！',
      recoverTime: 2000
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
  ],
  // vuepress-plugin-cursor-effects
  'cursor-effects',
  // vuepress-plugin-go-top
  // 动漫版的返回顶部
  // 'go-top',
  // 百度站点自动推送
  'vuepress-plugin-baidu-autopush',
  // 代码拷贝
  ['vuepress-plugin-code-copy', true],
  // autometa
  ['autometa', autometa_options],
  // 对象式插件转化过来的
  ['vuepress-plugin-sitemap', { hostname: 'https://yiliang.site', outFile: 'sitemap.xml' }],
  // 代码块的 demo
  [
    'demo-block',
    {
      // demo演示模块
      settings: {
        // jsLib: ['http://xxx'], // 在线示例(jsfiddle, codepen)中的js依赖
        // cssLib: ['http://xxx'], // 在线示例中的css依赖
        // vue: 'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js', // 在线示例中的vue依赖
        jsfiddle: false, // 是否显示 jsfiddle 链接
        codepen: true, // 是否显示 codepen 链接
        horizontal: false // 是否展示为横向样式
      }
    }
  ],
  [
    '@vuepress/pwa',
    {
      serviceWorker: true,
      updatePopup: true
    }
  ],
  [
    'baidu-tongji',
    {
      hm: '9aff301c4ae8ff27118e8bb605bb3b09'
    }
  ]
  // [require('../theme/plugins/blog-multidir')]
]
