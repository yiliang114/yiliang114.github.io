<template>
  <!-- 整体的渲染结构 -->
  <div id="vuepress-theme-wire">
    <TheHeader />

    <TheMain />

    <TheFooter />
  </div>
</template>

<script>
import TheHeader from '@theme/components/TheHeader.vue';
import TheMain from '@theme/components/TheMain.vue';
import TheFooter from '@theme/components/TheFooter.vue';

export default {
  name: 'ThemeYiliang',

  components: {
    TheHeader,
    TheMain,
    TheFooter,
  },
};
</script>

<style lang="stylus" src="@theme/styles/index.styl" />
