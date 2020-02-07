### element table 组件内容换行方案

#### 背景

临时接手了一个 element UI 的前端项目，吐槽一下后台接口，这个 idCardNo 字段。
![这里写图片描述](https://chatflow-files-cdn-1256085166.file.myqcloud.com/aHR0cDovL2ltZy5ibG9nLmNzZG4ubmV0LzIwMTgwMzA3MjA0MDA3ODE2.png)

项目直接使用了`el-table`组件：

```html
<el-table :data="warnings" :row-class-name="highlightRow" v-loading="isLoading">
  <el-table-column label="ID" prop="id" />
  <el-table-column label="时间" prop="time" />
  <el-table-column label="身份证号" prop="idCardNo" width="300" />
  <el-table-column label="车牌号" prop="busno" />
  <el-table-column label="车站" prop="busstop" />
  <el-table-column label="相似度" prop="sim" />
  <el-table-column label="详情">
    <template slot-scope="scope">
      <el-button @click="detail(scope.row)" type="primary" size="mini" plain
        >查看</el-button
      >
    </template>
  </el-table-column>
  <el-table-column label="确认时间" prop="acktime" :formatter="timeFormatter" />
</el-table>
```

由于这个`el-table`组件中的数据源是直接给了一个对象，所以其实`table`中的每一个`cell`用户都不需要管。前端截图的接口，没有经过操作之后直接显示的效果是：

![这里写图片描述](https://chatflow-files-cdn-1256085166.file.myqcloud.com/aHR0cDovL2ltZy5ibG9nLmNzZG4ubmV0LzIwMTgwMzA3MjA0NTU2NjA.png)

很难看对吧。所以想要把`cell`里的内容也进行换行，至少得看的清楚吧？

#### 解决方案

1. 直接将`warnings`数据源中的每一个元素的对象中的字段用`split`分割，再用`join`拼接`\n`换行符之后，希望它能够起作用。但是实际`F12 DOM树`中的文字看到是进行了换行，但是`el-table`的`cell`纹丝不动。
2. 使`<pre>`的内容自动换行。`<pre>` 元素可定义预格式化的文本。被包围在 pre 元素中的文本通常会保留空格和换行符。而文本也会呈现为等宽字体。
3. 先尝试使用：word-wrap: break-word;将内容自动换行，IE，OP，Chrome，Safari 都可以，FF 就悲剧了。
4. 查看了 pre 的浏览器默认样式中真正起作用的是`white-space: pre`这一条。

看看 white-space 的值：

- normal 默认。空白会被浏览器忽略。
- pre 空白会被浏览器保留。其行为方式类似 HTML 中的`<pre>` 标签。
- nowrap 文本不会换行，文本会在在同一行上继续，直到遇到 `<br>`标签为止。
- pre-wrap 保留空白符序列，但是正常地进行换行。
- pre-line 合并空白符序列，但是保留换行符。
- inherit 规定应该从父元素继承 white-space 属性的值。

按照我的需求，我希望它保留换行符。于是添加了样式：

```css
.el-table .cell {
  white-space: pre-line;
}
```

![这里写图片描述](https://chatflow-files-cdn-1256085166.file.myqcloud.com/aHR0cDovL2ltZy5ibG9nLmNzZG4ubmV0LzIwMTgwMzA3MjA1NDQ1NjU.png)
