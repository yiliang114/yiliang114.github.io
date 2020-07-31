---
title: 'CSS文字多行显示超出显示省略号'
date: '2018-10-11'
tags:
  - css3
---

### css 文字多行显示超出显示省略号

首先，要知道 css 的三条属性。

`overflow:hidden;` //超出的文本隐藏

`text-overflow:ellipsis;`//溢出用省略号显示

`white-space:nowrap;`//溢出不换行

css3 解决了这个问题，解决方法如下：

`display:-webkit-box;` //将对象作为弹性伸缩盒子模型显示。

`-webkit-box-orient:vertical;` //从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）

`-webkit-line-clamp:2;`//这个属性不是 css 的规范属性，需要组合上面两个属性，表示显示的行数。

最后实现的代码：

(仅限于手动书写 css 的情况)

```css
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical; // 参考 https://github.com/postcss/autoprefixer/issues/776
```

(适用于 webpack 配合预编译工具的情况，会自动将`-webkit-box-orient` 清除)

打包时必须使用这种方法打包，否则打包后 -webkit-box-orient: vertical 便会消失.

```css
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 2;
/* autoprefixer: off */
-webkit-box-orient: vertical; // 参考 https://github.com/postcss/autoprefixer/issues/776
/* autoprefixer: on */
```

通常情况下，上面这种注释的方式就有效了，如果因为种种原因无效，尝试另外一种通过 `optimize-css-assets-webpack-plugin` 插件也能解决这个问题。前提是项目本身就适用了这个插件，不然为了“换行省略号”这个效果去多安装一个 webpack 插件就不划算了。

注释掉`webpack.prod.conf.js`中下面的代码

```js
new OptimizeCSSPlugin({
  cssProcessorOptions: config.build.productionSourceMap
    ? { safe: true, map: { inline: false } }
    : { safe: true }
}),
```

#### demo

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <style>
      .container {
        width: 100px;
        /* height: 20px; */
      }

      .container p {
        font-size: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <td>
        <p>
          你在组件中使用你在组件中使用你在组件中使用 this.$store.dispatch('xxx')
          分发 action，或者使用 mapActions 辅助函数将组件的 methods 映射为
          store.dispatch 调用（需要先在根节点注入 store）：
        </p>
      </td>
    </div>
  </body>
</html>
```

需要注意的一点是，如果换行处是一个完整的英文单词，换行不会将单词拆开，而是会直接将整个单词省略并显示省略号。
