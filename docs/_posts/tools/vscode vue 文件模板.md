---
title: 'vscode vue 文件模板'
date: '2020-03-14 17:06:38'
tags:
  - 编辑器
vssue-id: 33
---

### vscode vue 文件模板

#### 1. 安装 VueHelper 插件

![在这里插入图片描述](https://chatflow-files-cdn-1256085166.file.myqcloud.com/2018101121500868.png)

#### 2. 寻找 `vue.json`

按顺序点击 vscode 的：

1. 文件
2. 首选项
3. 用户代码片段
4. 接着搜索框中输入 `vue`， 回车

#### 3. 填写模板内容

直接复制一下内容到 `vue.json`

```json
{
  "Print to console": {
    "prefix": "vue",
    "body": [
      "<template>",
      " <div>\n",
      " </div>",
      "</template>\n",
      "<script>",
      " export default {",
      "   name: '',",
      "   data () {",
      "     return {\n",
      "     }",
      "   },",
      "   components: {\n",
      "   }",
      " }",
      "</script>\n",
      "<style scoped>\n",
      " ",
      "</style>",
      "$2"
    ],
    "description": "Log output to console"
  }
}
```

#### 4. 重启 vscode

#### 5. 测试

1. 新建一个 `vue` 文件
2. 输入 `vue` 之后，点击 `Tab` 键
3. Happy Coding!
