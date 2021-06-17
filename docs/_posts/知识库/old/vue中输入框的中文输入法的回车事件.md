---
title: 'vue中输入框的中文输入法的回车事件'
date: '2019-04-04'
tags:
  - vue
---

### vue input 中文输入法的回车事件

```html
<input
  type="text"
  class="tc-15-input-text"
  placeholder="请和Bot进行聊天"
  v-model="cilentText"
  @keydown.13="doInputText"
  @keydown.229="() => {}"
/>
```

中文输入法时所有的键盘按钮触发的 keydown 事件 keyCode 都会等于 229. 但是如果 input 已经注册了回车事件的话，中文输入到一半直接回车（期望输入英文）的时候就会直接触发回车事件，这里如果将回车事件直接通过 `@keydown.13 = handle` ， 再添加一个中文输入事件 `@keydown.229 = handle` 的话，中文输入法的回车就不会被捕获而触发回车事件了。

其实这个场景还蛮常见的，比如 github 的搜索，可以试一试，切换成中文输入法，输入内容之后不按空格键或数字键，而是直接按回车，搜索的内容将不是完整的英文，也不是中文。。。。
