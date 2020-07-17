import compareDesc from 'date-fns/compare_desc'

export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
  options, // 附加到根实例的一些选项
  router, // 当前应用的路由实例
  siteData // 站点元数据
}) => {
  // ...做一些其他的应用级别的优化
  Vue.mixin({
    computed: {
      $posts() {
        const pages = this.$site.pages
        const pageFilter = p => p.type === 'post'
        const pageSort = (p1, p2) => {
          if (p1.top === p2.top) {
            return compareDesc(p1.createdAt, p2.createdAt)
          }
          if (p1.top && p2.top) {
            return p1.top - p2.top
          }
          return p2.top ? 1 : -1
        }
        const posts = pages.filter(pageFilter).sort(pageSort)
        return posts
      }
    }
  })

  // site config.js
  // console.log('siteData', siteData)

  console.log('options', options)

  console.log(
    '\n' +
      ' %c Wire Designed by yiliang114 %c https://github.com/yiliang114/yiliang114.github.io ' +
      '\n',
    'color: #fadfa3; background: #030307; padding:5px 0; font-size:12px;',
    'background: #fadfa3; padding:5px 0; font-size:12px;'
  )
}
