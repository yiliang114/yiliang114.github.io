const path = require("path");
const { logger } = require("@vuepress/shared-utils");
const markdownItCenterText = require("markdown-it-center-text");

// Theme API.
module.exports = (opts, ctx) => {
  // set default theme config
  Object.assign(
    opts,
    Object.assign(
      {
        lang: "en-US",
        personalInfo: {},
        defaultPages: {},
        header: {},
        footer: {},
        infoCard: {},
        plugins: {},
        pagination: {
          perPage: 5
        },
        comments: {}
      },
      opts
    )
  );

  // resolve theme language
  if (typeof opts.lang === "string") {
    try {
      require.resolve(`./langs/${opts.lang}`);
    } catch (e) {
      opts.lang = "en-US";
      logger.warn(
        `[vuepress-theme-yiliang114] lang '${opts.lang}' is not available, fallback to 'en-US'`
      );
    }
    opts.lang = require(`./langs/${opts.lang}`);
  }

  const { comments, lang, defaultPages, header, infoCard } = opts;

  const noopGeo =
    header.background &&
    (header.background.url || header.background.useGeo === false) &&
    infoCard.headerBackground &&
    (infoCard.headerBackground.url ||
      infoCard.headerBackground.useGeo === false);

  const options = {
    name: "vuepress-theme-yiliang114",

    alias() {
      const { themeConfig, siteConfig } = ctx;
      // resolve algolia
      const isAlgoliaSearch =
        themeConfig.algolia ||
        Object.keys((siteConfig.locales && themeConfig.locales) || {}).some(
          base => themeConfig.locales[base].algolia
        );
      return {
        "@AlgoliaSearchBox": isAlgoliaSearch
          ? path.resolve(__dirname, "components/AlgoliaSearchBox.vue")
          : path.resolve(__dirname, "util/noopModule.js")
      };
    },

    plugins: [
      [require("./plugins/blog"), { lang }],
      ["@vuepress/active-header-links", options.activeHeaderLinks],
      "@vuepress/search",
      "@vuepress/plugin-nprogress",
      [
        "container",
        {
          type: "tip",
          defaultTitle: {
            "/zh/": "提示"
          }
        }
      ],
      [
        "container",
        {
          type: "warning",
          defaultTitle: {
            "/zh/": "注意"
          }
        }
      ],
      [
        "container",
        {
          type: "danger",
          defaultTitle: {
            "/zh/": "警告"
          }
        }
      ],
      "@vuepress/last-updated",
      ["@dovyp/vuepress-plugin-clipboard-copy", true],
      "tabs"
    ],

    globalUIComponents: "Iconfont",

    enhanceAppFiles: [path.resolve(__dirname, "enhanceApp.js")],

    extendMarkdown: md => md.use(markdownItCenterText),

    // TODO: webpack 别名
    // chainWebpack(config, isServer) {
    //   if (noopGeo) {
    //     // point geopattern to noopModule
    //     config.resolve.alias.set(
    //       "geopattern",
    //       path.resolve(__dirname, "utils/noopModule")
    //     );
    //   } else {
    //     // to make geopattern work
    //     if (isServer === false) {
    //       config.node.set("Buffer", false);
    //     }
    //   }

    //   // to use jsx syntax with evergreen config
    //   if (ctx.siteConfig.evergreen) {
    //     config.module
    //       .rule("js")
    //       .test(/\.js$/)
    //       .exclude.add(filePath => {
    //         if (filePath.startsWith(path.resolve(__dirname))) {
    //           return false;
    //         }
    //         return true;
    //       })
    //       .end()
    //       .use("cache-loader")
    //       .loader("cache-loader")
    //       .options({
    //         cacheDirectory: ctx.cacheDirectory,
    //         cacheIdentifier: ctx.cacheIdentifier
    //       })
    //       .end()
    //       .use("babel-loader")
    //       .loader("babel-loader")
    //       .options({
    //         babelrc: false,
    //         configFile: false,
    //         presets: [require.resolve("@vue/babel-preset-jsx")]
    //       });
    //   }
    // },

    async ready() {
      if (defaultPages.home !== false) {
        await ctx.addPage({
          permalink: "/",
          frontmatter: {
            title: lang.home,
            layout: "Home"
          }
        });
      }

      if (defaultPages.posts !== false) {
        await ctx.addPage({
          permalink: "/posts/",
          frontmatter: {
            title: lang.posts,
            layout: "Posts"
          }
        });
      }

      // filter draft posts in prod mode
      if (ctx.isProd) {
        ctx.pages.splice(
          0,
          ctx.pages.length,
          ...ctx.pages.filter(({ frontmatter }) => frontmatter.draft !== true)
        );
      }
    }
  };

  return opt;
};
