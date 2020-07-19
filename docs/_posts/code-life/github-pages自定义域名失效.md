---
title: 'github-pages自定义域名失效'
date: '2020-03-14 17:06:38'
tags:
  - github
  - pages
  - 自定义域名
vssue-id: 6
---

### github pages 自定义域名失效

> vuepress 部署 blog 的时候自定义域名经常失效的原因

把 dist 目录下的文件全部提交到 gh-pages(或者 master) 分支上去作为 pages 的展示的内容，但是 CNAME 文件没有提交上去，也就是说，vuepress 项目作为 blog 的 CNAME 文件（自定义域名）需要放在 `.vuepress/public` 中，而不是实际当前的根目录下（如果你的目录跟我类似的话）

这里推测 github pages 的 setting 中的 custom domain 与项目的展示 pages 分支的根目录下的 CNAME 文件是起同样的作用的。
