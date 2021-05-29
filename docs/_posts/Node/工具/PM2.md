---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

# pm2

## 命令

### 启动

```
pm2 start index.js
```

### 重启

用于服务器上更新代码之后

```
pm2 restart index
```

### 查看错误

```
// 列出当前所有的pm2 维护的进程
pm2 list
// 显示错误日志地址
pm2 show pid

// 错误日志位置
cat /root/.pm2/logs/index-error.log
```

#### pm2 本地直接部署

https://www.jianshu.com/p/51bf8cf5227c?from=groupmessage
