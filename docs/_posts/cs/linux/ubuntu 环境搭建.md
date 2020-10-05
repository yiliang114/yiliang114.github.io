---
title: 'ubuntu 环境搭建'
date: '2020-09-15'
tags:
  - linux
---

# ubuntu 环境搭建

## ubuntu 查看版本

```
sudo lsb_release -a
```

输出：

```
0160110ubuntu0.2-noarch
Distributor ID:	Ubuntu
Description:	Ubuntu 16.04.3 LTS
Release:	16.04
Codename:	xenial
```

## nginx

## mysql

### 查看是否安装 Mysql

```
sudo netstat -tap | grep mysql
```

如果为空则没有安装，进行安装：

```
sudo apt-get install mysql-server mysql-client
```

根据提示输入密码，然后确认

### Mysql 连接测试

```
mysql -u root -h localhost -p
```

启动，停止，重启 Mysql 命令

```
sudo service mysql start
sudo service mysql stop
sudo service mysql restart
```

### Ubuntu 安装 mysql 忘记初始密码解决方法

```
//打开这个文件 /etc/mysql/debian.cnf
//查看默认分配的密码
[client]
host = localhost
user = debian-sys-maint
password = eyPDN7kavhmjCZUn （记住这个密码）
socket = /var/run/mysqld/mysqld.sock
```

### 输入命令进入 mysql 修改用户密码

```
// 输入命令后把上面的密码粘贴进去
mysql -udebian-sys-maint -p12
//进入到mysql界面厚修改密码
update mysql.user set authentication_string=password('newpassword') where user='root'

//都要使用刷新权限列表
flush privileges;
```

## mongodb

傻瓜化操作：

1. 安装 `sudo apt-get install mongodb`
2. 这时装好以后应该会自动运行 mongod 程序，通过`pgrep mongo -l`查看进程是否已经启动

### 关闭／启动

sudo service mongodb stop 　　 sudo service mongodb start

## root

`sudo su`

## 安装 nginx

直接使用`sudo apt-get install nginx`安装

### 查看 nginx 路径

`nginx -t`

## 安装 nodejs

下载：

`wget https://nodejs.org/dist/v8.1.0/node-v8.1.0-linux-x64.tar.xz`

解压

`tar -xvf node-v8.1.0-linux-x64.tar.xz`

切换并查看 node 所在目录：

```
cd node-v8.1.0-linux-x64/bin
pwd
```

查看 node 版本

`node -v`

### 将 node 和 npm 设置为全局

```
sudo ln -s /usr/local/download/node-v8.1.0-linux-x64/bin/node /usr/local/bin/node
sudo ln /usr/local/download/node-v8.1.0-linux-x64/bin/npm /usr/local/bin/npm
pwd
```

### nodejs 更新

`npm update -g`

或者

### Error: npm is known not to run on Node.js V4.2.6

node 版本过低

解决方案：

First, Uninstall completely nodejs and npm.

```
sudo apt remove nodejs npm
```

Then, reinstall it over the link below:

```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 安装 mysql

```
sudo apt-get install mysql-server
sudo apt-get install mysql-client
sudo apt-get install libmysqlclient-dev
```

安装过程中会提示设置密码什么的，注意设置了不要忘了，安装完成之后可以使用如下命令来检查是否安装成功：

```
sudo netstat -tap | grep mysql
```

通过上述命令检查之后，如果看到有 mysql 的 socket 处于 listen 状态则表示安装成功。

登陆 mysql 数据库可以通过如下命令：

```
mysql -u root -p
```

-u 表示选择登陆的用户名， -p 表示登陆的用户密码，上面命令输入之后会提示输入密码，此时输入密码就可以登录到 mysql。

## node 运行

### PM2

[pm2](https://www.jianshu.com/p/fdc12d82b661)

## window mysql

```
net stop mysql
net start mysql

```

[window mysql](https://www.cnblogs.com/lmh2072005/p/5656392.html)
