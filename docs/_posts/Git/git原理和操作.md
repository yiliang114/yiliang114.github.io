---
title: 'git原理和操作'
date: '2020-01-22'
tags:
  - github
---

# git 原理和操作

## 原理相关

### 集中式与分布式

Git 属于分布式版本控制系统，而 SVN 属于集中式。

集中式版本控制只有中心服务器拥有一份代码，而分布式版本控制每个人的电脑上就有一份完整的代码。

集中式版本控制有安全性问题，当中心服务器挂了所有人都没办法工作了。

集中式版本控制需要连网才能工作，如果网速过慢，那么提交一个文件的会慢的无法让人忍受。而分布式版本控制不需要连网就能工作。

分布式版本控制新建分支、合并分支操作速度非常快，而集中式版本控制新建一个分支相当于复制一份完整代码。

### Git 的中心服务器

Git 的中心服务器用来交换每个用户的修改。没有中心服务器也能工作，但是中心服务器能够 24 小时保持开机状态，这样就能更方便的交换修改。Github 就是一种 Git 中心服务器。

### Git 工作流

新建一个仓库之后，当前目录就成为了工作区，工作区下有一个隐藏目录 .git，它属于 Git 的版本库。

Git 版本库有一个称为 stage 的暂存区，还有自动创建的 master 分支以及指向分支的 HEAD 指针。

- git add files 把文件的修改添加到暂存区
- git commit 把暂存区的修改提交到当前分支，提交之后暂存区就被清空了
- git reset -- files 使用当前分支上的修改覆盖暂缓区，用来撤销最后一次 git add files
- git checkout -- files 使用暂存区的修改覆盖工作目录，用来撤销本地修改

可以跳过暂存区域直接从分支中取出修改或者直接提交修改到分支中

- git commit -a 直接把所有文件的修改添加到暂缓区然后执行提交
- git checkout HEAD -- files 取出最后一次修改，可以用来进行回滚操作

### 分支实现

Git 把每次提交都连成一条时间线。分支使用指针来实现，例如 master 分支指针指向时间线的最后一个节点，也就是最后一次提交。HEAD 指针指向的是当前分支。

新建分支是新建一个指针指向时间线的最后一个节点，并让 HEAD 指针指向新分支表示新分支成为当前分支。

每次提交只会让当前分支向前移动，而其它分支不会移动。

合并分支也只需要改变指针即可。

### 冲突

当两个分支都对同一个文件的同一行进行了修改，在分支合并时就会产生冲突。

Git 会使用 <<<<<<< ，======= ，>>>>>>> 标记出不同分支的内容，只需要把不同分支中冲突部分修改成一样就能解决冲突。

```
Creating a new branch is quick AND simple.
```

### Fast forward

"快进式合并"（fast-farward merge），会直接将 master 分支指向合并的分支，这种模式下进行分支合并会丢失分支信息，也就不能在分支历史上看出分支信息。

可以在合并时加上 --no-ff 参数来禁用 Fast forward 模式，并且加上 -m 参数让合并时产生一个新的 commit。

```
$ git merge --no-ff -m "merge with no-ff" dev
```

### 分支管理策略

master 分支应该是非常稳定的，只用来发布新版本；

日常开发在开发分支 dev 上进行。

### 储藏（Stashing）

在一个分支上操作之后，如果还没有将修改提交到分支上，此时进行切换分支，那么另一个分支上也能看到新的修改。这是因为所有分支都共用一个工作区的缘故。

可以使用 git stash 将当前分支的修改储藏起来，此时当前工作区的所有修改都会被存到栈上，也就是说当前工作区是干净的，没有任何未提交的修改。此时就可以安全的切换到其它分支上了。

```
$ git stash
Saved working directory and index state \ "WIP on master: 049d078 added the index file"
HEAD is now at 049d078 added the index file (To restore them type "git stash apply")
```

该功能可以用于 bug 分支的实现。如果当前正在 dev 分支上进行开发，但是此时 master 上有个 bug 需要修复，但是 dev 分支上的开发还未完成，不想立即提交。在新建 bug 分支并切换到 bug 分支之前就需要使用 git stash 将 dev 分支的未提交修改储藏起来。

### SSH 传输设置

Git 仓库和 Github 中心仓库之间是通过 SSH 加密。

如果工作区下没有 .ssh 目录，或者该目录下没有 id_rsa 和 id_rsa.pub 这两个文件，可以通过以下命令来创建 SSH Key：

```
$ ssh-keygen -t rsa -C "youremail@example.com"
```

然后把公钥 id_rsa.pub 的内容复制到 Github "Account settings" 的 SSH Keys 中。

### .gitignore 文件

忽略以下文件：

1. 操作系统自动生成的文件，比如缩略图；
2. 编译生成的中间文件，比如 Java 编译产生的 .class 文件；
3. 自己的敏感信息，比如存放口令的配置文件。

不需要全部自己编写，可以到 [https://github.com/github/gitignore](https://github.com/github/gitignore) 中进行查询。

## Git 操作相关

### 基本配置

```sh
git config --global user.name
git config --global user.email
```

### 创建版本库 mkdir -> pwd -> git init

添加，查看状态，比较 git add -> git status -> git diff

提交 git commit -m 'description'

显示历史记录 git log 带参 git log --pretty=oneline

### 版本回退

git reset --hard HEAD~n
版本回退（指定的版本号） git reflog -> git reset --hard 版本号

### 工作区和暂存区

git add 把文件添加到暂存区
git commit 把暂存区的所有内容提交到当前分支上

### Git 撤销修改和删除文件操作

1.撤销修改

方法：
第一：如果我知道要删掉那些内容的话，直接手动更改去掉那些需要的文件，然后 add 添加到暂存区，最后 commit 掉。
第二：我可以按以前的方法直接恢复到上一个版本。使用 git reset –hard HEAD^

更好的方法：
git checkout -- readme.txt 丢弃工作区的修改（撤销）
命令 git checkout -– readme.txt

意思就是，把 readme.txt 文件在工作区做的修改全部撤销，这里有 2 种情况，如下：

1.readme.txt 自动修改后，还没有放到暂存区，使用撤销修改就回到和版本库一模一样的状态。 2.另外一种是 readme.txt 已经放入暂存区了，接着又作了修改，撤销修改就回到添加暂存区后的状态。

2.删除文件

rm b.txt 接下来：直接 commit 或者 git checkout -- filename 撤销

### 远程仓库

创建 SSHKey ssh-keygen -t rsa –C "1144323068@qq.com"

1.创建远程库

```sh
git remote add origin https://github.com/lemongjing/testgit.git
```

把本地 master 分支的最新修改推送到

```sh
github上 git push -u origin master
```

2.远程库存在
git clone

### 创建与合并分支

每次提交，Git 都把它们串成一条时间线，这条时间线就是一个分支。在 Git 里，这个分支叫主分支，即 master 分支。HEAD 严格来说不是指向提交，而是指向 master，master 才是指向提交的，所以，HEAD 指向的就是当前分支。

创建

**git branch dev + git checkout dev = git checkout -b dev 创建并切换到 dev**

合并

在 master 分支下执行 git merge dev 然后删除 dev

```sh
git branch -d dev
```

总结

```sh
查看分支：git branch

创建分支：git branch name

切换分支：git checkout name

创建+切换分支：git checkout –b name

合并某分支到当前分支：git merge name

删除分支：git branch –d name
```

1.如何解决冲突

Git 用

```sh
<<<<<<<,=======,>>>>>>>
```

标记出不同分支的内容，其中<<<HEAD 是指主分支修改的内容，>>>>>fenzhi 是指 fenzhi 上修改的内容，我们可以修改下保存。

2.分支管理策略

通常合并分支时，git 一般使用”Fast forward”模式，在这种模式下，删除分支后，会丢掉分支信息，现在我们来使用带参数 –no-ff 来禁用”Fast forward”模式。首先我们来做 demo 演示下：

```sh
创建一个dev分支。
修改readme.txt内容。
添加到暂存区。
切换回主分支(master)。
合并dev分支，使用命令 git merge –no-ff  -m “注释” dev
查看历史记录
```

禁用 fast-forward 模式

```sh
git merge –-no-ff -m "注释" dev
```

查看分支日志

```sh
git log --graph --pretty=oneline --abbrev-commit
```

### 工作现场

暂存工作现场 git stash

列出工作现场：git stash list

工作现场还在，Git 把 stash 内容存在某个地方了，但是需要恢复一下，可以使用如下 2 个方法：

1.git stash apply 恢复，恢复后，stash 内容并不删除，你需要使用命令 git stash drop 来删除。

2.另一种方式是使用 git stash pop,恢复的同时把 stash 内容也删除了。

### 多人协作

创建本地分支与远程分支的链接

`git branch --set-upstream-to=origin/<branch> dev`

例：

```sh
git branch --set-upstream dev origin/dev
```

提交
git push origin dev
拉取
git pull

### 本地远程分支相关

查看远程分支 git branch -a

删除本地分支：git branch -d name

例，删除了本地 dev

```sh
* master
  remotes/origin/dev
  remotes/origin/master
```

删除远程分支（两种方法）

git push --delete origin dev

git push origin :dev(冒号前面一个空格)

### 回退和重置

```
git reset f31658a5
git push -f
```

是直接返回到某一个时间点， 后面的提交都会直接没有了。

```
git revert -n f31658a5
```

是会重新生成一个你需要重置提交点的新提交， 指定 revert 提交点后面的所有提交都还在，这样会保证后面的内容还在。

### 变基

中文名好难听，其实就是 git rebase

### 远程不同于本地

可以通过如下命令进行代码合并【注：pull=fetch+merge]
git pull --rebase origin master

### remote

添加一个新的 remote

```
git remote add myOrigin https://github.com/yiliang114/ant-design-vue.git
```

remote 重命名

```
git remote rename myOrigin origin
```

设置本地默认 git push 的 remote:
需要修改 `.git/config`

```
[branch "master"]
  remote = origin
  merge = refs/heads/master
```

### Commit Close Issuses

可以通过 close #+issues 序号来关闭 issues，很简单，但它也是有一定条件的。
起初我以为只用调用这个命令就可以了，无论是在评论、commit 还是 merge 中，今天发现原来不是，在 merge 中使用，当 merge 通过后 issues 会被关闭；在 commit 中使用，只有在 commit 推送到默认分支时才会生效；在评论中使用是没用的。

拉取远程（其他分支）到本地自己的分支

```
git pull origin feature-1.1
```

合并几个 commit。~number number 代码从当前的 commit 开始往前推几个 commit

```
git rebase -i HEAD~6
```

如果 rebase 的是本地的 commit 的话，接下来就直接 git push 就行了。 如果 rebase 的包含远程的 commit ，那就 git push -f。
但是需要注意的是，git push -f 是强制推送，除非推送的是自己的分支（并且保证没有其他改动，可以才直接推送）才可以这样，不然会将别人的代码覆盖掉。

回退到某一个 commit

```
git reset commitID
```

暂存

```
git stash
```

弹出暂存

```
git stash pop
```

### 使用 git pull --rebase 代替 git pull

为什么要使用 git pull --rebase？
https://www.jianshu.com/p/dc367c8dca8e

会多出很多 commit 需要 git push --force-with-lease 才能继续往上推

### --force-with-lease

https://www.cnblogs.com/rxbook/p/9341606.html

```
git pull --rebase AntDesign develop
git push AntDesign 20200102/table-fix --force-with-lease
```
