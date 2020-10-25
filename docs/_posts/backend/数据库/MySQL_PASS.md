---
title: 'MySQL 修改 root 密码'
draft: true
---

## MySQL 修改 root 密码

### 方法一：用 set password 命令

首先，登陆 mysql

mysql -u root -p

然后执行 set password 命令

set password for root@localhost = password('654321');

上面例子，将 root 密码更改为 654321

### 方法二：使用 mysqladmin

格式为：mysqladmin -u 用户名 -p 旧密码 password 新密码

mysqladmin -uroot -p123456 password "654321"

上面例子，将 root 密码由 123456 更改为 654321

### 方法三：更改 mysql 的 user 表

首先，登陆 mysql

```
mysql -uroot -p
然后操作mysql库的user表，进行update
mysql> use mysql;
mysql> update user set password=password('654321') where user='root' and host='localhost';
mysql> flush privileges;
```

### 方法四：忘记密码的情况下

首先停止 mysql 服务

1、service mysqld stop

以跳过授权的方式启动 mysql

2、mysqld_safe --skip-grant-tables &

3、mysql -u root

操作 mysql 库的 user 表，进行 update

```
mysql> use mysql;
mysql> update user set password=password('654321') where user='root' and host='localhost';
mysql> flush privileges;
mysql> quit
重启mysql服务
```

重启 mysql 服务
service mysqld restart

## 开启远程 mysql 连接

步骤：
1、登入 mysql

2、use mysql 命令

3、GRANT ALL PRIVILEGES ON _._ TO 'root'@'%' IDENTIFIED BY 'root' WITH GRANT OPTION;

4、flush privileges

5、查看 select host,user from user
