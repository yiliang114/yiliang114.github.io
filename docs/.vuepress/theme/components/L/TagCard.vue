<template>
  <div class="tags-card">
    <IconInfo v-for="tag in tags" :key="tag.id" :href="tag.path" :color="getOneColor()">{{tag.name}}</IconInfo>
  </div>
</template>

<script>
import IconInfo from '@theme/components/L/IconInfo.vue'

export default {
  components: { IconInfo },
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
  },
  methods: {
    tagClick(tag) {
      this.$emit('getCurrentTag', tag)
    },
    getOneColor() {
      return '#' + Math.floor(Math.random() * 0xffffff).toString(16)
    }
  }
}
</script>

<style lang="stylus" scoped>
@require '~@theme/styles/mode';

.tags {
  margin: 30px 0;

  span {
    vertical-align: middle;
    margin: 4px 4px 10px;
    padding: 4px 8px;
    display: inline-block;
    cursor: pointer;
    border-radius: $borderRadius;
    background: #fff;
    color: #fff;
    line-height: 13px;
    font-size: 13px;
    box-shadow: var(--box-shadow);
    transition: all 0.5s;

    &:hover {
      transform: scale(1.04);
    }

    &.active {
      transform: scale(1.2);
    }
  }
}
</style>
