---
title: 'ubuntu 安装 docker'
date: '2020-09-16'
tags:
  - docker
  - ubuntu
---

# ubuntu 安装 docker

## ubuntu docker

### 安装

```
sudo apt-get update
sudo apt-get install docker.io
// 启动docker后台服务
sudo service docker start
```

### 镜像加速

由于国内直接访问 docker hub 网速比较慢，拉取镜像的时间就会比较长。所以一般我们都会使用镜像加速或者直接从国内的一些平台镜像仓库上拉取。

推荐使用一下两个镜像市场：

- 网易镜像中心：<https://c.163.com/hub#/m/home/>
- daocloud 镜像市场：<https://hub.daocloud.io/>

查看自己的镜像：

```
 sudo docker images
```

拉取镜像：

```
sudo docker pull 镜像名字
// 例如：
sudo docker pull hub.c.163.com/library/tomcat:latest
sudo docker pull hub.c.163.com/library/mysql:5.7
sudo docker pull hub.c.163.com/nce2/nodejs:0.12.2
sudo docker pull jenkins:latest
sudo docker pull hub.c.163.com/library/nginx:latest
```

与前端相关的镜像基本都在上面了，有需要再补充。我希望使用`docker` + `Jenkins` + `nodejs` + `mysql`

能够自动化部署 nodejs，当然了对于前端 build 之后的静态页面来说，部署应该是相对容易的， 直接使用 nginx 就可以了。

### docker 命令

```
// 退出容器 ？ 关闭服务 ？
ctrl + D
```

## docker 与 vue、react

## docker 与 node

在 docker 的 container 中运行 nodejs 程序。

## todo

https://www.one-tab.com/page/-g13AchdQwOF-3vFuDKi2g

## window docker

安装好之后，尝试 pull 一个 ubuntu 系统玩一玩。

```
docker pull daocloud.io/ubuntu
```

#### window docker 报错

##### docker 提示 image operating system "linux" cannot be used on this platform

在 window 右下角的 docker 图标右键选择 `Switch between Windows and Linux containers`

```
Switch between Windows and Linux containers
You can select which daemon (Linux or Windows) the Docker CLI talks to. Select Switch to Windows containers to toggle to Windows containers. Select Switch to Linux containers.
```

注意 前缀带的 `daocloud.io` 是国内的一个镜像。

`pull` 结束之后，`docker images` 查看本地目前的所有镜像。

```
$ docker images
REPOSITORY           TAG                 IMAGE ID            CREATED             SIZE
daocloud.io/ubuntu   latest              735f80812f90        4 days ago          83.5MB

```

可以看到上面已经有一个 ubuntu 系统下载完成了。接着用这个 ubuntu 镜像创建容器：

```
winpty  docker run -it --name mrj-ubuntu daocloud.io/ubuntu bash
```

另外打开一个终端，查看 docker 运行的进程：

```
$ docker ps
CONTAINER ID        IMAGE                COMMAND             CREATED              STATUS              PORTS               NAMES
bb8d80fad0ca        daocloud.io/ubuntu   "bash"              About a minute ago   Up About a minute
```

退出容器：

```
exit
```

再次运行容器：

```
docker start mrj-ubuntu
// 然后使用winpty 进入容器
winpty docker attach mrj-ubuntu
```

### win10 docker 换源

https://blog.csdn.net/my__holiday/article/details/79111397

### docker nginx 部署示例

创建映射端口为 80 的交互式界面：

```
docker run -p 80 --name web -i -t ubuntu /bin/bash
```

#### todo

`/bin/bash` 这个是什么意思

第一次使用更新源

```
apt-get update
```

apt-get 换源

https://www.cnblogs.com/gabin/p/6519352.html

安装 nginx

```
apt-get install nginx
```

安装 vim

```
apt-get install vim
```

whereis nginx

```
nginx: /usr/sbin/nginx /etc/nginx /usr/share/nginx
```

#### dockerfile 的使用

```
FROM ubuntu:14.04
MAINTAINER yiliang 1144323068@qq.com
RUN apt-get update
RUN apt-get install -y nginx
COPY ./www/user/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
```

docker 构建运行

```
docker build -t="yiliang/nginx-demo 0.0.1"
```

### 删除多个 images

```
docker rmi -f $(docker ps -a -q)

docker rmi -f $(docker images -a -q)
```

https://yeasy.gitbooks.io/docker_practice/image/pull.html

#### 删除 docker 中没有使用的镜像

使用 `docker ps -a` 命令查看 Docker 主机上包含停止的容器在内的所有容器。你可能会对存在这么多容器感到惊讶，尤其是在开发环境。停止状态的容器的可写层仍然占用磁盘空间。要清理掉这些，可以使用 `docker container prune` 命令:

```
docker container prune
```

```
$ docker container prune

WARNING! This will remove all stopped containers.
Are you sure you want to continue? [y/N] y
```

默认情况下，系统会提示是否继续。要绕过提示，请使用 `-f` 或 `--force` 标志。
