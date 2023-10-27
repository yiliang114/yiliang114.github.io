---
layout: CustomPages
title: Git
date: 2020-11-21
draft: true
---

# git

## 功能

### pull request

pull request 是指开发者在本地对源代码进行更改后，向 github 中托管的 git 仓库请求合并的功能。

#### todo

- 对开源项目提交两次 pull request

### Issue

Issue 是将一个任务或问题分配给一个 Issue 进行追踪和管理的功能。每一个功能更改或修正都对应一个 Issue， 在 git 提交的信息中写上 Issue 的 ID （例如： “#7”），github 就会自动生成从 Issue 到对应提交的链接。 另外，只要按照特定的格式描述进行提交信息，还可以关闭 Issue。

#### todo

- 尝试按照特定的格式描述提交信息，自动关闭 Issue
- 尝试在提交信息中写上 Issue 的 ID，查看链接是怎么回事

### Wiki

wiki 可以多个人共同完成，也是作为 git 仓库进行管理的，改版记录会被切实保存下来。

#### todo

- 给自己的开源项目创建一个 wiki，尝试修改并提交

## git 起步

### 初始设置

设置姓名和邮箱地址：

```
git config --global user.name "Firstname Lastname"
git config --global user.email "email@example.com"
```

想修改这些信息时，可以直接编辑这个设置文件 `~/.gitconfig`, window 下在 `C:\Users\Mrz2J\.gitconfig`

### fork 开源项目之后

[http://www.cnblogs.com/eyunhua/p/8463200.html](http://www.cnblogs.com/eyunhua/p/8463200.html)

### Revert

```
git revert -n 8b89621019c9adc6fc4d242cd41daeb13aeb9861
```
