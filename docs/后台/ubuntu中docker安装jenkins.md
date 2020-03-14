---
  title: "ubuntu中docker安装jenkins"
  date: "2020-03-14 17:06:38"
  permalink: "/pages/39f4c390c7818088"
---
## ubuntu docker 安装 jenkins

**通过 nginx 转发必须是根路径！**

本文是记载我通过 docker 安装 Jenkins 之后再通过 nginx 正向代理，期望这样能够通过访问我自己的域名来初始化 docker 中的 jenkins。但是实际操作中遇到了问题，感觉是 jenkins 的问题。

先简单介绍一下 docker 安装 jenkins 的步骤。

### 步骤

#### 0. 查看版本

Docker 要求 Ubuntu 系统的内核版本高于 3.10 ，查看本页面的前提条件来验证你的 Ubuntu 版本是否支持 Docker。通过 uname -r 命令查看你当前的内核版本。

```bash
uname -r
```

#### 1. 获取最新版本的 Docker 安装包

```bash
wget -qO- https://get.docker.com/ | sh
```

#### 2. 运行/停止 docker

```bash
service docker start  // 启动 docker 服务
service docker restart  // 重启docker服务
service docker stop     // 停止docker服务
```

#### 3. 拉取最新 jenkins 镜像

```bash
docker pull jenkins:latest
```

#### 4. 启动

运行一个镜像为 jenkins:latest 的容器，命名为 jenkins_node2，使用 root 账号覆盖容器中的账号，赋予最高权限，将容器的 **/var/jenkins_home**映射到宿主机的 **/root/jenkins_node2**目录下，映射容器中**8080**端口到宿主机**49004**端口

```bash
sudo docker run -d -u 0 --privileged  --name jenkins_node2 -p 49004:8080 -v /root/jenkins_node2:/var/jenkins_home jenkins:latest
```

#### 坑点来了！！！

**查看 jenkins: **

执行完成后，等待几十秒，等待 jenkins 容器启动初始化。

可以查看宿主机 **/root/jenkins_node2**下是否多了很多文件。 由于是在服务器上启动的，所以不能直接访问 `http://localhost:49003` 来初始化。

也就是说，如果我的服务器防火墙开了 49004 这个端口的话，其实是可以通过 ip:49004 这样的形式去访问 jenkins 并进行初始化了的。 但是，常规的云服务器厂商出于安全考虑一般只会默认开放几个端口，例如 80， 8080， 443 等接口，用于一般的 web 需求。

我的服务器是阿里云的，默认只开了 443 和 80 端口，分别对应 https 和 http 的默认端口， 都是通过 nginx 来代理转发请求的。

一开始我想的比较简单，想直接通过 `http://xxx.yyy.cn/jenkins` 这样的形式来访问，所有带有 `jenkins` 前缀的请求我都统统转发到 49004 端口上去。 于是我的 nginx 配置是这样的：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190410004238549.png)

但是当我访问 `域名/jenkins` 时， 一直显示

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190410004306596.png)

首先是 jenkins 的内容显示不正常，其次查看 `network` 发现有大量的静态资源都是 404。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190410004326636.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190410004348541.png)

仔细查看之后发现，原来 jenkins 的初始化页面上的静态资源加载的路径都是绝对路径，都是从根目录开始寻找静态资源的，难怪这里会显示不正常。

于是乎，我们需要想办法解决这个问题，最简单的方式就是 nginx 代理的直接通过转发到根路径。 要么开其他端口的防火墙可以对外访问，要么就是通过一个三级域名来转发请求（如果你的服务器套了域名的话）。因为开其他端口需要涉及到的更大的权限和隐患，而且阿里云服务器要对外开一个端口真的是贼麻烦，于是我给我的域名再解析了一个三级域名：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190410004404439.png)

忽略最后代理到的是 49003 端口，因为演示的原因，我是重新 run 了一个镜像来写博客的，所以实际情况根据实际的运行端口配置即可。

通过这样操作以后，再访问 `http://jenkins.xxx.cn` 的时候你就会看到熟悉的登录界面啦~

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190410004445924.png)

#### 写在最后

不确定会不会有人跟我一样遇到这个问题，想来想去还是记录一下，说不定对别人也有用，特别是遇到 jenkins 正在启动的页面的时候，还一直傻傻等着的人（比如一开始的我， 好歹也是前端工程师。。。。竟然一直没注意去看 network）。
