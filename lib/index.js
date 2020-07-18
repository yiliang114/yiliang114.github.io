const path = require('path')

module.exports = (opts, ctx) => {
  // set default theme config
  Object.assign(
    opts,
    Object.assign(
      {
        plugins: {},
        defaultPages: {},
        header: {},
        comments: {}
      },
      opts
    )
  )

  const { comments, defaultPages, header } = opts

  const options = {
    name: 'vuepress-theme-melodydl',
    plugins: [
      [require('./plugins/blog')],
      ['@vuepress/plugin-back-to-top'],
      ['vuepress-plugin-container', { type: 'tip' }],
      ['vuepress-plugin-container', { type: 'warning' }],
      ['vuepress-plugin-container', { type: 'danger' }],
      ['vuepress-plugin-smooth-scroll', opts.plugins['smooth-scroll'] || {}],
      ['@vuepress/nprogress'],
      ['vuepress-plugin-table-of-contents'],
      [
        '@vssue/vuepress-plugin-vssue',
        comments !== false ?
          Object.assign(
              {
                platform: 'github'
              },
              comments
            ) :
          false
      ],
      [require('./plugins/blog')],
      '@vuepress/active-header-links',
      '@vuepress/back-to-top',
      '@vuepress/medium-zoom',
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
      // vuepress-plugin-cursor-effects
      'cursor-effects',
      // vuepress-plugin-go-top
      // 动漫版的返回顶部
      // 'go-top',
      // 百度站点自动推送
      'vuepress-plugin-baidu-autopush',
      // 代码拷贝
      ['vuepress-plugin-code-copy', true],
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
      ]
      // [require('./plugins/blog-multidir')]
    ],
    chainWebpack(config, isServer) {
      // to use jsx syntax with evergreen config
      if (ctx.siteConfig.evergreen) {
        config.module
          .rule('js')
          .test(/\.js$/)
          .exclude.add(filePath => {
            if (filePath.startsWith(path.resolve(__dirname))) {
              return false
            }
            return true
          })
          .end()
          .use('cache-loader')
          .loader('cache-loader')
          .options({
            cacheDirectory: ctx.cacheDirectory,
            cacheIdentifier: ctx.cacheIdentifier
          })
          .end()
          .use('babel-loader')
          .loader('babel-loader')
          .options({
            babelrc: false,
            configFile: false,
            presets: [require.resolve('@vue/babel-preset-jsx')]
          })
      }
    },
    async ready() {
      if (defaultPages.layout !== false) {
        await ctx.addPage({
          permalink: '/',
          frontmatter: {
            title: header.home.title,
            subtitle: header.home.subtitle,
            headerImage: header.home.headerImage,
            layout: 'layout'
          }
        })
      }

      if (defaultPages.tags !== false) {
        await ctx.addPage({
          permalink: '/tags/',
          frontmatter: {
            title: header.tags.title,
            subtitle: header.tags.subtitle,
            headerImage: header.tags.headerImage,
            layout: 'tags'
          }
        })
      }
    },

    globalUIComponents: 'Iconfont',

    enhanceAppFiles: path.resolve(__dirname, 'enhanceApp.js')
  }
  return options
}
