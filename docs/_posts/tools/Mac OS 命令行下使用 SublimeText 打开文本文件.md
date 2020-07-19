---
title: 'Mac OS 命令行下使用 SublimeText 打开文本文件'
date: '2020-03-14 17:06:38'
tags:
  - 编辑器
# vssue-id: 30
---

# Mac OS 命令行下使用 SublimeText 打开文本文件

#### Step1. 安装 Sublime Text 编辑器

可直接到以下网址下载 dmg 安装文件：
[Sublime Text 3](https://link.jianshu.com?t=https://www.sublimetext.com/3)

#### Step2. 添加命令行别名

打开用户配置文件

```bash
vim ~/.bash_profile
```

添加如下 alias

```bash
alias subl="'/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl'"
＃如果不添加别名，也可以选择将路径添加到环境变量下。
＃这里的路径根据实际情况可能会有所不同。
```

wq 保存后回到命令行执行以下命令使其生效：

```bash
source ~/.bash_profile
```

#### Step3. 命令行使用

这里我们假设在命令行用 SublimeText 打开.bash_profile，则执行如下：

```bash
subl ~/.bash_profile
```

好了，以后在命令行下查看或编辑文本文件，如果不想使用 vim 就可以直接使用"subl"命令将其在 SublimeText 编辑器打开了，貌似更加方便高效了～～
