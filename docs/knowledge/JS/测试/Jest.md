---
title: 'Jest'
date: 2021-01-24
tags:
  - jest
---

# Jest

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

## Watch Mode

```
jest --watch #runs jest -o by default
jest --watchAll #runs all tests
```

## Jest In Lerna

正如 lerna 所推崇的那样，中心化管理配置合依赖。 我们在 lerna 管理的 packages 中通常都不需要自行往某一个 package.json 中去添加 `script` 中添加一条 `"test": "jest"` 配置用于自行跑 Jest。 你只需要在 lerna 项目的根目录下面创建一个 `jest.config.js` 并在根目录的 package.json 中添加一条 script `"test": "jest"` 即可。 如果你在某一个包中添加了 jest 的执行命令，需要注意的是默认情况下 jest 会在“当前项目” 的根目录下寻找 `jest.config.js`, 如果不是人为添加的话，jest 是找不到配置文件的，也解析不了单元测试文件。比如，就会报如下的错误：

```
  ● Test suite failed to run

    Jest encountered an unexpected token

    This usually means that you are trying to import a file which Jest cannot parse, e.g. it's not plain JavaScript.

    By default, if Jest sees a Babel config, it will use that to transform your files, ignoring "node_modules".

    Here's what you can do:
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/en/configuration.html

    Details:

    /xxxxx/yyyyy/src/__tests__/vue.ts:1
    ({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,global,jest){import { hi } from '../vue/index';
                                                                                             ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (../../node_modules/jest-runtime/build/index.js:1258:14)
```

这就是因为 jest 找不到配置文件，解析不了 import 语法导致的。
