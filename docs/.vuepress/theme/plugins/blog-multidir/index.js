// 编译时（node）执行
const {
  path,
  datatypes: { isString }
} = require('@vuepress/shared-utils')

const checkFile = (file, key) => {
  if (isString(file)) {
    return key === file
  } else if (Array.isArray(file)) {
    return file.includes(key)
  } else if (file && typeof file === 'boolean') {
    return true
  } else {
    return false
  }
}

module.exports = (options, ctx) => {
  const {
    aliasesRoot = ':root',
    // 分类、Tag 的前缀
    categoryIndexPageUrl = '/category/',
    tagIndexPageUrl = '/tag/',
    // 指定默认的布局组件
    categoryLayout = 'Tag',
    tagLayout = 'Tag',
    postLayout = 'Page',
    postsDir = 'posts',
    // 永久链接默认是关闭的
    permalink = false,
    // 默认的排序函数
    postsSorter = (prev, next) => {
      // frontmatter: 每一个 md 文件头部指定的值
      const prevTime = new Date(prev.frontmatter.date).getTime()
      const nextTime = new Date(next.frontmatter.date).getTime()
      return prevTime - nextTime > 0 ? -1 : 1
    },
    paginationDir = true,
    paginationLimit = 12,
    paginationPath = 'page/',
    defaultPages = {},
    header = {}
  } = options

  return {
    /**
     * 初始化 App 之后，创建 tag 和 分类。 已经对 md 文件编译完毕了
     */
    async ready() {
      // 页面对象列表
      const { pages } = ctx
      const tagMap = {}
      const categoryMap = {}
      const listMap = {}

      const curryHandler = (map, scope) => (key, pageKey) => {
        if (key) {
          if (!map[key]) {
            map[key] = {
              path: scope
                ? `/${scope}/${key}/`
                : key.startsWith(aliasesRoot)
                ? key.split(aliasesRoot)[1] + '/'
                : `/${key}/`,
              pageKeys: []
            }
          }
          map[key].pageKeys.push(pageKey)
        }
      }
      const setPage = map => {
        Object.keys(map).forEach(key => {
          checkFile(paginationDir, key) &&
            (map[key].page = Math.ceil(map[key].pageKeys.length / paginationLimit))
        })
        return map
      }
      const addPages = (map, name) => {
        let pages = []
        Object.keys(map).map(key => {
          if (map[key].page) {
            for (let i = 1; i <= map[key].page; i++) {
              pages.push({
                permalink: i === 1 ? map[key].path : map[key].path + paginationPath + i + '/',
                meta: { [name]: key, current: i },
                frontmatter: { title: key.includes(aliasesRoot) ? '' : key }
              })
            }
          } else {
            pages.push({
              permalink: map[key].path,
              meta: { [name]: key },
              frontmatter: { title: key.includes(aliasesRoot) ? '' : key }
            })
          }
        })
        return pages
      }

      const handleTag = curryHandler(tagMap, 'tag')
      const handleCategory = curryHandler(categoryMap, 'category')
      const handleList = curryHandler(listMap)

      pages
        .sort(postsSorter)
        .forEach(
          ({ key, regularPath, frontmatter: { tag, tags, category, categories, display } }) => {
            // 完整的路径名
            const arrPath = regularPath.split('/').filter(Boolean)

            isString(tag) && handleTag(tag, key)
            isString(category) && handleCategory(category, key)

            Array.isArray(tags) && tags.forEach(tag => handleTag(tag, key))
            Array.isArray(categories) &&
              categories.forEach(category => handleCategory(category, key))

            display === 'home' && handleList(aliasesRoot, key)
            display !== 'none' &&
              arrPath.length > 1 &&
              !arrPath[0].includes('.html') &&
              handleList(arrPath[0], key)
          }
        )

      ctx.tagMap = setPage(tagMap)
      ctx.categoryMap = setPage(categoryMap)
      ctx.listMap = setPage(listMap)

      const extraPages = [
        {
          permalink: tagIndexPageUrl,
          frontmatter: { title: 'Tags', layout: tagLayout }
        },
        {
          permalink: categoryIndexPageUrl,
          frontmatter: { title: 'Categories', layout: categoryLayout }
        },
        ...addPages(ctx.tagMap, 'tagName'),
        ...addPages(ctx.categoryMap, 'categoryName'),
        ...addPages(ctx.listMap, 'listName')
      ]

      // 添加 tags
      if (defaultPages.tags !== false) {
        const { tags = {} } = header
        await ctx.addPage({
          permalink: '/tags/',
          frontmatter: {
            title: tags.title,
            subtitle: tags.subtitle,
            headerImage: tags.headerImage,
            layout: 'tags'
          }
        })
      }
      await Promise.all(extraPages.map(page => ctx.addPage(page)))
    },
    /**
     * Generate tag and category metadata.
     */
    async clientDynamicModules() {
      return [
        {
          name: 'tag.js',
          content: `export default ${JSON.stringify(ctx.tagMap, null, 2)}`
        },
        {
          name: 'category.js',
          content: `export default ${JSON.stringify(ctx.categoryMap, null, 2)}`
        },
        {
          name: 'list.js',
          content: `export default ${JSON.stringify(ctx.listMap, null, 2)}`
        },
        {
          name: 'pluginConfig.js',
          content: `export default {
            aliasesRoot: '${aliasesRoot}',
            categoryIndexPageUrl: '${categoryIndexPageUrl}',
            tagIndexPageUrl: '${tagIndexPageUrl}',
            categoryLayout: '${categoryLayout}',
            tagLayout: '${tagLayout}',
            postLayout: '${postLayout}',
            postsDir: '${postsDir}',
            permalink: '${permalink}',
            postsSorter: ${postsSorter.toString()},
            paginationDir: '${paginationDir}',
            paginationLimit: '${paginationLimit}',
            paginationPath: '${paginationPath}'
          }`
        }
      ]
    },
    /**
     * add layout and set permalink 扩展
     */
    extendPageData($page) {
      const {
        regularPath,
        frontmatter: { layout }
      } = $page
      const setLink = (dir, link) => {
        link &&
          regularPath.startsWith(`/${dir}/`) &&
          regularPath.includes('.html') &&
          ($page.frontmatter.permalink = link)
      }

      !layout && ($page.frontmatter.layout = regularPath.includes('.html') ? postLayout : 'Layout')
      if (isString(postsDir)) {
        setLink(postsDir, permalink)
      } else if (Array.isArray(postsDir)) {
        postsDir.forEach(item => {
          setLink(item, permalink)
        })
      } else {
        for (const key in postsDir) {
          if (postsDir.hasOwnProperty(key)) {
            const link = postsDir[key]
            setLink(key, link)
          }
        }
      }
    },
    enhanceAppFiles: path.resolve(__dirname, 'enhanceAppFile.js')
  }
}
