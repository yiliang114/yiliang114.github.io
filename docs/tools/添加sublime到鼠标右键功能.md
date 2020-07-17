---
title: '添加sublime到鼠标右键功能'
date: '2020-03-14 17:06:38'
tags:
  - 编辑器
---

### sublime text 添加到鼠标右键功能

#### 1、在 Windows 系统中，下载并安装 sublime text3 软件

#### 2、sublime text 添加到鼠标右键功能

把以下内容复制并保存到文件，重命名为：sublime_addright.reg，然后双击就可以了。
（注意：需要把下面代码中的 Sublime 的安装目录（标粗部分），替换成自已实际的 Sublime 安装目录）

```
Windows Registry Editor Version 5.00
[HKEY_CLASSES_ROOT\*\shell\SublimeText3]
@="用 SublimeText3 打开"
"Icon"="C:\\Program Files\\Sublime Text 3\\sublime_text.exe,0"
[HKEY_CLASSES_ROOT\*\shell\SublimeText3\command]
@="C:\\Program Files\\Sublime Text 3\\sublime_text.exe %1"
[HKEY_CLASSES_ROOT\Directory\shell\SublimeText3]
@="用 SublimeText3 打开"
"Icon"="C:\\Program Files\\Sublime Text 3\\sublime_text.exe,0"
[HKEY_CLASSES_ROOT\Directory\shell\SublimeText3\command]
@="C:\\Program Files\\Sublime Text 3\\sublime_text.exe %1"
```

其中，@="用 SublimeText3 打开" 引号中的内容为出现在鼠标右键菜单中的文字内容。

#### 3、双击文件 sublime_addright.reg

完成后，鼠标选中要编辑的文件，点击鼠标右键，弹出菜单，其中就会出现刚才添加的“用 SublimeText3 打开”选项.
