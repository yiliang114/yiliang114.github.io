---
layout: CustomPages
title: 前端与数据结构-《玩转数据结构》笔记
date: 2020-11-14
aside: false
draft: true
---

## 玩转数据结构

对数据进行存储。根据应用场景不同，灵活选择数据结构。

![image-20190817111627893](http://media.zhijianzhang.cn/image-20190817111627893.png)

![image-20190817111919305](http://media.zhijianzhang.cn/image-20190817111919305.png)

![image-20190817111959978](http://media.zhijianzhang.cn/image-20190817111959978.png)

![image-20190817112039802](http://media.zhijianzhang.cn/image-20190817112039802.png)

![image-20190817112158218](http://media.zhijianzhang.cn/image-20190817112158218.png)

![image-20190817112235765](/Users/yiliang/Library/Application Support/typora-user-images/image-20190817112235765.png)

DFS 深度优先

BFS 广度优先

![image-20190817112510112](http://media.zhijianzhang.cn/image-20190817112510112.png)

![image-20190817120506643](http://media.zhijianzhang.cn/image-20190817120506643.png)

在学习数据结构和算法的过程中，能够使用 JS 或者 Python 这些脚本语言来学习数据结构的原理，但是不适合用于考察数据结构与算法的性能。 因为脚本语言实际运行的时间，并不仅仅取决于算法逻辑，还取决于解析器的执行效率。

跟 JS 中直接修改数组的 length 类似，在 size 以外的值其实都不要管了。因为永远都引用不到这个值，等到下次再使用这个空间的时候，就会被重新覆盖。

![image-20190817123849107](/Users/yiliang/Library/Application Support/typora-user-images/image-20190817123849107.png)

泛型： 可以让数据结构放置任意类型。Java 的泛型不支持存放基本类型。

不过如果使用泛型的话，每一个元素的值都是一个对象的引用，虽然此时数组已经访问不到这个 size 以外的对象了，但是因为存在引用值，java 或者其他语言并不会对它作自动的垃圾回收处理，所以一般都需要用户进行手动置空，以便能够让编译器作垃圾回收，释放空间。 不过需要注意的是，这个并不属于内存泄漏，只不过是这样处理更好。

![image-20190817124715652](http://media.zhijianzhang.cn/image-20190817124715652.png)

时间复杂度

![image-20190817131444857](http://media.zhijianzhang.cn/image-20190817131444857.png)

![image-20190817133321317](http://media.zhijianzhang.cn/image-20190817133321317.png)

相对比较耗时的操作如果不会每一次都触发的话，那么这一步操作的耗时可以分摊到其他的步骤中去。

![image-20190817133711159](http://media.zhijianzhang.cn/image-20190817133711159.png)

更懒地出处理算法策略。

![image-20190817133939408](http://media.zhijianzhang.cn/image-20190817133939408.png)

栈 Stack 和队列

栈的应用：

1. 无处不在的撤销操作（undo）从栈顶拿出元素，就知道最近的操作是什么
2. 程序调用的系统栈。父过程中调用子过程，当子过程调用结束之后能够返回到父过程未执行完的部分继续执行的原理。
3. 括号匹配（编译器）

### Leetcode 与前端

![image-20190817155618140](http://media.zhijianzhang.cn/image-20190817155618140.png)

![image-20190817155646640](http://media.zhijianzhang.cn/image-20190817155646640.png)

![image-20190817155713063](http://media.zhijianzhang.cn/image-20190817155713063.png)

![image-20190817155731194](http://media.zhijianzhang.cn/image-20190817155731194.png)

![image-20190817170723445](http://media.zhijianzhang.cn/image-20190817170723445.png)

![image-20190817190044665](http://media.zhijianzhang.cn/image-20190817190044665.png)

![image-20190818181407604](http://media.zhijianzhang.cn/image-20190818181407604.png)
