---
title: 'CS'
draft: true
---

# Linux

## 常用命令

查看 nginx 日志 `tail -f /data/log/nginx/cdata.access.log`

监控 itbilu.log 日志件，并查看含有 '/cockpit/cgi' 关键字的前后 5 行：
`tail -f /data/log/nginx/cdata.access.log|grep '/cockpit/cgi' -5`

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

## 管道命令

12.选取：cut -d ' ' -f 1（用于分隔字符） cut -c 12-（字符范围，用于排列整齐的信息）

13.grep 'root'（查找 root）grep -v 'root'（反向选择）-n（输出行号）-i（不区分大小写）

14.sort（默认） sort -t ':' -k 3

15.uniq: 仅列出一个显示

16.wc: 统计字数字符数 e.g. wc -l（仅列出行） cat /etc/man.config | wc

17.uniq（仅列出一个显示）

18.tee: 双向重定向 last | tee last.list | cut -d ' ' -f 1

### 字符转换命令

tr, col, join, paste, expand

19.tr: e.g. tr -d（删除指定字符）tr [a-z][a-z]小写转大写

20.col -x：将断行符^M（tab）转换成对等的空格

21.join -t ':' /etc/passwd /etc/shadow（连接）

22.paste（直接两行贴在一起）

23.expand -t（tab 键转空格键）

24.切割命令 split

split -b 300k /etc/termcap termcap(按文件大小切割)
split -l 10 - lsroot（按行切割）

25.xargs：很多命令不支持管道命令，可以通过 xargs 来提供该命令引用 stdin 之用。

管道命令：cut、grep、sort、wc、uniq、tee、tr、col、join、paste、expand、split、xargs

26.dmesg：列出内核信息

## 正则表达式

sed 管道命令

27.sed -[nefr] 动作 (sed 用于一整行的处理)

动作：a 新增 c 替换（整行替换） d 删除 i 插入 p 打印（与-n 安静模式搭配）

sed 的替换功能（字符串的替换）：sed 's/被替换的字符串/新字符串/g '

28.格式化打印 printf

29.awk（倾向于将一行分成数个“字段”来处理）

e.g. last -n 5 | awk '{print $1 "\t" $3}'

FS（目前的分隔字符，默认空格字符） NR（目前 awk 处理的是第几行） NF（每行拥有的字段总数）

cat /etc/passwd | awk '{FS=":"} $3<10 {print $1 "\t" \$3}'

例子：
cat pay.txt | awk 'NR==1 {printf "%10s %10s %10s %10s %10s\n",$1,$2,$3,$4,"total" } NR>=2 {total=$2+$3+$4;printf "%10s %10d %10d %10d %10.2f\n", $1, $2, $3, \$4, total}'

### 数据流重定向

标准输入：0，<或<<
标准输出：1，>或>>
标准错误输出：2，2>或 2>>

正确错误写入同一个文件：find /home -name .bashrc > list 2>&1

文件比较：

30.diff passwd.old passwd.new（按行来比较）
31.cmp passwd.old passwd.new（按字节来比较）

32.patch

diff 制作补丁文件

diff -Naur passwd.old passwd.new

更新旧文件：patch -p0 < passwd.patch

## Liunx

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

1、netstat -ano |findstr 端口号

2、tasklist|findstr 进程号

3、taskkill -f -t -im 文件名
