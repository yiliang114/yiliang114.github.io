---
title: 'win安装go'
date: '2020-03-14 17:06:38'
tags:
  - go
---

### win go 开发环境

#### 1. 下载安装包

我的电脑是 win10 64 位，如果你的电脑也是 64 位的，可以下载 [go1.9.2](https://www.golangtc.com/static/go/1.9.2/go1.9.2.windows-amd64.msi) , 如果是 32 位的，[go 墙内下载地址](http://www.golangtc.com/download), 自己找一下对应的版本就行了。

#### 2. 双击 msi 文件进行安装

一直点击 next 就行，不过默认是安装在 `c:\\go` 目录下的。

![imagepng](https://chatflow-files-cdn-1256085166.file.myqcloud.com/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzEwLzY1ODJmY2YxYTJiYzRlNmNiMDc0MjgyMDkxNWQ3ZjFhX2ltYWdlLnBuZw.png)

我这里将安装目录修改为了 `H:\\go`, 安装完成之后，默认在环境变量 `path` 后添加了 Go 的安装目录下的 bin 目录， 以及新创建了一个名为 `GOROOT`，值为 Go 的安装目录的环境变量。

![imagepng](https://chatflow-files-cdn-1256085166.file.myqcloud.com/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzEwLzlmZmQzMTRkNjU2ZjQ0YWQ4Mjg5MGQ1NmJkNmQxZjFlX2ltYWdlLnBuZw.png)

![imagepng](https://chatflow-files-cdn-1256085166.file.myqcloud.com/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzEwLzQwMGI1MzM4OTFhZDQ5ZWRhOWE4ZThiYWIxZTkwNjRlX2ltYWdlLnBuZw.png)

#### 3. 设置工作空间 gopath 目录

工作空间也就是 Go 语言开发的项目路径。 window 下，需要新建一个名为 `GOPATH` 的环境变量，值就是自定义的工作目录。需要注意的是，用于存放 Go 语言 Package 的目录, 这个目录不能在 Go 的安装目录 GOBIN 中。

![imagepng](https://chatflow-files-cdn-1256085166.file.myqcloud.com/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzEwL2E3MmE5MDM1NzIzNjRhZTI4N2Y4MWFjMzg1MzVlOTkxX2ltYWdlLnBuZw.png)

在 GOPATH 目录中约定有三个子目录：

- src 存放 go 的项目源码
- pkg 编译之后生成的文件
- bin 编译后生成的可执行文件（为了方便，可以把此目录加入到 windows 的 PATH 变量中，在环境变量 path 后追加%GOPATH%\bin）

![imagepng](https://chatflow-files-cdn-1256085166.file.myqcloud.com/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzEwL2YxMmVjNmFkZmI5OTQ2OTA4YzcyYzYyM2Y5ZTU2NTQzX2ltYWdlLnBuZw.png)

#### 检验

打开命令行，输入 `go verison`, 如果有版本的输出，则表示安装成功。 注意 `go version` 中间只有一个空格。

![imagepng](https://chatflow-files-cdn-1256085166.file.myqcloud.com/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzEwL2FlMGE3NWEwNzAwYjQxZTNiM2VhOWUzMjIxZTdmMTczX2ltYWdlLnBuZw.png)

### idea go

8102 年了，我本人并不是很喜欢 sublime 这个编辑器，平时也是使用 vscode 比较多，这次尝试一下 idea， 记录一下 idea 中 go 开发环境搭建的过程。

在 idea 中使用 go 主要使用到两个插件：

- go

#### 1.安装插件

点击左上角的 "File -> Settings -> Plugins"

![imagepng](https://chatflow-files-cdn-1256085166.file.myqcloud.com/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzEwL2U0ZWNlYjMxNjA4ZjQ2ODJiNjQ3NmE3ZWNlODQ4ZjRiX2ltYWdlLnBuZw.png)

#### 2.首次启动设置 go sdks

![imagepng](https://chatflow-files-cdn-1256085166.file.myqcloud.com/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzEwL2Y1Y2RlNmFlODg3OTQzZmNiOTllNmY3NDk5MGQzOGY4X2ltYWdlLnBuZw.png)

![imagepng](https://chatflow-files-cdn-1256085166.file.myqcloud.com/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzEwLzE2ZDg1ZGQxOGNkMDQzMjJiMDE1MzNhZGE1NzZiZDQxX2ltYWdlLnBuZw.png)

![imagepng](https://chatflow-files-cdn-1256085166.file.myqcloud.com/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzEwLzViYmEzZDIzNzQ3ODQ4M2RhYmFjMmM3ODJmOWM4MTI2X2ltYWdlLnBuZw.png)
