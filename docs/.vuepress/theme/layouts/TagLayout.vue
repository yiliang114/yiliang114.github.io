<!--
 * @Author: mrjzhang
 * @Date: 2020-02-20 10:24:05
 * @LastEditors: mrjzhang
 * @LastEditTime: 2020-02-20 10:24:06
 -->
<template>
  <LayoutContainer>
    <List :items="$tag ? $tag.pages : []" />
  </LayoutContainer>
</template>
