<template>
  <div class="tags">
    <div class="main-div">
      <RouterLink v-for="tag in tags" :key="tag.name" :to="tag.path">
        <IconTag icon="tag" :name="tag.name" />
      </RouterLink>
    </div>
  </div>
</template>

<script>
import IconTag from '@theme/components/Icon'

export default {
  name: 'Tags',

  components: {
    IconTag
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
