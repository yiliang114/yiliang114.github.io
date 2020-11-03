---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

# vue style

## 必要的

- 组件名为多个单词。例如：`TodoItem`。

* 组件的 data 的值必须是返回一个对象的函数。

* Prop 定义应该尽量详细。

  ```
  props: {
    status: {
      type: String,
      required: true,
      validator: function (value) {
        return [
          'syncing',
          'synced',
          'version-conflict',
          'error'
        ].indexOf(value) !== -1
      }
    }
  }
  ```

* 使用`v-for`的时候设置`key`。

* 组件样式设置作用域。使用`scoped`特性。

* 开发插件等扩展时，自定义的私有属性使用`$`或`_`前缀，避免与其他开发者的命名冲突。

## 强烈推荐

- 将组件拆分成单独的组件文件。

- 单文件组件的文件名应该要么始终是单词大写开头 (PascalCase)，要么始终是横线连接 (kebab-case)。单词大写开头对于代码编辑器的自动补全最为友好。

- 应用特定央视和约定的基础组件（也就是展示类，无逻辑或无状态的组件），应该全部以一个特定的前缀开头，比如 Base，App 或 V。

- 只拥有单个活跃实例的组件应该以 The 前缀命名。以示唯一性。这些组件永远不接受任何 prop。如果发现有必要添加 prop，那就表明这实际上是一个可复用的组件。

  ```
  components/
  |- TheHeading.vue
  |- TheSidebar.vue
  ```

- 和父组件紧密结合的子组件应该以父组件作为前缀名

  ```
  components/
  |- TodoList.vue
  |- TodoListItem.vue
  |- TodoListItemButton.vue
  ```

- 组件名中的单词顺序应该以高级别的 (通常是一般化描述的) 单词开头，以描述性的修饰词结尾。把所有的搜索组件放到“search”目录，把所有的设置组件放到“settings”目录。我们只推荐在非常大型 (如有 100+ 个组件) 的应用下才考虑这么做。

  ```
  // 能够比较容易得看出哪些组件是针对搜索的。
  components/
  |- SearchButtonClear.vue
  |- SearchButtonRun.vue
  |- SearchInputExcludeGlob.vue
  |- SearchInputQuery.vue
  |- SettingsCheckboxLaunchOnStartup.vue
  |- SettingsCheckboxTerms.vue
  ```

- 自闭和组件：在单文件组件（vue 文件）、字符串模板和 JSX 中没有内容的组件应该是自闭合的——但在 DOM 模板里永远不要这样做。
