---
title: ci workflow
date: 2020-04-06
---

### ci workflow

when the developer push his code to the origin branch, github ci will clone the repository into a default workspace on its environment (maybe divided by docker).

According to the time of the doc file had created, we can get a permanent link, and no matter what happens in development.

We should not to change the permanent link before markdown files manually, because if it had been changed and the changes would be pushed to the origin repository, then the website would be deployed automatically, and the old permanent link (such like someone has saved the link for our blog) would be not found(404).

So. first of all we need a solution to generator an unique value deeded as permanent link.

### 工作流程

1. 生成一个唯一的值作为永久链接
2. 触发 ci 之后，ci 来生成每个文件的永久链接，如果当前文件还没有永久链接的话，就主动插入到 markdown 文件中去（获取维护一个 json 文件来管理整个网页的链接）。
3. 将生成链接之后的改动自动提交到 repo 中。
