<template>
  <div class="main-div posts-list">
    <TransitionFadeSlide>
      <!-- 没有文章的文案 -->
      <div v-if="listPosts.length === 0" key="no-posts" class="no-posts">{{ $themeConfig.lang.noRelatedPosts }}</div>

      <div v-else :key="page" class="posts-items">
        <TransitionFadeSlide tag="div" direction="x" group>
          <PostsListItem v-for="post in pagePosts" :key="post.path" :post="post" :each-side="2" />
        </TransitionFadeSlide>
      </div>
    </TransitionFadeSlide>

    <div v-if="total > 1" class="posts-paginator">
      <Pagination v-model="page" :total="total" />
    </div>
  </div>
</template>

<script>
import TransitionFadeSlide from '@theme/components/TransitionFadeSlide.vue';
import PostsListItem from '@theme/components/PostsListItem.vue';
import Pagination from '@theme/components/Pagination.vue';

export default {
  name: 'PostsList',

  components: {
    TransitionFadeSlide,
    PostsListItem,
    Pagination,
  },

  props: {
    posts: {
      type: Array,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      page: 1,
    };
  },

  computed: {
    perPage() {
      // .vuepress/config.js/themeConfig
      return this.$themeConfig.pagination.perPage || 5;
    },

    total() {
      return Math.ceil(this.listPosts.length / this.perPage);
    },

    listPosts() {
      return this.posts || this.$posts;
    },

    pagePosts() {
      const begin = (this.page - 1) * this.perPage;
      const end = begin + this.perPage;
      return this.listPosts.slice(begin, end);
    },
  },

  watch: {
    listPosts() {
      this.page = 1;
    },
  },
};
</script>

<style lang="stylus" scoped>
@require '~@theme/styles/variables';

.no-posts {
  color: $grayTextColor;
}
</style>
