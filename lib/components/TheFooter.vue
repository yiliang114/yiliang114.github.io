<template>
  <footer class="footer">
    <p v-if="sns" class="footer-sns-links">
      <a v-for="(item, name) in sns" :key="name" class="sns-link" :href="item.link" target="_blank">
        <IconSns :name="name" :account="item.account" />
      </a>
    </p>

    <p v-if="poweredBy" class="footer-text">
      <span>Powered by</span>

      <a href="https://github.com/vuejs/vuepress" target="_blank">VuePress</a>

      <template v-if="poweredByTheme">
        <span>|</span>

        <a href="https://github.com/yiliang114/vuepress-theme-yiliang114" target="_blank">yiliang114</a>
      </template>
    </p>

    <!-- eslint-disable vue/no-v-html -->
    <p v-if="custom" class="footer-text" v-html="custom" />
    <!-- eslint-enable vue/no-v-html -->

    <!-- 卜算子 -->
    <span id="busuanzi_container_site_pv" v-if="isHome">
      本站总访问量
      <span id="busuanzi_value_site_pv"></span>次
    </span>

    <span id="busuanzi_container_page_pv" v-else>
      本文总阅读量
      <span id="busuanzi_value_page_pv"></span>次
    </span>
  </footer>
</template>

<script>
import IconSns from '@theme/components/IconSns.vue'

export default {
  name: 'TheFooter',

  components: {
    IconSns
  },

  computed: {
    poweredBy() {
      return this.$themeConfig.footer.poweredBy !== false
    },

    poweredByTheme() {
      return this.$themeConfig.footer.poweredByTheme !== false
    },

    custom() {
      return this.$themeConfig.footer.custom || null
    },

    sns() {
      return this.$themeConfig.personalInfo.sns || null
    },

    isHome() {
      return this.$localePath === '/'
    }
  }
}
</script>

<style lang="stylus" scoped>
@require '~@theme/styles/variables';

.footer {
  color: $grayTextColor;
  padding-bottom: 1.5rem;
  text-align: center;
  border-top: 1px solid $borderColor;

  .footer-sns-links {
    margin: 1em 0;
  }

  .footer-text {
    margin: 0.5em 0;
  }
}
</style>
