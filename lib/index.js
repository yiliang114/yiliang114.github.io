const path = require('path');
const { logger } = require('@vuepress/shared-utils');
const markdownItCenterText = require('markdown-it-center-text');

module.exports = (opts, ctx) => {
  // set default theme config
  Object.assign(
    opts,
    Object.assign(
      {
        lang: 'zh-CN',
        personalInfo: {},
        defaultPages: {},
        header: {},
        footer: {},
        infoCard: {},
        plugins: {},
        pagination: {
          perPage: 5,
        },
        comments: {},
      },
      opts,
    ),
  );

  // resolve theme language
  if (typeof opts.lang === 'string') {
    try {
      require.resolve(`./langs/${opts.lang}`);
    } catch (e) {
      opts.lang = 'en-US';
      logger.warn(`[vuepress-theme-wire] lang '${opts.lang}' is not available, fallback to 'en-US'`);
    }
    opts.lang = require(`./langs/${opts.lang}`);
  }

  const { comments, lang, defaultPages, header, infoCard } = opts;

  const noopGeo =
    header.background &&
    (header.background.url || header.background.useGeo === false) &&
    infoCard.headerBackground &&
    (infoCard.headerBackground.url || infoCard.headerBackground.useGeo === false);

  const options = {
    name: 'vuepress-theme-wire',
    plugins: [
      [require('./plugins/blog'), { lang }],
      ['@vuepress/plugin-back-to-top'],
      ['vuepress-plugin-container', { type: 'tip' }],
      ['vuepress-plugin-container', { type: 'warning' }],
      ['vuepress-plugin-container', { type: 'danger' }],

      ['vuepress-plugin-smooth-scroll', opts.plugins['smooth-scroll'] || {}],
      ['@vuepress/nprogress'],
      ['vuepress-plugin-table-of-contents'],
      [
        'vuepress-plugin-zooming',
        Object.assign(
          {
            selector: '.content img',
          },
          opts.plugins.zooming || {},
        ),
      ],
      [
        '@vssue/vuepress-plugin-vssue',
        comments !== false
          ? Object.assign(
              {
                platform: 'github',
              },
              comments,
            )
          : false,
      ],
      '@vuepress/active-header-links',
      '@vuepress/medium-zoom',
      [
        'dynamic-title',
        {
          showIcon: '/favicon.ico',
          showText: '(/≧▽≦/)咦！又好了！',
          hideIcon: '/failure.ico',
          hideText: '(●—●)喔哟，崩溃啦！',
          recoverTime: 2000,
        },
      ],
      // vuepress-plugin-cursor-effects
      'cursor-effects',
      // 百度站点自动推送
      'vuepress-plugin-baidu-autopush',

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
            horizontal: false, // 是否展示为横向样式
          },
        },
      ],
      // TODO: 不确定是否是 pwa 导致收录问题？暂时关闭
      // [
      //   '@vuepress/pwa',
      //   {
      //     serviceWorker: true,
      //     updatePopup: { message: '有新内容更新啦~', buttonText: '刷新一下' },
      //   },
      // ],
    ],
    globalUIComponents: 'Iconfont',

    enhanceAppFiles: [path.resolve(__dirname, 'enhanceApp.js')],

    extendMarkdown: md => md.use(markdownItCenterText),

    chainWebpack(config, isServer) {
      if (noopGeo) {
        // point geopattern to noopModule
        config.resolve.alias.set('geopattern', path.resolve(__dirname, 'utils/noopModule'));
      } else {
        // to make geopattern work
        if (isServer === false) {
          config.node.set('Buffer', false);
        }
      }

      // to use jsx syntax with evergreen config
      if (ctx.siteConfig.evergreen) {
        config.module
          .rule('js')
          .test(/\.js$/)
          .exclude.add(filePath => {
            if (filePath.startsWith(path.resolve(__dirname))) {
              return false;
            }
            return true;
          })
          .end()
          .use('cache-loader')
          .loader('cache-loader')
          .options({
            cacheDirectory: ctx.cacheDirectory,
            cacheIdentifier: ctx.cacheIdentifier,
          })
          .end()
          .use('babel-loader')
          .loader('babel-loader')
          .options({
            babelrc: false,
            configFile: false,
            presets: [require.resolve('@vue/babel-preset-jsx')],
          });
      }
    },

    async ready() {
      if (defaultPages.home !== false) {
        await ctx.addPage({
          permalink: '/',
          frontmatter: {
            title: lang.home,
            layout: 'Home',
          },
        });
      }

      if (defaultPages.posts !== false) {
        await ctx.addPage({
          permalink: '/posts/',
          frontmatter: {
            title: lang.posts,
            layout: 'Posts',
          },
        });
      }

      // filter draft posts in prod mode. add draft: true in md
      if (ctx.isProd) {
        ctx.pages.splice(0, ctx.pages.length, ...ctx.pages.filter(({ frontmatter }) => frontmatter.draft !== true));
      }
    },
  };
  return options;
};
