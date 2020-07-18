<template>
  <div class="container">
    <main class="main" :style="style">
      <!-- 主体部分 -->
      <TransitionSlide>
        <!-- 布局组件 -->
        <component :is="layout" :key="$page.path" />
      </TransitionSlide>
    </main>
    <TransitionSlide direction="x">
      <aside v-show="layout !== 'tags'" class="aside">
        <!-- 个人信息组件 -->
        <InfoCard class="main-div" />
        <!-- Tags 列表组件 -->
        <TagCard class="main-div" />

        <!-- 推荐的文章列表 -->
        <PostToc v-if="$page.type === 'post'" class="main-div aside-toc" />
      </aside>
    </TransitionSlide>
  </div>
</template>

<script>
import TransitionSlide from '@theme/components/L/TransitionSlide.vue'
import InfoCard from '@theme/components/L/InfoCard.vue'
import TagCard from '@theme/components/L/TagCard'
import PostToc from '@theme/components/L/PostToc.vue'
export default {
  name: 'MyMain',
  components: {
    InfoCard,
    TagCard,
    PostToc,
    TransitionSlide
  },
  computed: {
    layout() {
      // 从 md 文件中解析出指定的布局，否则给默认的布局组件，或者 NotFound
      const layout = this.$page.frontmatter.layout
      if (layout) {
        return layout
      }
      // 不存在的路径
      if (!this.$page.path) {
        return 'NotFound'
      }
      return 'Layout'
    },
    style() {
      return {
        width: this.$page.path !== '/tags/' ? '60%' : '70%'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@require '~@theme/styles/variables';

.container {
  display: inline-flex;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  justify-content: center;
  margin-top: 3rem;
  margin-bottom: 1.5rem;

  .main {
    width: 62% !important;
  }

  .aside {
    width: 21%;
    margin-left: 1.5rem;

    .aside-toc {
      margin-top: 1.2rem;
    }
  }

  @media (max-width: $MQMobile - 1) {
    margin: 0;

    .main {
      min-width: 100%;
    }

    .aside {
      display: none;
    }
  }
}
</style>
