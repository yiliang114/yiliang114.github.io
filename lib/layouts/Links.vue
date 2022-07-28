<template>
  <!-- 不应该集成到 lib 中， 应该是作为自定义布局 -->
  <div class="main-div">
    <div class="cardListContainer">
      <div class="card-list">
        <LinkCard v-for="(link, index) in friendLinks" :key="link.title + index || index" :info="link" />
      </div>
    </div>
    <br />
    <Vssue title="友情链接" />
  </div>
</template>

<script>
import LinkCard from '@theme/components/LinkCard.vue';
export default {
  name: 'Links',
  computed: {
    friendLinks() {
      return this.$themeConfig.friendLinks;
    },
  },
  components: {
    LinkCard,
  },
};
</script>
