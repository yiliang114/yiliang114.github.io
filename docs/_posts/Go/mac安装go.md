---
title: 'mac安装go'
date: '2020-03-14 17:06:38'
tags:
  - go
# vssue-id: 22
---

### mac 安装 go

#### 1. 安装 go

```bash
brew install go
```

#### 2. 配置 Go 环境变量 GOPATH 和 GOBIN

```bash
cd ~
ls -all //查看是否存在.bash_profile文件
touch .bash_profile // 如果没有的话，就创建

vi .bash_profile // 将下面三行内容黏贴到 .bash_profile 末尾， 主要 GOPATH 不要直接复制，不要写我的名字

export GOPATH=/Users/zhijianzhang/go
export GOBIN=$GOPATH/bin
export PATH=$PATH:$GOBIN
```

```bash
// 环境变量立即生效
source .bash_profile

// 查看 go 环境变量
go env

// 验证，打开一个新的命令行，观察输出是否正确
echo $GOPATH
```

#### 3. 目录

`$GOPATH` 目录下会有三个文件夹，可以自己创建。

- src：主要存放我们的源代码

- bin：存放编译后生成的可执行文件，可以自己执行

- pkg： 编译后生成的文件(.a 文件)（非 main 函数的文件在 go install 后生成）

#### 4. go get 加速

安装 gopm

```bash
// -v 会显示日志， -u 将 gopath 中的包下载完整，但是不会更新已经存在的包
go get -v -u github.com/gpmgo/gopm
```

使用 gopm

以后对于所有的`go get xxx` 都可以替换成 `gopm get xxx`

#### 5. idea 安装 go 插件

打开 idea 之后，点击左上角 `IntelliJ Idea` -> `Preferences` -> `Plugins`

![imagepng](https://chatflow-files-cdn-1256085166.file.myqcloud.com/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzEwLzk1ZDYxNTEzZDQxMTQ3YjQ5OWZhYmU5MDllMzcyNTg5X2ltYWdlLnBuZw.png)

![imagepng](https://chatflow-files-cdn-1256085166.file.myqcloud.com/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzEwLzEyNGQ1OGE5MDNkODQ3MjE4MjQzMTNiNWE4MTRlMzk3X2ltYWdlLnBuZw.png)

再设置一下打开 idea 的时候，默认不打开项目：

![imagepng](https://chatflow-files-cdn-1256085166.file.myqcloud.com/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzEwL2YwODhjYWY3OTI3ODRiNjI4ZDFlMDQxYmFiYzg2MjljX2ltYWdlLnBuZw.png)

等安装 go 插件成功之后 重启 idea

新建一个 go 项目，发现当前还没有配置 go 的 sdk：

![imagepng](https://chatflow-files-cdn-1256085166.file.myqcloud.com/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzEwLzQ3MTE5OWU1NDQzNjQ2MTY4ZmNmNzk0ZmVkZDM1YWUzX2ltYWdlLnBuZw.png)

配置 GOROOT 的地址：

![imagepng](https://chatflow-files-cdn-1256085166.file.myqcloud.com/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzEwL2I1OGFmNTljZGJmNDQ3Mjk5YzM1ZGIwY2JhMmQ5NDI3X2ltYWdlLnBuZw.png)

接着点击 Next 之后，自行配置 go 项目名称和存放地址。

然后就开启 go 语言之旅吧！
