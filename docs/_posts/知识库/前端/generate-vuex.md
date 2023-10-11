---
title: "generate-vuex"
date: "2020-09-02"
categories:
  - vue
---

## generate-vuex

在 vuex 的任意一个子 module 中使用, 将自动生成 mutations 和 getters, 不用再重复写它了~

```js
import { setFuncName, generateGetters, generateMutations } from "generate-vuex";

const state = {
  msg: "haha",
};
const mutations = {
  ...generateMutations(state),
};
const actions = {
  asyncChangeMsg({ commit }) {
    setTimeout(() => {
      commit(setFuncName("msg"), "async heihei");
    }, 1000);
  },
};
const getters = {
  ...generateGetters(state),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
```
