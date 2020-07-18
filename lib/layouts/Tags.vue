<template>
  <div class="tags">
    <div class="main-div">
      <RouterLink v-for="tag in tags" :key="tag.name" :to="tag.path">
        <IconInfo :type="tag.name" :href="tag.path">{{tag.name}}</IconInfo>
      </RouterLink>
    </div>
  </div>
</template>

<script>
import IconInfo from '@theme/components/L/IconInfo'

export default {
  name: 'Tags',

  components: {
    IconInfo
  },
  computed: {
    tags() {
      const { _metaMap = {} } = this.$tags
      return [
        { name: '全部', path: '/tags/', id: -1 },
        ...Object.keys(_metaMap).map((key, index) => ({
          id: index,
          name: key,
          path: (_metaMap[key] && _metaMap[key].path) || ''
        }))
      ]
    }
  }
}
</script>
