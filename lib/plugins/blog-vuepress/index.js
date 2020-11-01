// fork and modify from @vuepress/plugin-blog

const {
  path,
  datatypes: { isString },
} = require('@vuepress/shared-utils');

module.exports = (options, ctx) => {
  const {
    pageEnhancers = [],
    postsDirs = ['_posts'],
    randomDirs = ['_random'],
    linksUrl = '/links/',
    categoryIndexPageUrl = '/category/',
    tagIndexPageUrl = '/tag/',
    columnIndexPageUrl = '/column/',
    permalink = '/:year/:month/:day/:slug',
    lang = {},
  } = options;

  const isDirectChild = regularPath => path.parse(regularPath).dir === '/';
  const enhancers = [
    // 分类
    {
      when: ({ regularPath }) => regularPath === categoryIndexPageUrl,
      frontmatter: { layout: 'Categories' },
    },
    {
      when: ({ regularPath }) => regularPath.startsWith(categoryIndexPageUrl),
      frontmatter: { layout: 'Category' },
    },
    // 标签
    {
      when: ({ regularPath }) => regularPath === tagIndexPageUrl,
      frontmatter: { layout: 'Tags' },
    },
    {
      when: ({ regularPath }) => regularPath.startsWith(tagIndexPageUrl),
      frontmatter: { layout: 'Tag' },
    },
    // 专栏
    {
      when: ({ regularPath }) => regularPath === columnIndexPageUrl,
      frontmatter: { layout: 'Columns' },
    },
    {
      when: ({ regularPath }) => regularPath.startsWith(columnIndexPageUrl),
      frontmatter: { layout: 'Column' },
    },
    {
      when: ({ regularPath }) => regularPath === '/',
      frontmatter: { layout: 'Layout' },
    },
    {
      // 只要是 postsDirs 下的文章全部都会是默认的永久链接形式
      when: ({ regularPath }) => postsDirs.some(prefix => regularPath.startsWith(`/${prefix}/`)),
      frontmatter: {
        layout: 'Post',
        permalink: permalink,
      },
      data: { type: 'post' },
    },
    {
      when: ({ regularPath }) => randomDirs.some(prefix => regularPath.startsWith(`/${prefix}/`)),
      frontmatter: {
        layout: 'Post',
        // permalink: permalink,
      },
      data: { type: 'post' },
    },
    ...pageEnhancers,
    {
      when: ({ regularPath }) => isDirectChild(regularPath),
      frontmatter: { layout: 'Page' },
      data: { type: 'page' },
    },
  ];

  return {
    name: '@vuepress/plugin-blog (yiliang modified version)',
    /**
     * Modify page's metadata according to the habits of blog users.
     */
    extendPageData(pageCtx) {
      const { frontmatter: rawFrontmatter } = pageCtx;

      enhancers.forEach(({ when, data = {}, frontmatter = {} }) => {
        if (when(pageCtx)) {
          Object.keys(frontmatter).forEach(key => {
            if (!rawFrontmatter[key]) {
              rawFrontmatter[key] =
                typeof frontmatter[key] === 'function' ? frontmatter[key](pageCtx) : frontmatter[key];
            }
          });
          Object.assign(pageCtx, data);
        }
      });
    },

    /**
     * Create tag page and category page.
     */
    async ready() {
      const { pages } = ctx;
      // 编译期生成一些配置，生成文件给 runtime 使用
      const tagMap = {};
      const categoryMap = {};
      const columnMap = {};

      const curryHandler = (scope, map) => (key, pageKey) => {
        if (key) {
          if (!map[key]) {
            map[key] = {};
            map[key].path = `${scope}${key}.html`;
            map[key].pageKeys = [];
          }
          map[key].pageKeys.push(pageKey);
        }
      };

      const handleTag = curryHandler(tagIndexPageUrl, tagMap);
      const handleCategory = curryHandler(categoryIndexPageUrl, categoryMap);
      const handleColumn = curryHandler(columnIndexPageUrl, columnMap);

      pages.forEach(({ key, frontmatter: { tag, tags, category, categories, column, columns } }) => {
        if (isString(tag)) {
          handleTag(tag, key);
        }
        if (Array.isArray(tags)) {
          tags.forEach(tag => handleTag(tag, key));
        }
        if (isString(category)) {
          handleCategory(category, key);
        }
        if (Array.isArray(categories)) {
          categories.forEach(category => handleCategory(category, key));
        }
        // 专栏
        if (isString(column)) {
          handleColumn(column, key);
        }
        if (Array.isArray(columns)) {
          columns.forEach(column => handleColumn(column, key));
        }
      });

      ctx.tagMap = tagMap;
      ctx.categoryMap = categoryMap;
      ctx.columnMap = columnMap;

      const extraPages = [
        // 友链
        {
          permalink: linksUrl,
          // TODO: 其他语言待补充
          frontmatter: { title: `${lang.links}`, layout: 'Links', aside: false },
        },
        {
          permalink: tagIndexPageUrl,
          frontmatter: { title: `${lang.tags}` },
        },
        {
          permalink: categoryIndexPageUrl,
          frontmatter: { title: `${lang.categories}` },
        },
        {
          permalink: columnIndexPageUrl,
          frontmatter: { title: `${lang.columns}` },
        },
        ...Object.keys(tagMap).map(tagName => ({
          permalink: tagMap[tagName].path,
          meta: { tagName },
          frontmatter: { title: `${tagName} | ${lang.tag}` },
        })),
        ...Object.keys(categoryMap).map(categoryName => ({
          permalink: categoryMap[categoryName].path,
          meta: { categoryName },
          frontmatter: { title: `${categoryName} | ${lang.category}` },
        })),
        ...Object.keys(columnMap).map(columnName => ({
          permalink: columnMap[columnName].path,
          meta: { columnName },
          frontmatter: { title: `${columnName} | ${lang.column}` },
        })),
      ];
      await Promise.all(extraPages.map(page => ctx.addPage(page)));
    },

    // 编译期间生成一些在客户端使用的模块
    async clientDynamicModules() {
      return [
        {
          name: 'tag.js',
          content: `export default ${JSON.stringify(ctx.tagMap, null, 2)}`,
        },
        {
          name: 'category.js',
          content: `export default ${JSON.stringify(ctx.categoryMap, null, 2)}`,
        },
        {
          name: 'column.js',
          content: `export default ${JSON.stringify(ctx.columnMap, null, 2)}`,
        },
      ];
    },

    enhanceAppFiles: path.resolve(__dirname, 'enhanceAppFile.js'),
  };
};
