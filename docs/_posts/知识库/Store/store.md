---
title: Store
date: 2021-03-04
draft: true
---

### 权限管理

rbac idap 等
https://www.v2ex.com/t/468437
美团将军令 https://tech.meituan.com/2019/02/14/data-security-platform-construction-practice-jiangjunling.html

#### travis

自动部署 npm 包：https://blog.csdn.net/lym152898/article/details/81868524

https://juejin.im/post/5ab39fedf265da23a04979cb

https://blog.stephencode.com/p/ssh-login-no-pwd

http://www.ruanyifeng.com/blog/2017/12/travis_ci_tutorial.html

https://segmentfault.com/a/1190000011218410

需要删除私钥：

https://www.zhuwenlong.com/blog/article/5c24b6f2895e3a0fb4072a5c

### 压缩解压

压缩：tar cvf FileName.tar FileName
排除文件压缩：tar zc --exclude node_modules --exclude .git -f 1.tar.gz \*
解压：tar xvf FileName.tar

https://blog.csdn.net/liuyanfeier/article/details/62422315

### 进程和线程的区别？

一个程序至少有一个进程，一个进程至少有一个线程，资源分配给进程，同一个进程下的所有线程共享该进程的所有资源。

### 堆和栈的区别是什么？

栈一般是用来存储函数的参数值和局部变量的值，由编译器自动分配和释放，
存储方式是连续的，且会出现溢出现象，堆有程序员手动分配释放，存储地址是
链式的，内存较大不会溢出。栈由系统自动分配，速度快，堆由 new 分配内存，速度慢

### 线程与进程的区别

- 一个程序至少有一个进程，一个进程至少有一个线程
- 线程的划分尺度小于进程，使得多线程程序的并发性高
- 进程在执行过程中拥有独立的内存单元，而多个线程共享内存
- 线程不能够独立执行，必须应用程序提供多个线程执行控制
