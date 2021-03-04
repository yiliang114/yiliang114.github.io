---
title: safety
date: 2020-11-21
draft: true
---

首屏加载速度
监控
ci 流程， git 流程。
ui 组件库
日志链路

- 错误上报
- 主动上报
- cgi 耗时监控等

前端接入层

骨架屏
markdown 是如何进行解析并最终渲染成为 html 的？
为什么 webpack 的 externals 处理并引入 cdn 之后就可以直接运行了 ？

https://vuejsprojects.com/

webpack 热更新
类似 aegis 的实时上报打点的的监控
ts 写的前端监控 + node 监控 + 小程序监控
对于上报数据的清洗和分析， 输出可视化的内容，监控告警的推送（RTX 企业微信 邮件等等。）

node 网关层的逻辑梳理。
axios 的业务封装
ts 写的类似 proto 文件，前端与 node 层共享的方案

lerna 的多依赖项目的使用

webpack 的其他用处， 比如构建小程序的转义 ？
cli 工程化

前端的版本上报， hash 值最好携带进入全局变量中，通过打点上报上来。

semantic-release 集成
https://zqblog.beaf.tech/semantic-release/ 主题的开关

自动化 release 流程 https://blog.amowu.com/2017/01/how-to-automate-js-release.html

### nodelover

https://cdn.nodelover.me/video_bucket/vuex-source/3.mp4

### 开源

- cloudbase-framework
- severless
- zeti
- ant v
- echarts
- qiankun
- vue3
- vue-next
- vuex-next
- vue-cli
- 数据埋点
- 跨端能力
- **单元测试**
- Node + TS

### TODO

nest + oci 测试

- nest
- fit ？ egg

* Taro

### markdown 编译

- vuepress 源码解读

### 组件库

#### vue 的组件库

T1

#### 可视化

copy f2 移动端

### domi

omi + ts + markdown => site

#### 原理

- 指定目录， webpack-dev-server 执行将 markdown 文件处理成 webpack 能处理的模块
- 将 markdown 处理成 omi 组件，omi 的预渲染处理
- 编译成 spa 或者 预渲染
- 脚手架
  - @domi/cli

### github pages

还能用腾讯云 cdn 加速~~~

获取其他的 cdn 厂商也行的哦 ~

https://tang.su/2019/09/use-cdn-to-speed-up-github-pages/
https://www.upyun.com/league

### yiliang.site

#### 全站 cdn 与 cdn 的区别 ？

现在博客的域名 yiliang.site 加了全站 cdn， 但是其他的 demo 项目都是会走入 yiliang.site 这个自定义域名中去，比如 https://yiliang.site/resume 但是因为 vuepress 设置了 404 所以这里会强行直接跳转到 vuepress 的 404 页面。

https 的话还需要加上 https 证书，腾讯云托管。

### serverless

与 tcb, scf 之类的区别。
会结合 scf cos yun api ？等

### vuepress

https://pandapro.demo.nicetheme.xyz/
https://blog.zhangruipeng.me/hexo-theme-icarus/

#### resume theme

https://huaban.com/pins/2489793315/

### 开源

| personal   | opensource |
| ---------- | ---------- |
| omipress   | vuepress   |
| omi-router | vue-router |

### guide

intro.js 和 driver.js 两个插件

### tree sharking

https://www.codenong.com/j5f0ea1785188252e4c4cfdc1/

### low code

https://github.com/baidu/amis

### webpack 打包速度

生产模式：

- 关闭 sourcemap (选择)
- webpack 配置给 `optimization: { minimize: true }`
- 添加 externals 分离出一些大的包，比如 vue

开发模式：

- 按需打包
- babel-loader ts(x) 处理之后上层加一层 cache-loader 用来缓存
- dll
- happack
- 开发环境去除所有跟 minimize, chunk 之类的配置

### github 前端开发的步骤

1. git 分支开发
   1. feature 开发分支。提交，自动 test， 自动提交 pr 到 dev 分支。
   2. dev 发布分支。 合并，test， 自动部署。 自动跑 changelog。
   3. master 归档分支。 合并，自动 tag 和 release

### github 在线的 vue react 编辑器 IDEA

### eslint

https://tsingwong.github.io/learn-eslint-plugin-vue/

### 重构 vue 的项目

1. 目录结构规范
   1. 统一 @ 路径
   2. 统一 eslint 与 prettier
2. 接入 ci/cd
3. 某些依赖升级，比如 vue webpack 等
4. 单元测试

#### 代码层面

1. 统一使用 export const， 配合 @ 进行 import
2. var 修改为 let const
3. 多使用 js 的结构， vuex 的 mapGetters mapMutations 等
4. webpack router component 的 code split 懒加载

#### 代码复用层面

1. vue script 使用 mixins/extends/tools 等方法抽离
2. template 部分使用插槽，封装公共组件

#### 性能优化

performance
抽离功能函数，放到 node 层

### vue 测试指南

https://lmiller1990.github.io/vue-testing-handbook/zh-CN/#%E8%BF%99%E6%9C%AC%E6%8C%87%E5%8D%97%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F

### ast 函数执行添加时间

自动注入到 vue 中，插件
https://github.com/yeyan1996/async-catch-loader

### doc

https://dotnet9.com/

### vue3

倒数日

https://blog.csdn.net/sinat_17775997/article/list/2?t=1
https://blog.csdn.net/qq_34986769/article/details/62046696

### js 的单元测试驱动

### 用 Projj 管理你的 Git 仓库

https://0xffff.one/d/405

### 数据可视化

antv

### node

实战

### 移动端

倒数日

### ui

https://www.sj33.cn/digital/uisj/201606/45572_2.html

拟物化 ui + vue 3

### babel + node + es6 语法

### babel + node + ts 语法

### node 如何自动加载目录

### projj

https://cnodejs.org/topic/589f33808c475cf5794dad57

### 7 个月

### ts 文档整理， 周末

### elemnt 的时间层级

https://github.com/ElemeFE/element/blob/f6df39e8c1ff390da0f0df8ea30b07baf5d457f0/src/mixins/emitter.js

### 翻译

https://vercel.com/guides/deploying-next-and-mysql-with-vercel

### vue-router 的实现原理

node 中的 router 是如何实现的

router:

- 两种模式
- 传参，并且如何获取参数
- vue 中的钩子函数和全局守卫函数
- 权限架构设计
- pv 埋点

### cli

https://juejin.im/post/6844903566369357838
https://codeburst.io/how-to-build-a-command-line-app-in-node-js-using-typescript-google-cloud-functions-and-firebase-4c13b1699a27
https://itnext.io/how-to-create-your-own-typescript-cli-with-node-js-1faf7095ef89

### node cli 拉取 leek

- add
- del
- list
- export
- import
- help

### yarn link

https://github.com/yarnpkg/yarn/issues/2195
https://www.joyk.com/dig/detail/1572760826111441

### webpack 去掉 console 和 debugger 的插件

uglifyjs-webpack-plugin
https://www.jianshu.com/p/d95fd59bbef8

terser-webpack-plugin

有啥不同

### router 的全局守卫

可以放一个全局鉴权。但是需要注意的是， App.vue 的 mounted 和 created 执行的额时机都要比守卫函数执行的早 ？ App.vue 里面的逻辑应该有一部分不能被阻塞

router.beforeEach 能否 async

### js 计算器

https://www.cnblogs.com/zhulmz/p/11623685.html

### github 推广

https://geekplux.com/2017/07/20/how-to-get-hundreds-stars-on-github/
https://www.phodal.com/blog/how-get-get-star-for-github/
https://github.com/crawlab-team/artipub
https://segmentfault.com/a/1190000020104838

### 在 npm 发布自己的包 文章 ！！！

https://segmentfault.com/a/1190000010224751

### lodash 的拆包方式

https://www.dazhuanlan.com/2019/10/17/5da87a0ec0617/

通过 webpack 插件看起来是最优秀的。

### 跨框架

- 如何在让组件库同事支持 vue2 和 vue3 ？
- 研究一下在 vue 中使用 react 组件和在 react 中使用 vue 组件

### 图片懒加载原理

数据懒加载原理

### TODO

1. 数据 mock 平台 https://github.com/thx/rap2-delos
2. 错误监控上报平台（收集上报、数据可视化、监控）如何考虑埋点，取多少数据？
3. 如何进行页面级跟踪，还原操作步骤，打点恢复浏览内容
4. UI 测试

### 移动端 1px 问题

https://juejin.cn/post/6844903877947424782

### 监控平台

Node 实现一个监控平台

https://zhuanlan.zhihu.com/p/79978987
https://mp.weixin.qq.com/s/pqFhhb5u6w7gmUutilH5xQ

https://segmentfault.com/a/1190000012463862
https://blog.csdn.net/haoaiqian/article/details/107007642
https://github.com/kisslove/web-monitoring/blob/master/backend_server/models/apiModel.js

### 个人的影响力

1. 公众号

### 1. https cdn 工具

zeit + qiniu sdk

先优先使用 http 即可。 七牛云。 markdown cdn 链接转化页面

https://github.com/OBKoro1/markdown-img-down-site-change/blob/master/src/index.js

### 5. 使用 stack 的账号外部部署一套可以直接存储图片的网站 done

### 8. yiliang 个人的 cdn done

### vuepress blog 所有博客内容主页同步到 readme 脚本

### 与 blog 项目的区别

所有的文章都会同步到 blog issue 中去。

### 博客 批量首位处理器？ （加头 加尾）

结尾： 新建了一个前端交流群，

### 所有的文档平台都添加 网站信息 yiliang.site

### 想办法利用 https://www.jsdelivr.com/

https://segmentfault.com/a/1190000020239193

### 数据可视化

腾讯的 vue 3.0 为基础的可视化解决方案， 并争取开源。

### babel 按需插件加载原理 ？

### material 组件库 按需加载处理的 ant d 出现的问题？

https://blog.csdn.net/qq_39990827/article/details/90700077

### 习惯和成就

Streaks
Productive

习惯： https://www.zhihu.com/question/28373052

用仓库自带的 Issues 和 Milestones 记录遇到的问题，保证

### vue-loader 编译插件 #{}

开发环境下编译，并显示；生产环境下直接忽略

### eslint

https://www.cnblogs.com/zhangycun/p/10762534.html

### vue 标签上的属性缩写 disabled 的情况，解析

dom 节点的剖析

### monaco-editor 中文文档

### 翻译文档

https://github.com/sufeiweb/google-translate-free

### 介绍

开源文档上写，不用了，我很屌 有点东西的。。。

### 为你的开源项目搜集更多的徽章

提供文档的模板，下载

徽章的来源，使用介绍等。

### 基础建设、通用需求

- eslint
- 热加载
  - Webpack-hot-middleware
  - webpack-dev-derver
- MOCK
  - proxy： https://jsonplaceholder.typicode.com/ https://segmentfault.com/a/1190000008635891
  - json-server

### 有赞开源项目实践

https://tech.youzan.com/youzan-opensource-best-practice/

### JS 能力

一个轻量级的 JavaScript 库，可用于快速创建流程图: https://github.com/alyssaxuu/flowy

### 多个平台发文章

https://github.com/crawlab-team/artipub

### 懒加载相关优化

- 懒加载图片
- 接口、数据懒加载
- 虚拟列表（横向、纵向）
- table + 虚拟列表

### vue single component cli

https://github.com/FEMessage/vue-sfc-cli

### 其他

1. 单元测试
2. ts 环境配置
3. babel 与 es6 之间的关系
4. sudo npm i 经常出现某些包权限不够的问题，只需要在 npm i 后面加上 --unsafe-perm=true --allow-root 这个参数即可，参照 https://www.cnblogs.com/yiyi17/p/12080823.html

### todo

1. 监控平台
2. 搭建系统
   1. https://github.com/MrXujiang/h5-Dooring
3. 前端组件库
4. 性能优化
5. Node
   1. BFF
   2. GateWay
   3. Log Server
   4. Server
   5. SSR
6. 脚手架
7. 规范，ci、cd

### table

https://www.zhihu.com/question/319837974
https://xuliangzhan_admin.gitee.io/vxe-table/#/table/scroll/cellValid

### renderChild

一个主 Vue 实例渲染所有组件的形式。

### 内存泄漏排查

https://juejin.cn/post/6844903761744265224

### 翻译

https://www.robertcooper.me/using-eslint-and-prettier-in-a-typescript-project

### 可视化搭建

问题：

1. 最大的问题之一， bff 层的对接，不是直连后台服务。解决方式： 手动填入数据，或者接口
2. 组件生态不够好，设计师设计稿很好看，前期组件沉淀还不够，不能够迅速搭建起移动端页面。
3. 传统的可视化搭建系统存在的最大问题是，基本上都是单个页面的，比如活动页，表单收集页等，因为路由切换、多页数据共享等逻辑会与传统可搭建系统的纯粹性产生冲突，当然也不排除一些业务本身的场景比较简单。从编译的角度上来做的 搭建系统就可以解决这个问题，所谓的搭建，其实就是在写 dom json 。

### 可选链

？

### submodule

https://blog.longwin.com.tw/2015/05/git-submodule-add-remove-2015/

### 监控

内嵌的 iframe 页面的时间定义

### vue ssr + 大型项目目录

ssr 是什么？
ssr 如何做；
改造你 vue 项目进行 ssr；

缓存架构；
vue 一些底层 API 的运用；
vue 插件的开发；

Axios 源码分析；
大型项目中的 API 层；
二次封装 Axios 实例；

### vscode 格式化代码

eslint
prettier
vetur

三者会互相影响。 默认情况下 prettier 的配置信息不够灵活而且条数不够，例如对于箭头函数要不要加括号的问题，eslint 是可以针对不同情况的，是否有 {} 等，但是 prettier 只能设置 never 或者 always； 关闭 vscode 的 prettier 插件之后，实际上只要项目中还存在 prettier 配置文件的话，vetur 格式化 js 语言的格式，默认也会是 prettier 规则，所以还需要将 vetur 中的规则修改为 none

### 自动生成 mock 的服务

物料：

- json demo
- js 对象
- class 类
- d.ts 文件
- pb 文件

通过词法分析，根据值或者类型来判断该 mock 的值的类型。通过数据资产平台，拉取数据，自动生成 mock 元素的结构。

namespace 与类、维度、指标的维护和共享。

### tenon.js 卯榫

可视化搭建

### vuex helper 参考

能够自动导入的

https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetifyjs.com/src/store/modules/index.js
