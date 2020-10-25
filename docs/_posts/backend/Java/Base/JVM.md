---
title: '数据库系统原理'
draft: true
---

# Java 虚拟机

## 垃圾收集器

young 区

1.Serial

关注点：stw 的时间 复制算法 STW

2.ParNew

关注点：stw 的时间 Serial 的多线程版本 复制算法 STW

参数 -XX:ParallelGCThreads 并行线程数

3.Parallel Scavenge

关注点：达到一个可控制的吞吐量（吞吐量优先） 复制算法
所谓吞吐量就是 CPU 运行用户代码的时间和 CPU 消耗的时间的比值，即吞吐量=运行用户代码时间/(运行用户代码时间+垃圾收集时间)。

Paralled Scavenge 收集器提供了两个参数用于精确控制吞吐量。分别是控制最大垃圾收集停顿时间的-XX：MaxGCPauseMillis ,以及直接设置吞吐量大小的-XX：GCTimeRatio 参数。

参数

```
-XX:MaxGCPauseMillis
-XX:GCTimeRatio
-XX:+UseAdaptiveSizePolicy 自适应调节策略
```

old 区

1.Serial Old

```
Serial的老年代版本
JDK1.5之前可搭配Parallel Scavenge使用
在CMS发生Concurrent mode failure时使用
Mark-Compact
```

2.Parallel Old

```
Parallel Scavenge的老年代版本
JDK1.6出现 搭配Parallel Scavenge使用
Mark-Compact
```

3.CMS

```
-XX:+UseConcMarkSweepGC
Mark-Sweep
过程：初始标记 并发标记 重新标记 并发清除
初始标记和重新标记会STW
耗时最长是并发标记和并发清除
默认回收线程数：CMS默认启动的回收线程数目是 (ParallelGCThreads + 3)/4)，可以通过-XX:ParallelCMSThreads=20来设定

优点：并发低停顿
缺点：
1、对CPU资源非常敏感
占用部分线程（CPU资源）导致应用程序变慢，吞吐量降低
默认线程数=（CPU数量+3）/4
2、无法处理浮动垃圾，可能出现Concurrent mode failure而导致另一次fullGC的产生
参数-XX:CMSInitiatingOccupancyFraction默认68% CMS触发百分比，CMS执行期间，预留空间无法满足，就会出现Concurrent mode failure失败，启动后备SerialOld的方案，停顿时间更长了。（所以CMSInitiatingOccupancyFraction不能设置的过大）
3、内存碎片
参数-XX:+UseCMSCompactAtFullCollection(停顿时间加长) 默认开启
-XX:CMSFullGCsBeforeCompaction(执行多少次不进行碎片整理的FullGC后进行一次带压缩的)

其他参数
初始标记的并行化-XX:+CMSParallelInitialMarkEnabled
为了减少第二次暂停的时间，开启并行remark: -XX:+CMSParallelRemarkEnabled,如果remark还是过长的话，可以开启-XX:+CMSScavengeBeforeRemark（在CMS GC前启动一次ygc，目的在于减少old gen对ygc gen的引用，降低remark时的开销-----一般CMS的GC耗时 80%都在remark阶段）

为了避免Perm区满引起的full gc，建议开启CMS回收Perm区选项：
+CMSPermGenSweepingEnabled -XX:+CMSClassUnloadingEnabled

-XX:+UseConcMarkSweepGC：设置年老代为并发收集。测试中配置这个以后，-XX:NewRatio=4的配置失效了，原因不明。所以，此时年轻代大小最好用-Xmn设置。
-XX:+UseParNewGC:设置年轻代为并行收集。可与CMS收集同时使用。JDK5.0以上，JVM会根据系统配置自行设置，所以无需再设置此值。
```

G1 收集器

## 收集器组合开关选项

```
-XX:+UseSerialGC Serial+SerialOld
-XX:+UseParNewGC ParNew+SerialOld
-XX:+UseParallelGC ParallelScavenge+SerialOld
-XX:+UseConcMarkSweepGC ParNew+CMS+SerialOld  FullGC算法：单线程的Mark Sweep Compact(MSC)
-XX:+UseParallelOldGC ParallelScavenge+Parallel Old  FullGC算法：PS MarkSweep
```

## JVM 参数

```
垃圾回收参数
-Xnoclassgc 是否对类进行回收
-verbose:class -XX:+TraceClassUnloading 查看类加载和卸载信息

-XX:SurvivorRatio Eden和其中一个survivor的比值
-XX:PretenureSizeThreshold 大对象进入老年代的阈值，Serial和ParNew生效
-XX:MaxTenuringThreshold 晋升老年代的对象年龄，默认15, CMS默认是4
-XX:HandlePromotionFailure 老年代担保
-XX:+UseAdaptiveSizePolicy动态调整Java堆中各个区域大小和进入老年代年龄
-XX:ParallelGCThreads 并行回收的线程数
-XX:MaxGCPauseMillis Parallel Scavenge参数，设置GC的最大停顿时间
-XX:GCTimeRatio  Parallel Scavenge参数，GC时间占总时间的比率，默认99%，即1%的GC时间
-XX:CMSInitiatingOccupancyFraction，old区触发cms阈值，默认68%
-XX:+UseCMSCompactAtFullCollection(CMS完成后是否进行一次碎片整理，停顿时间加长)
-XX:CMSFullGCsBeforeCompaction(执行多少次不进行碎片整理的FullGC后进行一次带压缩的)
-XX:+ScavengeBeforeFullGC，在fullgc前触发一次minorGC

垃圾回收统计信息
-XX:+PrintGC 输出GC日志
-verbose:gc等同于上面那个
-XX:+PrintGCDetails 输出GC的详细日志

堆大小设置
-Xmx:最大堆大小
-Xms:初始堆大小(最小内存值)
-Xmn:年轻代大小
-XX:NewSize和-XX:MaxNewSize 新生代大小
-XX:SurvivorRatio:3 意思是年轻代中Eden区与两个Survivor区的比值。注意Survivor区有两个。如：3，表示Eden：Survivor=3：2，一个Survivor区占整个年轻代的1/5
-XX:NewRatio=4:设置年轻代（包括Eden和两个Survivor区）与年老代的比值（除去持久代）。设置为4，则年轻代与年老代所占比值为1：4，年轻代占整个堆栈的1/5
-Xss栈容量 默认256k
-XX:PermSize永久代初始值
-XX:MaxPermSize 永久代最大值
```

生产环境参数配置(CMS-GC)

```
Java < 8
    -server
    -Xms<heap size>[g|m|k] -Xmx<heap size>[g|m|k]
    -XX:PermSize=<perm gen size>[g|m|k] -XX:MaxPermSize=<perm gen size>[g|m|k]
    -Xmn<young size>[g|m|k]
    -XX:+DisableExplicitGC
    -XX:SurvivorRatio=<ratio>
    -XX:+UseConcMarkSweepGC
    -XX:+CMSParallelRemarkEnabled
    -XX:+CMSScavengeBeforeRemark
    -XX:+UseCMSInitiatingOccupancyOnly
    -XX:CMSInitiatingOccupancyFraction=<percent>
    -XX:+PrintGCDateStamps -verbose:gc -XX:+PrintGCDetails -Xloggc:"<path to log>"
    -XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=10 -XX:GCLogFileSize=100M
    -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=<path to dump>`date`.hprof
    -Dsun.net.inetaddr.ttl=<TTL in seconds>
    -Djava.rmi.server.hostname=<external IP>
    -Dcom.sun.management.jmxremote.port=<port>
    -Dcom.sun.management.jmxremote.authenticate=false
    -Dcom.sun.management.jmxremote.ssl=false

Java >= 8
    -server
    -Xms<heap size>[g|m|k] -Xmx<heap size>[g|m|k]
    -XX:MaxMetaspaceSize=<metaspace size>[g|m|k]
    -Xmn<young size>[g|m|k]
    -XX:+DisableExplicitGC
    -XX:SurvivorRatio=<ratio>
    -XX:+UseConcMarkSweepGC
    -XX:+CMSParallelRemarkEnabled
    -XX:+CMSScavengeBeforeRemark
    -XX:+UseCMSInitiatingOccupancyOnly
    -XX:CMSInitiatingOccupancyFraction=<percent>
    -XX:+PrintGCDateStamps -verbose:gc -XX:+PrintGCDetails -Xloggc:"<path to log>"
    -XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=10 -XX:GCLogFileSize=100M
    -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=<path to dump>`date`.hprof
    -Dsun.net.inetaddr.ttl=<TTL in seconds>
    -Djava.rmi.server.hostname=<external IP>
    -Dcom.sun.management.jmxremote.port=<port>
    -Dcom.sun.management.jmxremote.authenticate=false
    -Dcom.sun.management.jmxremote.ssl=false
```

## 理解 GC 日志

```
DefNew：Serial收集器新生代名称 - Tenured - Perm
ParNew：ParNew收集器新生代名称 -
PSYoungGen：Parallel Scavenge收集器新生代名称
```

## JVM 调优

- GC 的时间足够的小
- GC 的次数足够的少
- 发生 Full GC 的周期足够的长

前两个目前是相悖的，要想 GC 时间小必须要一个更小的堆，要保证 GC 次数足够少，必须保证一个更大的堆，我们只能取其平衡。

（1）针对 JVM 堆的设置，一般可以通过-Xms -Xmx 限定其最小、最大值，为了防止垃圾收集器在最小、最大之间收缩堆而产生额外的时间，我们通常把最大、最小设置为相同的值

（2）年轻代和年老代将根据默认的比例（1：2）分配堆内存，可以通过调整二者之间的比率 NewRadio 来调整二者之间的大小，也可以针对回收代，比如年轻代，通过 -XX:newSize -XX:MaxNewSize 来设置其绝对大小。同样，为了防止年轻代的堆收缩，我们通常会把-XX:newSize -XX:MaxNewSize 设置为同样大小。-XX:PermSize，-XX:MaxPermSize 设置为一样防止老年代收缩。
-XX:NewRatio=4:设置年轻代（包括 Eden 和两个 Survivor 区）与年老代的比值（除去持久代）。设置为 4，则年轻代与年老代所占比值为 1：4，年轻代占整个堆栈的 1/5
-XX:MaxTenuringThreshold=0：设置垃圾最大年龄。如果设置为 0 的话，则年轻代对象不经过 Survivor 区，直接进入年老代。对于年老代比较多的应用，可以提高效率。如果将此值设置为一个较大值，则年轻代对象会在 Survivor 区进行多次复制，这样可以增加对象再年轻代的存活时间，增加在年轻代即被回收的概论。

（3）年轻代和年老代设置多大才算合理？这个我问题毫无疑问是没有答案的，否则也就不会有调优。我们观察一下二者大小变化有哪些影响
年轻代老年代设置：整个 JVM 内存大小=年轻代大小 + 年老代大小 + 持久代大小。持久代一般固定大小为 64m，所以增大年轻代后，将会减小年老代大小。此值对系统性能影响较大，Sun 官方推荐年轻代配置为整个堆的 3/8。

- 更大的年轻代必然导致更小的年老代，大的年轻代会延长普通 GC 的周期，但会增加每次 GC 的时间；小的年老代会导致更频繁的 Full GC
- 更小的年轻代必然导致更大年老代，小的年轻代会导致普通 GC 很频繁，但每次的 GC 时间会更短；大的年老代会减少 Full GC 的频率
- 如何选择应该依赖应用程序对象生命周期的分布情况：如果应用存在大量的临时对象，应该选择更大的年轻代；如果存在相对较多的持久对象，年老代应该适当增大。但很多应用都没有这样明显的特性，在抉择时应该根据以下两点：（A）本着 Full GC 尽量少的原则，让年老代尽量缓存常用对象，JVM 的默认比例 1：2 也是这个道理 （B）通过观察应用一段时间，看其他在峰值时年老代会占多少内存，在不影响 Full GC 的前提下，根据实际情况加大年轻代，比如可以把比例控制在 1：1。但应该给年老代至少预留 1/3 的增长空间

（4）在配置较好的机器上（比如多核、大内存），可以为年老代选择并行收集算法： -XX:+UseParallelOldGC ，默认为 Serial 收集

（5）线程堆栈的设置：每个线程默认会开启 1M 的堆栈，用于存放栈帧、调用参数、局部变量等，对大多数应用而言这个默认值太了，一般 256K 就足用。理论上，在内存不变的情况下，减少每个线程的堆栈，可以产生更多的线程，但这实际上还受限于操作系统。 -Xss256k：设置每个线程的堆栈大小。JDK5.0 以后每个线程堆栈大小为 1M，以前每个线程堆栈大小为 256K。更具应用的线程所需内存大小进行调整。在相同物理内存下，减小这个值能生成更多的线程。但是操作系统对一个进程内的线程数还是有限制的，不能无限生成，经验值在 3000~5000 左右。

（6）可以通过下面的参数打 Heap Dump 信息

```
  -XX:HeapDumpPath
  -XX:+PrintGCDetails
  -XX:+PrintGCTimeStamps
  -Xloggc:/usr/aaa/dump/heap_trace.txt
  通过下面参数可以控制OutOfMemoryError时打印堆的信息
  -XX:+HeapDumpOnOutOfMemoryError
```

注：通过分析 dump 文件可以发现，每个 1 小时都会发生一次 Full GC，经过多方求证，只要在 JVM 中开启了 JMX 服务，JMX 将会 1 小时执行一次 Full GC 以清除引用.

## 性能分析工具

jps

```
-m 主类的参数
-l 主类的全名，如果执行的是jar包，输出jar路径
-v 虚拟机参数
```

jstat

```
监视虚拟机运行状态信息，包括类装载、GC、运行期编译（JIT）
用于输出java程序内存使用情况，包括新生代、老年代、元数据区容量、垃圾回收情况
 jstat -gcutil 52670 2000 5 进程号 2s输出一次一共5次

S0：幸存1区当前使用比例
S1：幸存2区当前使用比例
E：伊甸园区使用比例
O：老年代使用比例
M：元数据区使用比例
CCS：压缩使用比例
YGC：年轻代垃圾回收次数
YGCT：年轻代垃圾回收消耗时间
FGC：老年代垃圾回收次数
FGCT：老年代垃圾回收消耗时间
GCT：垃圾回收消耗总时间
```

jmap

```
jmap：用于生成堆转储快照。一般称为dump或heapdump文件。
jmap -histo 3618
上述命令打印出进程ID为3618的内存情况，包括有哪些对象，对象的数量。但我们常用的方式是将指定进程的内存heap输出到外              部文件，再由专门的heap分析工具进行分析,例如mat（Memory Analysis Tool），所以我们常用的命令是：
jmap -dump:live,format=b,file=heap.hprof 3618
-F 强制生成dump快照
```

jstack

```
jstack：用户输出虚拟机当前时刻的线程快照，常用于定位因为某些线程问题造成的故障或性能问题。一般称为threaddump文件。
参数
-F当正常输出没有响应的时候强制打印栈信息，一般情况不需要使用
-l长列表. 打印关于锁的附加信息，一般情况不需要使用
-m 如果调用本地方法的话，可打印c/c++的堆栈
```

jinfo

查看和修改虚拟机参数

可视化工具
JConsole Java 监视与管理控制台
VisualVM 多合一故障处理工具

Java Class 文件类型前缀

```
Element Type        Encoding
boolean             Z
byte                B
char                C
double              D
float               F
int                 I
long                J
short               S
class or interface  Lclassname;
[L代表了相应类型数组嵌套的层数
```

## 内存泄漏及解决方法

1.系统崩溃前的一些现象：

每次垃圾回收的时间越来越长，由之前的 10ms 延长到 50ms 左右，FullGC 的时间也有之前的 0.5s 延长到 4、5s

FullGC 的次数越来越多，最频繁时隔不到 1 分钟就进行一次 FullGC

年老代的内存越来越大并且每次 FullGC 后年老代没有内存被释放

之后系统会无法响应新的请求，逐渐到达 OutOfMemoryError 的临界值。

2.生成堆的 dump 文件
通过 JMX 的 MBean 生成当前的 Heap 信息，大小为一个 3G（整个堆的大小）的 hprof 文件，如果没有启动 JMX 可以通过 Java 的 jmap 命令来生成该文件。

3.分析 dump 文件

下面要考虑的是如何打开这个 3G 的堆信息文件，显然一般的 Window 系统没有这么大的内存，必须借助高配置的 Linux。当然我们可以借助 X-Window 把 Linux 上的图形导入到 Window。我们考虑用下面几种工具打开该文件：

1.Visual VM
2.IBM HeapAnalyzer
3.JDK 自带的 Hprof 工具

使用这些工具时为了确保加载速度，建议设置最大内存为 6G。使用后发现，这些工具都无法直观地观察到内存泄漏，Visual VM 虽能观察到对象大小，但看不到调用堆栈；HeapAnalyzer 虽然能看到调用堆栈，却无法正确打开一个 3G 的文件。因此，我们又选用了 Eclipse 专门的静态内存分析工具：Mat。

4.分析内存泄漏

通过 Mat 我们能清楚地看到，哪些对象被怀疑为内存泄漏，哪些对象占的空间最大及对象的调用关系。针对本案，在 ThreadLocal 中有很多的 JbpmContext 实例，经过调查是 JBPM 的 Context 没有关闭所致。

另，通过 Mat 或 JMX 我们还可以分析线程状态，可以观察到线程被阻塞在哪个对象上，从而判断系统的瓶颈。

5.回归问题

Q：为什么崩溃前垃圾回收的时间越来越长？

A:根据内存模型和垃圾回收算法，垃圾回收分两部分：内存标记、清除（复制），标记部分只要内存大小固定，时间是不变的，变的是复制部分，因为每次垃圾回收都有一些回收不掉的内存，所以增加了复制量，导致时间延长。所以，垃圾回收的时间也可以作为判断内存泄漏的依据

Q：为什么 Full GC 的次数越来越多？

A：因此内存的积累，逐渐耗尽了年老代的内存，导致新对象分配没有更多的空间，从而导致频繁的垃圾回收

Q:为什么年老代占用的内存越来越大？

A:因为年轻代的内存无法被回收，越来越多地被 Copy 到年老代

## 调优方法

一切都是为了这一步，调优，在调优之前，我们需要记住下面的原则：

1、多数的 Java 应用不需要在服务器上进行 GC 优化；

2、多数导致 GC 问题的 Java 应用，都不是因为我们参数设置错误，而是代码问题；

3、在应用上线之前，先考虑将机器的 JVM 参数设置到最优（最适合）

4、减少创建对象的数量；

5、减少使用全局变量和大对象；

6、GC 优化是到最后不得已才采用的手段；

7、在实际使用中，分析 GC 情况优化代码比优化 GC 参数要多得多；

GC 优化的目的有两个

1、将转移到老年代的对象数量降低到最小；

2、减少 full GC 的执行时间；

为了达到上面的目的，一般地，你需要做的事情有：

1、减少使用全局变量和大对象；

2、调整新生代的大小到最合适；

3、设置老年代的大小为最合适；

4、选择合适的 GC 收集器
