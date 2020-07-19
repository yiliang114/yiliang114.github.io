<!--
 * @Author: mrjzhang
 * @Date: 2020-02-17 11:39:46
 * @LastEditors: mrjzhang
 * @LastEditTime: 2020-02-17 11:43:07
 -->
<template>
  <div class="category">
    <PostsFilter v-model="posts"
      :posts="$category.posts"
      :categories="false" />

    <PostsList :posts="posts" />
  </div>
</template>

<script>
import PostsFilter from "@theme/components/PostsFilter.vue";
import PostsList from "@theme/components/PostsList.vue";

export default {
  name: "Category",

  components: {
    PostsFilter,
    PostsList
  },

  data() {
    return {
      posts: null
    };
  },

  created() {
    this.posts = this.$category.posts;
  }
};
</script>
