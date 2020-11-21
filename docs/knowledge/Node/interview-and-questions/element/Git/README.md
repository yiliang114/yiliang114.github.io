---
layout: CustomPages
title: Git
date: 2020-11-21
aside: false
draft: true
---

# Git

### Git 快照

> Every time you commit, or save the state of your project in Git, it basically takes a picture of what all your files look like at that moment and stores a reference to that snapshot.

Git 更像是把数据看作是对小型文件系统的一组快照。 每次你提交更新，或在 Git 中保存项目状态时，它主要对当时的全部文件制作一个快照并保存这个快照的索引。 为了高效，如果文件没有修改，Git 不再重新存储该文件，而是只保留一个链接指向之前存储的文件。 Git 对待数据更像是一个快照流。

> In computer systems, a snapshot is the state of a system at a particular point in time.

记录差异
![记录差异](../img/git-jlcy.png)

记录快照
![记录快照](../img/git-glkz.png)

### 三种状态

- 已提交 committed
- 已暂存 staged
- 已修改 modified

### 三个区域

- Git 仓库
  - 是 Git 用来保存项目的元数据和对象数据库的地方。 这是 Git 中最重要的部分，从其它计算机克隆仓库时，拷贝的就是这里的数据。
- 暂存区域
  - 暂存区域是一个文件，保存了下次将提交的文件列表信息，一般在 Git 仓库目录中。 有时候也被称作`‘索引’'，不过一般说法还是叫暂存区域。
- 工作目录
  - 工作目录是对项目的某个版本独立提取出来的内容。 这些从 Git 仓库的压缩数据库中提取出来的文件，放在磁盘上供你使用或修改。

![三个区域](../img/git-3-place.png)

### 基本的 Git 工作流程

1. 在工作目录修改文件
2. 暂存文件，将文件的快照放入暂存区
3. 提交更新，找到暂存去文件，将快照永久性存储到 Git 仓库目录。

### 用户信息

当安装完 Git 应该做的第一件事就是设置你的用户名称与邮件地址。 这样做很重要，因为每一个 Git 的提交都会使用这些信息，并且它会写入到你的每一次提交中，不可更改。

```
git config --global user.name "huyaocode"
git config --global user.email johndoe@example.com
```

### 加入暂存区

```
git add 文件名或路径
```

### 忽略文件

创建一个`.gitignore`文件，可描述需要忽略的文件。 参考

```py
# no .a files
*.a
# but do track lib.a, even though you're ignoring .a files above
!lib.a
# 只忽略当前文件夹下已 TODO 为名的文件
/TODO
# 忽略当前目录下 build 这个文件夹
build/
# ignore doc/notes.txt, but not doc/server/arch.txt
doc/*.txt
# ignore all .pdf files in the doc/ directory
doc/**/*.pdf
```

### 状态修改

`git status -s`将每个修改状态以一行展示，也可以用`git status`多行展示。

- `A` 新添加到暂存区中的文件
- `M` 修改过的文件
- `D` 被删除的文件
- `MM` 出现在右边的 M 表示该文件被修改了但是还没放入暂存区，出现在靠左边的 M 表示该文件被修改了并放入了暂存区。
- `??` 未跟踪

### 查看修改

- 要查看尚未暂存的文件更新了哪些部分，不加参数直接输入 `git diff`
- 要查看已暂存的将要添加到下次提交里的内容，可以用 `git diff --cached` 或 `git diff --staged`

### 提交修改

运行`git commit`，会出现如下情况。这种方式会启动文本编辑器，开头还有一空行，供你输入提交说明。下面的行是被注释了的，也可以取消这些注释。

一般是 vim 或 emacs。当然也可以按照 起步 介绍的方式，使用 `git config --global core.editor` 命令设定你喜欢的编辑软件。

![commit](../img/git-commit.png)

也可以使用`git commit -m "修改描述"` 这种直接输入描述的方式提交修改。

`git commit` 加上 `-a` 选项，Git 就会自动把所有已经跟踪过的文件暂存起来一并提交，从而跳过 git add 步骤

### 移除文件

要从 Git 中移除某个文件，就必须要从已跟踪文件清单中移除（确切地说，是从暂存区域移除），然后提交。
可以用 git rm 命令完成此项工作，并连带从工作目录中删除指定的文件，这样以后就不会出现在未跟踪文件清单中了。

运行 `git rm`记录此次移除文件的操作。下一次提交时，该文件就不再纳入版本管理了。 如果删除之前修改过并且已经放到暂存区域的话，则必须要用强制删除选项 `-f`（译注：即 force 的首字母）。 这是一种安全特性，用于防止误删还没有添加到快照的数据，
这样的数据不能被 Git 恢复。

想把文件从 Git 仓库中删除（亦即从暂存区域移除），但仍然希望保留在当前工作目录中。(不想让 Git 跟踪)

```
git rm --cached 某文件
```

### 文件更名

```
git mv file_from file_to
```

其实，运行 git mv 就相当于运行了下面三条命令：

```
mv README.md README
git rm README.md
git add README
```

### 查看提交历史

`git log`git log 会按提交时间列出所有的更新，最近的更新排在最上面。 正如你所看到的，这个命令会列出每个提交的 SHA-1 校验和、作者的名字和电子邮件地址、提交时间以及提交说明。

使用 `-p` 用来限制展示条数。`git log -p -2`

使用 `--stat` 选项看到每次提

使用`format`，定制要显示的记录格式。

使用`--graph`可形象地展示你的分支、合并历史。

```
$ git log --pretty=format:"%h %s" --graph
* 2d3acf9 ignore errors from SIGCHLD on trap
* 5e3ee11 Merge branch 'master' of git://github.com/dustin/grit
|\
| * 420eac9 Added a method for getting the current branch.
* | 30e367c timeout code and tests
* | 5a09431 add timeout protection to grit
* | e1193f8 support for heads with slashes in them
|/
* d6016bc require time for xmlschema
* 11d191e Merge branch 'defunkt' into local
```

### 重新提交

有时候我们提交完了才发现漏掉了几个文件没有添加，或者提交信息写错了。 此时，可以运行带有 `--amend` 选项的提交命令尝试重新提交。

```
git commit --amend
```

这个命令会将暂存区中的文件提交。 如果自上次提交以来你还未做任何修改（例如，在上次提交后马上执行了此命令），那么快照会保持不变，而你所修改的只是提交信息。

文本编辑器启动后，可以看到之前的提交信息。 编辑后保存会覆盖原来的提交信息。

例如，你提交后发现忘记了暂存某些需要的修改，可以像下面这样操作：

```
git commit -m 'initial commit'
git add forgotten_file
git commit --amend
```

最终你只会有一个提交 - 第二次提交将代替第一次提交的结果。

### 取消暂存的文件

使用 `git reset HEAD <file>` 来取消暂存。在调用时加上 --hard 选项可以令 git reset 成为一个危险的命令（译注：可能导致工作目录中所有当前进度丢失！）

### 撤消对文件的修改

使用`git checkout -- <file>` 可以撤销修改（未保存到暂存区）

### 远程仓库

- 添加远程仓库
  - `git remote add <shortname> <url>`
- 从远程仓库中抓取与拉取
  - `git fetch [remote-name]`
- 推送到远程仓库
  - `git push [remote-name] [branch-name]`
- 查看远程仓库
  - `git remote show [remote-name]`
- 远程仓库的重命名
  - `git remote rename`

### 打标签

Git 可以给历史中的某一个提交打上标签，以示重要。

Git 使用两种主要类型的标签：轻量标签（lightweight）与附注标签（annotated）。通常建议创建附注标签。

- 一个轻量标签很像一个不会改变的分支 - 它只是一个特定提交的引用。
- 附注标签是存储在 Git 数据库中的一个完整对象。 它们是可以被校验的；其中包含打标签者的名字、电子邮件地址、日期时间；还有一个标签信息；并且可以使用 GNU Privacy Guard （GPG）签名与验证。

列出标签`git tag`

附注标签

- 创建
  - `git tag -a v1.4 -m '描述'`
- 查看某版本
  - `git show 版本号`

轻量标签

- 轻量标签本质上是将提交校验和存储到一个文件中 - 没有保存任何其他信息，不些描述
- `git tag v1.4-lw`

共享标签

- 默认情况下，git push 命令并不会传送标签到远程仓库服务器上。创建完标签后你必须显式地推送标签到共享服务器上。 这个过程就像共享远程分支一样 - 你可以运行 `git push origin [tagname]`。
- 如果想要一次性推送很多标签，也可以使用带有 --tags 选项的 git push 命令。 这将会把所有不在远程仓库服务器上的标签全部传送到那里。

删除标签

- 删本地，并不会从任何远程仓库中移除这个标签
  - `git tag -d <tagname>`
- 删远程
  - `git push <remote> :refs/tags/<tagname>`

### Git 别名

可为一些操作器别名，例如： `git config --global alias.last 'log -1 HEAD'`后， 使用`git last` 就可以看到最后一次提交

### 命令

- git 代码提交模型
- git commit 提交规范
- git commit 插件
- git 操作技巧、git rebase 等

### Git 分支

在进行提交操作时，Git 会保存一个提交对象（commit object）。

假设现在有一个工作目录，里面包含了三个将要被暂存和提交的文件。 暂存操作会为每一个文件计算校验和（使用 SHA-1 哈希算法），然后会把当前版本的文件快照保存到 Git 仓库中（Git 使用 **blob 对象**来保存它们），最终将校验和加入到暂存区域等待提。

当使用 git commit 进行提交操作时，Git 会先计算每一个子目录（本例中只有项目根目录）的校验和，然后在 Git 仓库中这些校验和保存为**树对象**。 随后，Git 便会创建一个**提交对象**，它除了包含上面提到的那些信息外，还包含指向这个树对象（项目根目录）的指针。如此一来，Git 就可以在需要的时候重现此次保存的快照。

常用操作

- 创建分支
  - `git branch testing`
  - 创建分支后，有一个名为 HEAD 的特殊指针指向当前所在的分支。
- 分支切换
  - `git checkout testing` 让`HEAD`自己指针指向 testing
  - 如果在某分支修改了没有提交然后就切换分支，会有失败并有提示
- 查看当前所处分支和各分支名
  - `git branch`
- 查看分支交叉情况
  - `git log --oneline --decorate --graph --all`
- 删除分支
  - `git branch -d hotfix`
- 分支合并
  - 切换到想要合并到的分支，将目标分支合并进来
  - `git merge iss53`
- 查看每一个分支的最后一个提交
  - `git branch -v`
- 查看哪些分支 已经/没有 合并到当前分支
  - `git branch --merged`
  - `git branch --no-merged`

#### 合并冲突

分支创建后，主分支与分出去的分支都修改了同一个地方。

```
CONFLICT (content): Merge conflict in index.html
Automatic merge failed; fix conflicts and then commit the result.
```

此时 Git 做了合并，但是没有自动地创建一个新的合并提交。 Git 会暂停下来，等待你去解决合并产生的冲突。

使用`git status`可以看到文件处于未合并（unmerged）状态。

任何因包含合并冲突而有待解决的文件，都会以未合并状态标识出来。需要手动解决冲突。看起来像下面这个样子：

```
master branch diff
```

在你解决了所有文件里的冲突之后，对每个文件使用 `git add` 命令来将其标记为冲突已解决。 **一旦暂存这些原本有冲突的文件，Git 就会将它们标记为冲突已解决。**

再使用`merge`操作提交更新就好。

#### 远程分支

远程引用是对远程仓库的引用（指针），包括分支、标签等等。
远程跟踪分支是远程分支状态的引用。 它们是你不能移动的本地引用，当你做任何网络通信操作时，它们会自动移动。 远程跟踪分支像是你上次连接到远程仓库时，那些分支所处状态的书签。

它们以 (remote)/(branch) 形式命名。 例如，如果你想要看你最后一次与远程仓库 origin 通信时 master 分支的状态，你可以查看 origin/master 分支。 你与同事合作解决一个问题并且他们推送了一个 iss53 分支，你可能有自己的本地 iss53 分支；但是在服务器上的分支会指向 origin/iss53 的提交。

- 查看远程分支
  - `git remote`
- 同步远程到本地
  - `git fetch origin`
- 推送
  - `git push （remote） (branch)`
- `git pull`
  - 在大多数情况下它的含义是一个 git fetch 紧接着一个 git merge 命令。
  - 通常单独显式地使用 fetch 与 merge 命令会更好一些
- 删除远程分支
  - `git push origin --delete serverfix`

#### [变基](https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%8F%98%E5%9F%BA)

在 Git 中整合来自不同分支的修改主要有两种方法：`merge`以及 `rebase`。

整合分支最容易的方法是 merge 命令。 它会把两个分支的最新快照（C3 和 C4）以及二者最近的共同祖先（C2）进行三方合并，合并的结果是生成一个新的快照（并提交）。
![](../img/git-mergep.png)

你可以提取在 C4 中引入的补丁和修改，然后在 C3 的基础上应用一次。 在 Git 中，这种操作就叫做 变基。 你可以使用 rebase 命令将提交到某一分支上的所有修改都移至另一分支上，就好像“重新播放”一样。

```
git checkout experiment
git rebase master
```

![](../img/git-rebease.png)

最后回到 master 分支，进行一次快进合并
![](../img/git-mergep2.png)

它的原理是首先找到这两个分支（即当前分支 experiment、变基操作的目标基底分支 master）的最近共同祖先 C2，然后对比当前分支相对于该祖先的历次提交，提取相应的修改并存为临时文件，然后将当前分支指向目标基底 C3, 最后以此将之前另存为临时文件的修改依序应用。

`merge`和`rebase`这两种整合方法的最终结果没有任何区别，但是变基使得提交历史更加整洁。 你在查看一个经过变基的分支的历史记录时会发现，尽管实际的开发工作是并行的，但它们看上去就像是串行的一样，提交历史是一条直线没有分叉。

##### 变基的风险

**不要对在你的仓库外有副本的分支执行变基。**
如果你已经将提交推送至某个仓库，而其他人也已经从该仓库拉取提交并进行了后续工作，此时，如果你用 git rebase 命令重新整理了提交并再次推送，你的同伴因此将不得不再次将他们手头的工作与你的提交进行整合，如果接下来你还要拉取并整合他们修改过的提交，事情就会变得一团糟。

### Rebase 合并

该命令可以让和 `merge` 命令得到的结果基本是一致的。

通常使用 `merge` 操作将分支上的代码合并到 `master` 中，分支样子如下所示

![](https://yck-1254263422.cos.ap-shanghai.myqcloud.com/blog/2019-06-01-043128.png)

使用 `rebase` 后，会将 `develop` 上的 `commit` 按顺序移到 `master` 的第三个 `commit` 后面，分支样子如下所示

![](https://yck-1254263422.cos.ap-shanghai.myqcloud.com/blog/2019-06-01-043129.png)

Rebase 对比 merge，优势在于合并后的结果很清晰，只有一条线，劣势在于如果一旦出现冲突，解决冲突很麻烦，可能要解决多个冲突，但是 merge 出现冲突只需要解决一次。

使用 rebase 应该在需要被 rebase 的分支上操作，并且该分支是本地分支。如果 `develop` 分支需要 rebase 到 `master` 上去，那么应该如下操作

```shell
### branch develop
git rebase master
git checkout master
### 用于将 `master` 上的 HEAD 移动到最新的 commit
git merge develop
```

### stash

`stash` 用于临时保存工作目录的改动。开发中可能会遇到代码写一半需要切分支打包的问题，如果这时候你不想 `commit` 的话，就可以使用该命令。

```shell
git stash
```

使用该命令可以暂存你的工作目录，后面想恢复工作目录，只需要使用

```shell
git stash pop
```

这样你之前临时保存的代码又回来了

### reflog

`reflog` 可以看到 HEAD 的移动记录，假如之前误删了一个分支，可以通过 `git reflog` 看到移动 HEAD 的哈希值

![](https://yck-1254263422.cos.ap-shanghai.myqcloud.com/blog/2019-06-01-43130.png)

从图中可以看出，HEAD 的最后一次移动行为是 `merge` 后，接下来分支 `new` 就被删除了，那么我们可以通过以下命令找回 `new` 分支

```shell
git checkout 37d9aca
git checkout -b new
```

PS：`reflog` 记录是时效的，只会保存一段时间内的记录。

### Reset

如果你想删除刚写的 commit，就可以通过以下命令实现

```shell
git reset --hard HEAD^
```

但是 `reset` 的本质并不是删除了 commit，而是重新设置了 HEAD 和它指向的 branch。
