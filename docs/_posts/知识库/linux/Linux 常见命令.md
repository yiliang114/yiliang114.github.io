---
title: 'Linux 常见命令'
draft: true
---

## Linux

### 常用命令

查看 nginx 日志 `tail -f /data/log/nginx/test.access.log`

监控 itbilu.log 日志件，并查看含有 '/cockpit/cgi' 关键字的前后 5 行：
`tail -f /data/log/nginx/test.access.log|grep '/cockpit/cgi' -5`

0. mkdir -p 一次可以建立多个目录

复制、删除、移动：

1. 复制：cp -a（带文件特性一起复制）, cp -i（覆盖时询问）, cp -r（目录）

2. 删除：rm -f（忽略警告） rm -r（递归删除）

3. 移动: mv 文件 1 文件 2 目录，mv 目录名 新目录名(目录重命名)

磁盘与目录的容量：

4. 磁盘：df, df -i（以 inode 数量显示）, df -h(MB,GB), df -m(MB)

5. 目录: du -sm(列出总量,以 MB 显示)

连接：

6. ln(硬链接)

7. ln -s（软链接）

压缩/解压缩:

7. 压缩: gzip -v, bzip2 -z 8.解压缩: gzip -d, bzip2 -d

tar 打包：

8. 打包为 gzip 文件：tar -zcvf 新建的文件名 旧文件
   解压缩：tar -zxvf 文件

9. 打包为 bzip2：tar -jcvf 新建的文件名 旧文件
   解压缩：tar -jxvf 文件

备份目录：

10. dump -0j -f /tmp/etc.dump.bz2 /etc

11. 恢复：restore -t -f /tmp/etc.dump.bz2

12. ab 命令压测

### tar -zcvf 命令的一个坑

命令如下，我想把当前文件夹中的所有文件，除了 node_modules 文件夹之外都打包进去，但是实际上以 `.xxx` 开头的这些文件，都没有被打包进去。。。比如 `.gitignore .babelrc`

```
tar -zcvf leah-server-mini.tar.gz --exclude=node_modules ./*
```

### 压缩、解压 tar.gz

```
tar -xzvf file.tar.gz //解压tar.gz
tar -czf jpg.tar.gz *.jpg
```

### 解决占用端口

1. netstat -ano |findstr 端口号
2. tasklist|findstr 进程号
3. taskkill -f -t -im 文件名
