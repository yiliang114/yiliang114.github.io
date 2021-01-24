---
title: 'Jest 支持 ES6 语法'
date: 2021-01-24
tags:
  - babel
  - jest
---

## Jest 支持 ES6 语法

1. 先安装 `@babel/core` 和 `@babel/preset-env` 依赖

```
yarn add  @babel/core @babel/preset-env  --dev
```

2. 新建 `.babelrc` 文件

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ]
  ]
}

```
