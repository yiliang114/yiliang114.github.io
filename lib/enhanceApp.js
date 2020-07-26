import Iconfont from '@theme/components/Iconfont.vue'

console.log(
  '\n' +
    ' %c Wire Designed by yiliang114 %c https://github.com/yiliang114/yiliang114.github.io ' +
    '\n',
  'color: #fadfa3; background: #030307; padding:5px 0; font-size:12px;',
  'background: #fadfa3; padding:5px 0; font-size:12px;'
)

export default ({ Vue }) => {
  Vue.component('Iconfont', {
    functional: true,

    /* eslint-disable-next-line vue/require-render-return */
    render(h, { parent }) {
      if (parent._isMounted) {
        return h(Iconfont)
      } else {
        parent.$once('hook:mounted', () => {
          parent.$forceUpdate()
        })
      }
    }
  })

  // site config.js
  // console.log('siteData', siteData)

  Vue.mixin({
    mounted() {
      console.log('$categories', this.$categories)
    }
  })
}
