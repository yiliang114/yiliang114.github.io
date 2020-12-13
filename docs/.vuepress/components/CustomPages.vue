<template>
  <div class="custom-pages">
    <div class="main-div" v-if="$page.poc">
      <h2>Table of Contents</h2>

      <TOC />
    </div>

    <div class="main-div">
      <Content class="content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomPages',
};
</script>
