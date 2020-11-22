import Iconfont from '@theme/components/Iconfont.vue';
import layoutComponents from '@internal/layout-components';

console.log(
  '\n' + ' %c Wire Designed by yiliang114 %c https://github.com/yiliang114/yiliang114.github.io ' + '\n',
  'color: #fadfa3; background: #030307; padding:5px 0; font-size:12px;',
  'background: #fadfa3; padding:5px 0; font-size:12px;',
);

export default ({ Vue }) => {
  // vuepress 主动全局注册
  for (const [name, component] of Object.entries(layoutComponents)) {
    Vue.component(name, component);
  }

  Vue.component('Iconfont', {
    functional: true,

    /* eslint-disable-next-line vue/require-render-return */
    render(h, { parent }) {
      if (parent._isMounted) {
        return h(Iconfont);
      } else {
        parent.$once('hook:mounted', () => {
          parent.$forceUpdate();
        });
      }
    },
  });
};
