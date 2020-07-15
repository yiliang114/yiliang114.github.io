<template>
  <div class="home">
    <Home v-if="$page.frontmatter.home" />

    <Page v-else :sidebar-items="sidebarItems">
      <slot name="page-top" slot="top" />
      <slot name="page-bottom" slot="bottom" />
    </Page>

    <!-- <Footer /> -->
    <!-- <component v-if="dynamicComponent" :is="dynamicComponent"></component> -->
  </div>
</template>

<script>
import Home from '@theme/components/Home.vue'
import Footer from '@theme/components/Footer.vue'
import Page from '@theme/components/Page.vue'
import { resolveSidebarItems } from '../util'

export default {
  components: {
    Home,
    Page,
    Footer
  },
  data() {
    return {
      dynamicComponent: null
    }
  },

  computed: {
    sidebarItems() {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath
      )
    }
  },

  mounted() {
    // 这样架子啊 Footer 组件，可以使 build 的时候不报不包含 window 的错误
    import('@theme/components/Footer.vue').then(Footer => {
      this.dynamicComponent = Footer.default
    })
  }
}
</script>

<style src="prismjs/themes/prism-tomorrow.css"></style>
