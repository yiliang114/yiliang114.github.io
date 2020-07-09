<template>
  <div id="global-layout">
    <LHeader />

    <LMain />

    <LFooter />
  </div>
</template>

<script>
import LHeader from '@theme/components/L/LHeader.vue'
import LFooter from '@theme/components/L/LFooter.vue'
import LMain from '@theme/components/L/LMain.vue'
export default {
  components: {
    LHeader,
    LFooter,
    LMain
  }
}
</script>

<style lang="stylus" scoped>
@require '~@theme/styles/variables';

#global-layout {
  display: grid;
  grid-template-rows: 40vh 1fr auto;
  min-height: 100vh;
}
</style>
