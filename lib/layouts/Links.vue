<template>
  <div class="main-div">
    <div class="cardListContainer">
      <div class="card-list">
        <LinkCard
          v-for="(link, index) in friendLinks"
          :key="link.title + index || index"
          :info="link"
        />
      </div>
    </div>
    <br />
    <Vssue title="友情链接" />
  </div>
</template>

<script>
import LinkCard from '@theme/components/LinkCard.vue'
export default {
  name: 'Links',
  computed: {
    friendLinks() {
      return this.$themeConfig.friendLinks
    }
  },
  components: {
    LinkCard
  }
}
</script>
