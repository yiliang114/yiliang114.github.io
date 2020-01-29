### linux 找不到 iptables 文件

> linux 的/etc/sysconfig/下找不到 iptables 文件

### 问题

我安装了 linux 的 postfix。本想做些防火墙策略。可是`service iptables start`或者`/etc/init.d/iptables start` 启动不起来。然后发现防火墙策略都是写在`/etc/sysconfig/iptables`文件里面的。可我发现我也没有这个文件。这该如何解决呢？
原因一般是没有配置过防火墙，在安装 linux 系统时也已经禁掉了防火墙。

### 解决

随便写一条 iptables 命令配置个防火墙规则：如：
`iptables -P OUTPUT ACCEPT` 。。。。

然后用命令：`service iptables save`进行保存，默认就保存到文件里。这时`/etc/sysconfig/iptables`既有了这个文件。防火墙也可以启动了。接下来要写策略，也可以直接写在`/etc/sysconfig/iptables` 里了。
