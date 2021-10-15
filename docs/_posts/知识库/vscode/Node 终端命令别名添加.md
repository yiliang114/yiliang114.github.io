---
title: 'Node 终端命令别名添加'
date: '2020-08-12'
tags:
  - 编辑器
---

## Node 终端命令（ 例如 yarn ）别名添加

> 本文暂时只介绍在 MAC 环境下的配置，window 下我理解应该同理。

### 背景

在平时开发过程中，很多命令是重复的，或者有些命令携带参数之后真的很长，有时候真记不住，或者纯粹我就是不想手打。后来看到在 B 站上看到云谦大神的视频之后，发现他使用 yarn 都是用 `y` 单字符的。所以就简单探索了一下这其中的操作方式。

下面简单介绍一下在 Mac 中设置终端命令行别名 alias (git, npm) 的设置方式：

### 步骤

#### NPM

##### 1. 编辑 .bash_profile

这个文件一般都在当前用户的根目录下面，而且修改都是要权限的。如果你是第一次修改 `.bash_profile` 文件，可能需要 `touch` 创建一下。

```
// 已有
sudo vim ~/.bash_profile

// 新建
sudo touch ~/.bash_profile
```

##### 2. 配置别名

在文件的最后添加别名，举个 🌰

```
alias y="yarn"
alias gl="git pull"
alias gp="git push"
alias glo="git pull origin"
```

##### 3. 保存

```
source ~/.bash_profile
```

#### Git

如果仅仅是想修改 git 相关的别名的话，可以修改当前用户的 `.gitconfig` 文件。 跟上面一样，如果没有的话也需要手动 `touch` 创建一下。
不一样的地方是别名的配置：

```
[alias]
pl=pull
ps=push
```

配置完之后记得保存~。

### 总结

git 的别名设置有两种方式：`.bash_profile` 和 `.gitconfig`

- `.bash_profile` 是针对 shell bash 终端的别名设置。只要用 shell bash 进行命令行操作，都能认识 `.bash_profile` 别名。属于系统级别的别名设置。
- `.gitconfig` 是针对 git 的别名设置。只能对 git 后面的命令设置别名。针对所有的 git 命令有效。

示例图：
![image](https://user-images.githubusercontent.com/11473889/90015619-6e052180-dcdb-11ea-9cfd-3f601a9a0a07.png)
![image](https://user-images.githubusercontent.com/11473889/90015668-7cebd400-dcdb-11ea-8488-3df787ecfe6a.png)

### 未生效 ？

是不是有同学遇到了在当前的 shell 下面执行别名是有效的，但是另开一个 shell 就找不到命令了？ 莫慌，先看一下你是不是跟我一样使用了 `iTerm`。原因是 `iTerm` 加载的是 `~/.zshrc` 文件，而 `~/.zshrc` 文件中并没有定义任务环境变量。

你只需要将刚刚的 `alias` 块复制到 `~/.zshrc` ， `sudo vim ~/.zshrc` 粘贴就可以了。
