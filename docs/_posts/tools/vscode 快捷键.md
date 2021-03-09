---
title: 'vscode 标签的展开收起'
date: 2019-10-25
tags:
  - vscode
---

## vscode 标签的展开收起

首选项-设置（可用图形化直接搜索，或用 JSON 格式显示）, 用户设置(User Settings)

```json
{
  "[javascript]": {
    "editor.foldingStrategy": "indentation"
  },
  "[javascriptreact]": {
    "editor.foldingStrategy": "indentation"
  },
  "[typescript]": {
    "editor.foldingStrategy": "indentation"
  },
  "[typescriptreact]": {
    "editor.foldingStrategy": "indentation"
  }
}
```

foldingStrategy：控制计算折叠范围的策略。auto 将使用语言特定的折叠策略 (若可用)。indentation 将使用基于缩进的折叠策略。

全局设置

```json
"editor.foldingStrategy": "indentation"
```

### bug

默认情况下， vscode 的 foldingStrategy 策略是 auto， 针对 vue, js 一类的的语言，折叠代码块之后会看不到末尾的 `}` 例如：
![image](https://user-images.githubusercontent.com/11473889/97098288-3bea4580-16b6-11eb-87e6-eb75fbbd083e.png)

如果全局设置 `"editor.foldingStrategy": "indentation"` 这一类的语言代码块折叠、收起正常了, 如下图
![image](https://user-images.githubusercontent.com/11473889/97098316-92f01a80-16b6-11eb-995a-c476db6bb4e8.png)

但是如果你经常在 vscode 中写 markdown 文件的话，你会发现这么配置之后，markdown 的标题无法收起、展开了，
![image](https://user-images.githubusercontent.com/11473889/97098340-cd59b780-16b6-11eb-912e-a673059467c6.png)

此时只需要为 markdown 语言设定一个自定义的 `auto` 属性即可。

![image](https://user-images.githubusercontent.com/11473889/97098360-07c35480-16b7-11eb-939e-d01a7f6263b7.png)
