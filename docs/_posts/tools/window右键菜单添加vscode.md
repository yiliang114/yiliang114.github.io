---
title: 'window 右键菜单添加 vscode'
date: '2020-03-14 17:06:38'
tags:
  - 编辑器
vssue-id: 34
---

# window 右键菜单添加 vscode

![这里写图片描述](https://chatflow-files-cdn-1256085166.file.myqcloud.com/20180830001158174.png)

![这里写图片描述](https://chatflow-files-cdn-1256085166.file.myqcloud.com/20180830001257922.png)

![这里写图片描述](https://chatflow-files-cdn-1256085166.file.myqcloud.com/20180830001335376.png)

我最终想要的效果如上图所示：

- **右键文件夹，可以使用 vscode 打开**
- **右键单文件，可以使用 vscode 打开**
- **右键空白处，可以使用 vscode 打开**

---## 实现

1. 新建一个名为 `1.reg` 的文件，找一个记事本或者 sublime 打开，名称无所谓，但是一定需要带上 `.reg` 后缀。
2. 查看你自己的电脑的 vscode 安装目录，最简单的方法就是右键桌面的 vscode，查看属性就知道了。以我的安装地址为例：`C:\\Program Files\\Microsoft VS Code\\Code.exe` ， 单反斜杠最好都换成双反斜杠。
3. 复制一下内容到 `1.reg` 文件中。

   ```
   Windows Registry Editor Version 5.00

   [HKEY_CLASSES_ROOT\*\shell\VSCode]
   @="Open with Code"
   "Icon"="C:\\Program Files\\Microsoft VS Code\\Code.exe"

   [HKEY_CLASSES_ROOT\*\shell\VSCode\command]
   @="\"C:\\Program Files\\Microsoft VS Code\\Code.exe\" \"%1\""

   Windows Registry Editor Version 5.00

   [HKEY_CLASSES_ROOT\Directory\shell\VSCode]
   @="Open with Code"
   "Icon"="C:\\Program Files\\Microsoft VS Code\\Code.exe"

   [HKEY_CLASSES_ROOT\Directory\shell\VSCode\command]
   @="\"C:\\Program Files\\Microsoft VS Code\\Code.exe\" \"%V\""

   Windows Registry Editor Version 5.00

   [HKEY_CLASSES_ROOT\Directory\Background\shell\VSCode]
   @="Open with Code"
   "Icon"="C:\\Program Files\\Microsoft VS Code\\Code.exe"

   [HKEY_CLASSES_ROOT\Directory\Background\shell\VSCode\command]
   @="\"C:\\Program Files\\Microsoft VS Code\\Code.exe\" \"%V\""

   ```

4. 替换所有 vscode 的安装路径。
5. 双击这个文件，之后都选 “是”。
