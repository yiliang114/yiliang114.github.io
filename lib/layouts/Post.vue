<template>
  <div class="post">
    <PostMeta v-if="meta" />

    <article class="main-div">
      <Content :key="$page.path" class="post-content content" />
    </article>

    <PostMeta v-if="meta" />

    <!-- 开发环境不显示评论避免跳转 -->
    <div v-if="vssue && isProd" id="post-comments" class="main-div">
      <Vssue :title="vssueTitle" :issue-id="vssueId" />
    </div>
  </div>
</template>

<script>
import PostMeta from '@theme/components/PostMeta.vue';

const isProd = process.env.NODE_ENV;
export default {
  name: 'Post',
  data() {
    return {
      isProd,
    };
  },
  components: {
    PostMeta,
  },
  computed: {
    meta() {
      return this.$frontmatter.meta !== false;
    },
    vssue() {
      return (
        this.$themeConfig.comments !== false && this.$frontmatter.vssue !== false && (this.vssueTitle || this.vssueId)
      );
    },
    vssueTitle() {
      return this.$frontmatter['vssue-title'] || this.$frontmatter.title || undefined;
    },
    vssueId() {
      return this.$frontmatter['vssue-id'] || undefined;
    },
  },
};
</script>
