---
title: '多个 origin 区分用户名'
date: '2020-10-22'
tags:
  - github
---

### 多个 origin 区分用户名

前提条件：**git 客户端版本大于 2.13**

首先，假设你在 E:\codes 下存放所有的 git repo。现在建立两个特殊的目录：

```
E:\codes\github --> 专门存放托管于 github 的项目
E:\codes\gitlab --> 专门存放托管于 gitlab 的项目
```

打开 git 的全局配置文件（一般是在 C:\Users**{用户名}**.gitconfig），配置如下：

```
[user]
    name = xxxxx
    email = xxxxx@qq.com

[includeIf "gitdir:codes/github/"]
    path = ./.github

[includeIf "gitdir:codes/gitlab/"]
    path = ./.gitlab
```

在全局`.gitconfig`文件夹相同的位置，创建 `.github` 和 `.gitlab` 文件，内容如下：

```
# .github
[user]
    email = xxxxx@gmail.com
# .gitlab
[user]
    email = xxxxx@qq.com
```

这样配置以后，如果你是在 `E:\codes\gitlab` 下的某个项目时，你的 email 是 `xxxxx@qq.com`，如果你是在 `E:\codes\github` 下的某个项目时，你的 email 是 `xxxxx@gmail.com`，其它情况下，是 `xxxxx@qq.com`.

或者换个思路，全局配置 email 为 `xxxxx@gmail.com`，然后特定目录下的指定为 `xxxxx@qq.com`.

有关于 "Conditional Includes" 的更多介绍，请查阅官方文档：https://git-scm.com/docs/git-config#_conditional_includes
