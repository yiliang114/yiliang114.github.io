---
title: 'Redis'
draft: true
---

<!-- GFM-TOC -->

- [一、Redis 是什么](#一redis-是什么)
- [二、五种基本类型](#二五种基本类型)
  - [1. STRING](#1-string)
  - [2. LIST](#2-list)
  - [3. SET](#3-set)
  - [4. HASH](#4-hash)
  - [5. ZSET](#5-zset)
- [三、键的过期时间](#三键的过期时间)
- [四、发布与订阅](#四发布与订阅)
- [五、事务](#五事务)
- [六、持久化](#六持久化)
  - [1. 快照持久化](#1-快照持久化)
  - [2. AOF 持久化](#2-aof-持久化)
- [七、复制](#七复制)
  - [从服务器连接主服务器的过程](#从服务器连接主服务器的过程)
  - [主从链](#主从链)
- [八、处理故障](#八处理故障)
- [九、分片](#九分片)
  - [1. 客户端分片](#1-客户端分片)
  - [2. 代理分片](#2-代理分片)
  - [3. 服务器分片](#3-服务器分片)
- [十、事件](#十事件)
  - [事件类型](#事件类型)
    - [1. 文件事件](#1-文件事件)
    - [2. 时间事件](#2-时间事件)
  - [事件的调度与执行](#事件的调度与执行)
- [十一、Redis 与 Memcached 的区别](#十一redis-与-memcached-的区别)
  - [数据类型](#数据类型)
  - [数据持久化](#数据持久化)
  - [分布式](#分布式)
  - [内存管理机制](#内存管理机制)
- [十二、Redis 适用场景](#十二redis-适用场景)
  - [缓存](#缓存)
  - [消息队列](#消息队列)
  - [计数器](#计数器)
  - [好友关系](#好友关系)
- [十三、数据淘汰策略](#十三数据淘汰策略)
- [十四、一个简单的论坛系统分析](#十四一个简单的论坛系统分析)
  - [文章信息](#文章信息)
  - [点赞功能](#点赞功能)
  - [对文章进行排序](#对文章进行排序)
  - [Redis 学习日记](#redis-学习日记)
    - [Redis 安装](#redis-安装)
    - [数据类型](#数据类型-1)
    - [数据类型 String](#数据类型-string)
    - [数据类型 List](#数据类型-list)
    - [数据类型 Hash](#数据类型-hash)
    - [数据类型 SET](#数据类型-set)
    - [数据类型 SortedSet](#数据类型-sortedset)
    - [Key 命令](#key-命令)
    - [事务](#事务)
    - [主从复制](#主从复制)
    - [数据持久化](#数据持久化-1)
    - [管道](#管道)
      <!-- GFM-TOC -->

# 一、Redis 是什么

Redis 是速度非常快的非关系型（NoSQL）内存键值数据库，可以存储键和五种不同类型的值之间的映射。

五种类型数据类型为：字符串、列表、集合、有序集合、散列表。

Redis 支持很多特性，例如将内存中的数据持久化到硬盘中，使用复制来扩展读性能，使用分片来扩展写性能。

# 二、五种基本类型

| 数据类型 |      可以存储的值      |                                                       操作                                                       |
| :------: | :--------------------: | :--------------------------------------------------------------------------------------------------------------: |
|  STRING  | 字符串、整数或者浮点数 |                对整个字符串或者字符串的其中一部分执行操作</br> 对整数和浮点数执行自增或者自减操作                |
|   LIST   |          链表          |              从两端压入或者弹出元素</br> 读取单个或者多个元素</br> 进行修剪，只保留一个范围内的元素              |
|   SET    |        无序集合        | 添加、获取、移除单个元素</br> 检查一个元素是否存在于集合中</br> 计算交集、并集、差集</br> 从集合里面随机获取元素 |
|   HASH   | 包含键值对的无序散列表 |                      添加、获取、移除单个键值对</br> 获取所有键值对</br> 检查某个键是否存在                      |
|   ZSET   |        有序集合        |                  添加、获取、删除元素</br> 根据分值范围或者成员来获取元素</br> 计算一个键的排名                  |

> [What Redis data structures look like](https://redislabs.com/ebook/part-1-getting-started/chapter-1-getting-to-know-redis/1-2-what-redis-data-structures-look-like/)

## 1. STRING

```html
> set hello world OK > get hello "world" > del hello (integer) 1 > get hello (nil)
```

## 2. LIST

```html
> rpush list-key item (integer) 1 > rpush list-key item2 (integer) 2 > rpush list-key item (integer) 3 > lrange list-key
0 -1 1) "item" 2) "item2" 3) "item" > lindex list-key 1 "item2" > lpop list-key "item" > lrange list-key 0 -1 1) "item2"
1) "item"
```

## 3. SET

```html
> sadd set-key item (integer) 1 > sadd set-key item2 (integer) 1 > sadd set-key item3 (integer) 1 > sadd set-key item
(integer) 0 > smembers set-key 1) "item" 2) "item2" 3) "item3" > sismember set-key item4 (integer) 0 > sismember set-key
item (integer) 1 > srem set-key item2 (integer) 1 > srem set-key item2 (integer) 0 > smembers set-key 1) "item" 2)
"item3"
```

## 4. HASH

```html
> hset hash-key sub-key1 value1 (integer) 1 > hset hash-key sub-key2 value2 (integer) 1 > hset hash-key sub-key1 value1
(integer) 0 > hgetall hash-key 1) "sub-key1" 2) "value1" 3) "sub-key2" 4) "value2" > hdel hash-key sub-key2 (integer) 1
> hdel hash-key sub-key2 (integer) 0 > hget hash-key sub-key1 "value1" > hgetall hash-key 1) "sub-key1" 2) "value1"
```

## 5. ZSET

```html
> zadd zset-key 728 member1 (integer) 1 > zadd zset-key 982 member0 (integer) 1 > zadd zset-key 982 member0 (integer) 0
> zrange zset-key 0 -1 withscores 1) "member1" 2) "728" 3) "member0" 4) "982" > zrangebyscore zset-key 0 800 withscores
1) "member1" 2) "728" > zrem zset-key member1 (integer) 1 > zrem zset-key member1 (integer) 0 > zrange zset-key 0 -1
withscores 1) "member0" 2) "982"
```

# 三、键的过期时间

Redis 可以为每个键设置过期时间，当键过期时，会自动删除该键。

对于散列表这种容器，只能为整个键设置过期时间（整个散列表），而不能为键里面的单个元素设置过期时间。

过期时间对于清理缓存数据非常有用。

# 四、发布与订阅

订阅者订阅了频道之后，发布者向频道发送字符串消息会被所有订阅者接收到。

发布与订阅模式和观察者模式有以下不同：

- 观察者模式中，观察者和主题都知道对方的存在；而在发布与订阅模式中，发布者与订阅者不知道对方的存在，它们之间通过频道进行通信。
- 观察者模式是同步的，当事件触发时，主题会去调度观察者的方法；而发布与订阅模式是异步的；

发布与订阅有一些问题，很少使用它，而是使用替代的解决方案。问题如下：

1. 如果订阅者读取消息的速度很慢，会使得消息不断积压在发布者的输出缓存区中，造成内存占用过多；
2. 如果订阅者在执行订阅的过程中网络出现问题，那么就会丢失断线期间发送的所有消息。

# 五、事务

Redis 最简单的事务实现方式是使用 MULTI 和 EXEC 命令将事务操作包围起来。

MULTI 和 EXEC 中的操作将会一次性发送给服务器，而不是一条一条发送，这种方式称为流水线，它可以减少客户端与服务器之间的网络通信次数从而提升性能。

# 六、持久化

Redis 是内存型数据库，为了保证数据在断电后不会丢失，需要将内存中的数据持久化到硬盘上。

## 1. 快照持久化

将某个时间点的所有数据都存放到硬盘上。

可以将快照复制到其它服务器从而创建具有相同数据的服务器副本。

如果系统发生故障，将会丢失最后一次创建快照之后的数据。

如果数据量很大，保存快照的时间会很长。

## 2. AOF 持久化

将写命令添加到 AOF 文件（Append Only File）的末尾。

对硬盘的文件进行写入时，写入的内容首先会被存储到缓冲区，然后由操作系统决定什么时候将该内容同步到硬盘，用户可以调用 file.flush() 方法请求操作系统尽快将缓冲区存储的数据同步到硬盘。

将写命令添加到 AOF 文件时，要根据需求来保证何时将添加的数据同步到硬盘上，有以下同步选项：

|   选项   |         同步频率         |
| :------: | :----------------------: |
|  always  |     每个写命令都同步     |
| everysec |       每秒同步一次       |
|    no    | 让操作系统来决定何时同步 |

always 选项会严重减低服务器的性能；everysec 选项比较合适，可以保证系统奔溃时只会丢失一秒左右的数据，并且 Redis 每秒执行一次同步对服务器性能几乎没有任何影响；no 选项并不能给服务器性能带来多大的提升，而且也会增加系统奔溃时数据丢失的数量。

随着服务器写请求的增多，AOF 文件会越来越大；Redis 提供了一种将 AOF 重写的特性，能够去除 AOF 文件中的冗余写命令。

# 七、复制

通过使用 slaveof host port 命令来让一个服务器成为另一个服务器的从服务器。

一个从服务器只能有一个主服务器，并且不支持主主复制。

## 从服务器连接主服务器的过程

1. 主服务器创建快照文件，发送给从服务器，并在发送期间使用缓冲区记录执行的写命令。快照文件发送完毕之后，开始向从服务器发送存储在缓冲区中的写命令；

2. 从服务器丢弃所有旧数据，载入主服务器发来的快照文件，之后从服务器开始接受主服务器发来的写命令；

3. 主服务器每执行一次写命令，就向从服务器发送相同的写命令。

## 主从链

随着负载不断上升，主服务器可能无法很快地更新所有从服务器，或者重新连接和重新同步从服务器将导致系统超载。为了解决这个问题，可以创建一个中间层来分担主服务器的复制工作。中间层的服务器是最上层服务器的从服务器，又是最下层服务器的主服务器。

# 八、处理故障

要用到持久化文件来恢复服务器的数据。

持久化文件可能因为服务器出错也有错误，因此要先对持久化文件进行验证和修复。对 AOF 文件就行验证和修复很容易，修复操作将第一个出错命令和其后的所有命令都删除；但是只能验证快照文件，无法对快照文件进行修复，因为快照文件进行了压缩，出现在快照文件中间的错误可能会导致整个快照文件的剩余部分无法读取。

当主服务器出现故障时，Redis 常用的做法是新开一台服务器作为主服务器，具体步骤如下：假设 A 为主服务器，B 为从服务器，当 A 出现故障时，让 B 生成一个快照文件，将快照文件发送给 C，并让 C 恢复快照文件的数据。最后，让 B 成为 C 的从服务器。

# 九、分片

Redis 中的分片类似于 MySQL 的分表操作，分片是将数据划分为多个部分的方法，对数据的划分可以基于键包含的 ID、基于键的哈希值，或者基于以上两者的某种组合。通过对数据进行分片，用户可以将数据存储到多台机器里面，也可以从多台机器里面获取数据，这种方法在解决某些问题时可以获得线性级别的性能提升。

假设有 4 个 Reids 实例 R0，R1，R2，R3，还有很多表示用户的键 user:1，user:2，... 等等，有不同的方式来选择一个指定的键存储在哪个实例中。最简单的方式是范围分片，例如用户 id 从 0\~1000 的存储到实例 R0 中，用户 id 从 1001\~2000 的存储到实例 R1 中，等等。但是这样需要维护一张映射范围表，维护操作代价很高。还有一种方式是哈希分片，使用 CRC32 哈希函数将键转换为一个数字，再对实例数量求模就能知道应该存储的实例。

## 1. 客户端分片

客户端使用一致性哈希等算法决定键应当分布到哪个节点。

## 2. 代理分片

将客户端请求发送到代理上，由代理转发请求到正确的节点上。

## 3. 服务器分片

Redis Cluster。

# 十、事件

## 事件类型

### 1. 文件事件

服务器有许多套接字，事件产生时会对这些套接字进行操作，服务器通过监听套接字来处理事件。常见的文件事件有：客户端的连接事件；客户端的命令请求事件；服务器向客户端返回命令结果的事件；

### 2. 时间事件

又分为两类：定时事件是让一段程序在指定的时间之内执行一次；周期性时间是让一段程序每隔指定时间就执行一次。

## 事件的调度与执行

服务器需要不断监听文件事件的套接字才能得到待处理的文件事件，但是不能监听太久，否则时间事件无法在规定的时间内执行，因此监听时间应该根据距离现在最近的时间事件来决定。

事件调度与执行由 aeProcessEvents 函数负责，伪代码如下：

```python
def aeProcessEvents():

    # 获取到达时间离当前时间最接近的时间事件
    time_event = aeSearchNearestTimer()

    # 计算最接近的时间事件距离到达还有多少毫秒
    remaind_ms = time_event.when - unix_ts_now()

    # 如果事件已到达，那么 remaind_ms 的值可能为负数，将它设为 0
    if remaind_ms < 0:
        remaind_ms = 0

    # 根据 remaind_ms 的值，创建 timeval
    timeval = create_timeval_with_ms(remaind_ms)

    # 阻塞并等待文件事件产生，最大阻塞时间由传入的 timeval 决定
    aeApiPoll(timeval)

    # 处理所有已产生的文件事件
    procesFileEvents()

    # 处理所有已到达的时间事件
    processTimeEvents()
```

将 aeProcessEvents 函数置于一个循环里面，加上初始化和清理函数，就构成了 Redis 服务器的主函数，伪代码如下：

```python
def main():

    # 初始化服务器
    init_server()

    # 一直处理事件，直到服务器关闭为止
    while server_is_not_shutdown():
        aeProcessEvents()

    # 服务器关闭，执行清理操作
    clean_server()
```

从事件处理的角度来看，服务器运行流程如下：

# 十一、Redis 与 Memcached 的区别

两者都是非关系型内存键值数据库。有以下主要不同：

## 数据类型

Memcached 仅支持字符串类型，而 Redis 支持五种不同种类的数据类型，使得它可以更灵活地解决问题。

## 数据持久化

Redis 支持两种持久化策略：RDB 快照和 AOF 日志，而 Memcached 不支持持久化。

## 分布式

Memcached 不支持分布式，只能通过在客户端使用像一致性哈希这样的分布式算法来实现分布式存储，这种方式在存储和查询时都需要先在客户端计算一次数据所在的节点。

Redis Cluster 实现了分布式的支持。

## 内存管理机制

在 Redis 中，并不是所有数据都一直存储在内存中，可以将一些很久没用的 value 交换到磁盘。而 Memcached 的数据则会一直在内存中。

Memcached 将内存分割成特定长度的块来存储数据，以完全解决内存碎片的问题，但是这种方式会使得内存的利用率不高，例如块的大小为 128 bytes，只存储 100 bytes 的数据，那么剩下的 28 bytes 就浪费掉了。

# 十二、Redis 适用场景

## 缓存

将热点数据放到内存中。

## 消息队列

List 类型是双向链表，很适合用于消息队列。

## 计数器

Redis 这种内存数据库能支持计数器频繁的读写操作。

## 好友关系

使用 Set 类型的交集操作很容易就可以知道两个用户的共同好友。

# 十三、数据淘汰策略

可以设置内存最大使用量，当内存使用量超过时施行淘汰策略，具体有 6 种淘汰策略。

|      策略       |                         描述                         |
| :-------------: | :--------------------------------------------------: |
|  volatile-lru   | 从已设置过期时间的数据集中挑选最近最少使用的数据淘汰 |
|  volatile-ttl   |   从已设置过期时间的数据集中挑选将要过期的数据淘汰   |
| volatile-random |      从已设置过期时间的数据集中任意选择数据淘汰      |
|   allkeys-lru   |       从所有数据集中挑选最近最少使用的数据淘汰       |
| allkeys-random  |          从所有数据集中任意选择数据进行淘汰          |
|  no-envicition  |                     禁止驱逐数据                     |

如果使用 Redis 来缓存数据时，要保证所有数据都是热点数据，可以将内存最大使用量设置为热点数据占用的内存量，然后启用 allkeys-lru 淘汰策略，将最近最少使用的数据淘汰。

作为内存数据库，出于对性能和内存消耗的考虑，Redis 的淘汰算法（LRU、TTL）实际实现上并非针对所有 key，而是抽样一小部分 key 从中选出被淘汰 key。抽样数量可通过 maxmemory-samples 配置。

# 十四、一个简单的论坛系统分析

该论坛系统功能如下：

- 可以发布文章；
- 可以对文章进行点赞；
- 在首页可以按文章的发布时间或者文章的点赞数进行排序显示；

## 文章信息

文章包括标题、作者、赞数等信息，在关系型数据库中很容易构建一张表来存储这些信息，在 Redis 中可以使用 HASH 来存储每种信息以及其对应的值的映射。

Redis 没有关系型数据库中的表这一概念来将同类型的数据存放在一起，而是使用命名空间的方式来实现这一功能。键名的前面部分存储命名空间，后面部分的内容存储 ID，通常使用 : 来进行分隔。例如下面的 HASH 的键名为 article:92617，其中 article 为命名空间，ID 为 92617。

## 点赞功能

当有用户为一篇文章点赞时，除了要对该文章的 votes 字段进行加 1 操作，还必须记录该用户已经对该文章进行了点赞，防止用户点赞次数超过 1。可以建立文章的已投票用户集合来进行记录。

为了节约内存，规定一篇文章发布满一周之后，就不能再对它进行投票，而文章的已投票集合也会被删除，可以为文章的已投票集合设置一个一周的过期时间就能实现这个规定。

## 对文章进行排序

为了按发布时间和点赞数进行排序，可以建立一个文章发布时间的有序集合和一个文章点赞数的有序集合。（下图中的 score 就是这里所说的点赞数；下面所示的有序集合分值并不直接是时间和点赞数，而是根据时间和点赞数间接计算出来的）

## Redis 学习日记

Redis 是一个开源（BSD 许可）的，非关系型内存数据库，它可以用作数据库、缓存和消息中间件。 它支持多种类型的数据结构，如 字符串（strings）， 散列（hashes）， 列表（lists）， 集合（sets）， 有序集合（sorted sets） 与范围查询， bitmaps， hyperloglogs 和 地理空间（geospatial） 索引半径查询。 Redis 内置了 复制（replication），LUA 脚本（Lua scripting）， LRU 驱动事件（LRU eviction），事务（transactions） 和不同级别的 磁盘持久化（persistence）， 并通过 Redis 哨兵（Sentinel）和自动 分区（Cluster）提供高可用性（high availability）。

### Redis 安装

Ubuntu 上安装

```sh
$sudo apt-get update
$sudo apt-get install redis-server
```

启动 Redis

```sh
$redis-server
```

查看 redis 是否还在运行

```sh
$redis-cli
```

这将打开一个 Redis 提示符，如下图所示：

```sh
redis 127.0.0.1:6379>
```

在上面的提示信息中：127.0.0.1 是本机的 IP 地址，6379 是 Redis 服务器运行的端口。现在输入 PING 命令，如下图所示：

```sh
redis 127.0.0.1:6379> ping
PONG
```

这说明现在你已经成功地在计算机上安装了 Redis。

在 Ubuntu 上安装 Redis 桌面管理器
要在 Ubuntu 上安装 Redis 桌面管理，可以从 http://redisdesktop.com/download 下载包并安装它。
Redis 桌面管理器会给你用户界面来管理 Redis 键和数据。

### 数据类型

### 数据类型 String

1\.

```sh
exists 存在1，否则0
append
get
set
strlen
```

2\.

```sh
incr
decr
incrby
decrby
del
```

3\.

```sh
GETSET
SETEX 过期时间

SETNX
如果指定的Key不存在，则设定该Key持有指定字符串Value，此时其效果等价于SET命令。相反，如果该Key已经存在，该命令将不做任何操作并返回。

SETRANGE
GETRANGE
```

4\.

```sh
setbit
getbit
```

5\.

```sh
mset
mget
msetnx
如果在这一批Keys中有任意一个Key已经存在了，那么该操作将全部回滚，即所有的修改都不会生效。
```

### 数据类型 List

1\.

```sh
lpush e.g.lpush mykey a b c d e
lpushx
lrange e.g. lrange mykey 0 -1
```

2\.

```sh
lpop
llen
```

3\.

```sh
lrem e.g. lrem mykey 2 a
lset
lindex
ltrim
linsert
```

4\.

```sh
rpush e.g.rpush mykey a b c d
rpushx
rpop e.g.rpop mykey
rpoplpush 尾部弹出插入到另一个头部，原子操作
```

### 数据类型 Hash

1\.

```sh
hset
hget
hdel
hexists
hlen
hsetnx
```

2\.

```sh
hincrby
```

3\.

```sh
hgetall
hkeys
hvals
hmget
hmset
```

### 数据类型 SET

1\.

```sh
sadd
smembers
scard 数量
sismember
```

2\.

```sh
spop
srem
srandmember
smove
```

3\.

```sh
sdiff e.g.sdiff myset myset2 myset3
sdiffstore e.g.sdiffstore diffkey myset myset2 myset3
sinter e.g.sinter myset myset2 myset3 交集
sinterstore e.g.sinterstore interkey myset myset2 myset3 存储交集
sunion e.g.sunion myset myset2 myset3 并集
sunionstore e.g.sunionstore unionkey myset myset2 myset3
```

### 数据类型 SortedSet

1\.

```sh
zadd
zcard
zcount
zrem
zincrby
zscore
zrange
zrank
```

2\.

```sh
zrangebysocre
zremrangebyrank
zremrangebyscore
```

3\.

```sh
zrevrange
zrevrangebyscore
zrevrank
```

### Key 命令

1\.

```
flushdb
set
sadd
hset
del e.g.del key1 key2
exists
move
keys hello*
select 0切换数据库
rename 改名 改名的存在被覆盖，成功
renamenx 改名的存在操作无效
quit
info
dbsize
flushdb
```

2\.

```sh
persist
expire
expireat
ttl
```

3\.

```sh
type
randomkey
sort
```

### 事务

1\. 事务被正常执行：

```sh
    #在Shell命令行下执行Redis的客户端工具。
    /> redis-cli
    #在当前连接上启动一个新的事务。
    redis 127.0.0.1:6379> multi
    OK
    #执行事务中的第一条命令，从该命令的返回结果可以看出，该命令并没有立即执行，而是存于事务的命令队列。
    redis 127.0.0.1:6379> incr t1
    QUEUED
    #又执行一个新的命令，从结果可以看出，该命令也被存于事务的命令队列。
    redis 127.0.0.1:6379> incr t2
    QUEUED
    #执行事务命令队列中的所有命令，从结果可以看出，队列中命令的结果得到返回。
    redis 127.0.0.1:6379> exec
    1) (integer) 1
    2) (integer) 1
```

2\. 事务中存在失败的命令：

```sh
    #开启一个新的事务。
    redis 127.0.0.1:6379> multi
    OK
    #设置键a的值为string类型的3。
    redis 127.0.0.1:6379> set a 3
    QUEUED
    #从键a所关联的值的头部弹出元素，由于该值是字符串类型，而lpop命令仅能用于List类型，因此在执行exec命令时，该命令将会失败。
    redis 127.0.0.1:6379> lpop a
    QUEUED
    #再次设置键a的值为字符串4。
    redis 127.0.0.1:6379> set a 4
    QUEUED
    #获取键a的值，以便确认该值是否被事务中的第二个set命令设置成功。
    redis 127.0.0.1:6379> get a
    QUEUED
    #从结果中可以看出，事务中的第二条命令lpop执行失败，而其后的set和get命令均执行成功，这一点是Redis的事务与关系型数据库中的事务之间最为重要的差别。
    redis 127.0.0.1:6379> exec
    1) OK
    2) (error) ERR Operation against a key holding the wrong kind of value
    3) OK
    4) "4"
```

3\. 回滚事务：

```sh
    #为键t2设置一个事务执行前的值。
    redis 127.0.0.1:6379> set t2 tt
    OK
    #开启一个事务。
    redis 127.0.0.1:6379> multi
    OK
    #在事务内为该键设置一个新值。
    redis 127.0.0.1:6379> set t2 ttnew
    QUEUED
    #放弃事务。
    redis 127.0.0.1:6379> discard
    OK
    #查看键t2的值，从结果中可以看出该键的值仍为事务开始之前的值。
    redis 127.0.0.1:6379> get t2
    "tt"
```

4\. WATCH 命令和基于 CAS 的乐观锁：

在 Redis 的事务中，WATCH 命令可用于提供 CAS(check-and-set)功能。假设我们通过 WATCH 命令在事务执行之前监控了多个 Keys，倘若在 WATCH 之后有任何 Key 的值发生了变化，EXEC 命令执行的事务都将被放弃，同时返回 Null multi-bulk 应答以通知调用者事务执行失败。例如，我们再次假设 Redis 中并未提供 incr 命令来完成键值的原子性递增，如果要实现该功能，我们只能自行编写相应的代码。其伪码如下：

```sh
      val = GET mykey
      val = val + 1
      SET mykey $val
```

以上代码只有在单连接的情况下才可以保证执行结果是正确的，因为如果在同一时刻有多个客户端在同时执行该段代码，那么就会出现多线程程序中经常出现的一种错误场景--竞态争用(race condition)。比如，客户端 A 和 B 都在同一时刻读取了 mykey 的原有值，假设该值为 10，此后两个客户端又均将该值加一后 set 回 Redis 服务器，这样就会导致 mykey 的结果为 11，而不是我们认为的 12。为了解决类似的问题，我们需要借助 WATCH 命令的帮助，见如下代码：

```sh
      WATCH mykey
      val = GET mykey
      val = val + 1
      MULTI
      SET mykey $val
      EXEC
```

和此前代码不同的是，新代码在获取 mykey 的值之前先通过 WATCH 命令监控了该键，此后又将 set 命令包围在事务中，这样就可以有效的保证每个连接在执行 EXEC 之前，如果当前连接获取的 mykey 的值被其它连接的客户端修改，那么当前连接的 EXEC 命令将执行失败。这样调用者在判断返回值后就可以获悉 val 是否被重新设置成功。

### 主从复制

一、Redis 的 Replication：

这里首先需要说明的是，在 Redis 中配置 Master-Slave 模式真是太简单了。相信在阅读完这篇 Blog 之后你也可以轻松做到。这里我们还是先列出一些理论性的知识，后面给出实际操作的案例。下面的列表清楚的解释了 Redis Replication 的特点和优势。

1). 同一个 Master 可以同步多个 Slaves。

2). Slave 同样可以接受其它 Slaves 的连接和同步请求，这样可以有效的分载 Master 的同步压力。因此我们可以将 Redis 的 Replication 架构视为图结构。

3). Master Server 是以非阻塞的方式为 Slaves 提供服务。所以在 Master-Slave 同步期间，客户端仍然可以提交查询或修改请求。

4). Slave Server 同样是以非阻塞的方式完成数据同步。在同步期间，如果有客户端提交查询请求，Redis 则返回同步之前的数据。

5). 为了分载 Master 的读操作压力，Slave 服务器可以为客户端提供只读操作的服务，写服务仍然必须由 Master 来完成。即便如此，系统的伸缩性还是得到了很大的提高。

6). Master 可以将数据保存操作交给 Slaves 完成，从而避免了在 Master 中要有独立的进程来完成此操作。

二、Replication 的工作原理：

在 Slave 启动并连接到 Master 之后，它将主动发送一个 SYNC 命令。此后 Master 将启动后台存盘进程，同时收集所有接收到的用于修改数据集的命令，在后台进程执行完毕后，Master 将传送整个数据库文件到 Slave，以完成一次完全同步。而 Slave 服务器在接收到数据库文件数据之后将其存盘并加载到内存中。此后，Master 继续将所有已经收集到的修改命令，和新的修改命令依次传送给 Slaves，Slave 将在本次执行这些数据修改命令，从而达到最终的数据同步。

如果 Master 和 Slave 之间的链接出现断连现象，Slave 可以自动重连 Master，但是在连接成功之后，一次完全同步将被自动执行。

三、如何配置 Replication：

见如下步骤：

1). 同时启动两个 Redis 服务器，可以考虑在同一台机器上启动两个 Redis 服务器，分别监听不同的端口，如 6379 和 6380。

2). 在 Slave 服务器上执行一下命令：

```sh
    /> redis-cli -p 6380   #这里我们假设Slave的端口号是6380
    redis 127.0.0.1:6380> slaveof 127.0.0.1 6379 #我们假设Master和Slave在同一台主机，Master的端口为6379
    OK
```

上面的方式只是保证了在执行 slaveof 命令之后，redis_6380 成为了 redis_6379 的 slave，一旦服务(redis_6380)重新启动之后，他们之间的复制关系将终止。
如果希望长期保证这两个服务器之间的 Replication 关系，可以在 redis_6380 的配置文件中做如下修改：

```sh
    /> cd /etc/redis  #切换Redis服务器配置文件所在的目录。
    /> ls
    6379.conf  6380.conf
    /> vi 6380.conf
    将
    # slaveof <masterip> <masterport>
    改为
    slaveof 127.0.0.1 6379
```

保存退出。这样就可以保证 Redis_6380 服务程序在每次启动后都会主动建立与 Redis_6379 的 Replication 连接了。

四、应用示例：

这里我们假设 Master-Slave 已经建立。

```sh
    #启动master服务器。
    [root@Stephen-PC redis]# redis-cli -p 6379
    redis 127.0.0.1:6379>
    #情况Master当前数据库中的所有Keys。
    redis 127.0.0.1:6379> flushdb
    OK
    #在Master中创建新的Keys作为测试数据。
    redis 127.0.0.1:6379> set mykey hello
    OK
    redis 127.0.0.1:6379> set mykey2 world
    OK
    #查看Master中存在哪些Keys。
    redis 127.0.0.1:6379> keys *
    1) "mykey"
    2) "mykey2"

    #启动slave服务器。
    [root@Stephen-PC redis]# redis-cli -p 6380
    #查看Slave中的Keys是否和Master中一致，从结果看，他们是相等的。
    redis 127.0.0.1:6380> keys *
    1) "mykey"
    2) "mykey2"

    #在Master中删除其中一个测试Key，并查看删除后的结果。
    redis 127.0.0.1:6379> del mykey2
    (integer) 1
    redis 127.0.0.1:6379> keys *
    1) "mykey"

    #在Slave中查看是否mykey2也已经在Slave中被删除。
    redis 127.0.0.1:6380> keys *
    1) "mykey"
```

### 数据持久化

一、Redis 提供了哪些持久化机制：

1). RDB 持久化：

该机制是指在指定的时间间隔内将内存中的数据集快照写入磁盘。

2). AOF 持久化:

该机制将以日志的形式记录服务器所处理的每一个写操作，在 Redis 服务器启动之初会读取该文件来重新构建数据库，以保证启动后数据库中的数据是完整的。

3). 无持久化：

我们可以通过配置的方式禁用 Redis 服务器的持久化功能，这样我们就可以将 Redis 视为一个功能加强版的 memcached 了。

4). 同时应用 AOF 和 RDB。

二、RDB 机制的优势和劣势：

RDB 存在哪些优势呢？

1). 一旦采用该方式，那么你的整个 Redis 数据库将只包含一个文件，这对于文件备份而言是非常完美的。比如，你可能打算每个小时归档一次最近 24 小时的数据，同时还要每天归档一次最近 30 天的数据。通过这样的备份策略，一旦系统出现灾难性故障，我们可以非常容易的进行恢复。

2). 对于灾难恢复而言，RDB 是非常不错的选择。因为我们可以非常轻松的将一个单独的文件压缩后再转移到其它存储介质上。

3). 性能最大化。对于 Redis 的服务进程而言，在开始持久化时，它唯一需要做的只是 fork 出子进程，之后再由子进程完成这些持久化的工作，这样就可以极大的避免服务进程执行 IO 操作了。

4). 相比于 AOF 机制，如果数据集很大，RDB 的启动效率会更高。

RDB 又存在哪些劣势呢？

1). 如果你想保证数据的高可用性，即最大限度的避免数据丢失，那么 RDB 将不是一个很好的选择。因为系统一旦在定时持久化之前出现宕机现象，此前没有来得及写入磁盘的数据都将丢失。

2). 由于 RDB 是通过 fork 子进程来协助完成数据持久化工作的，因此，如果当数据集较大时，可能会导致整个服务器停止服务几百毫秒，甚至是 1 秒钟。

三、AOF 机制的优势和劣势：

AOF 的优势有哪些呢？

1). 该机制可以带来更高的数据安全性，即数据持久性。Redis 中提供了 3 中同步策略，即每秒同步、每修改同步和不同步。事实上，每秒同步也是异步完成的，其效率也是非常高的，所差的是一旦系统出现宕机现象，那么这一秒钟之内修改的数据将会丢失。而每修改同步，我们可以将其视为同步持久化，即每次发生的数据变化都会被立即记录到磁盘中。可以预见，这种方式在效率上是最低的。至于无同步，无需多言，我想大家都能正确的理解它。

2). 由于该机制对日志文件的写入操作采用的是 append 模式，因此在写入过程中即使出现宕机现象，也不会破坏日志文件中已经存在的内容。然而如果我们本次操作只是写入了一半数据就出现了系统崩溃问题，不用担心，在 Redis 下一次启动之前，我们可以通过 redis-check-aof 工具来帮助我们解决数据一致性的问题。

3). 如果日志过大，Redis 可以自动启用 rewrite 机制。即 Redis 以 append 模式不断的将修改数据写入到老的磁盘文件中，同时 Redis 还会创建一个新的文件用于记录此期间有哪些修改命令被执行。因此在进行 rewrite 切换时可以更好的保证数据安全性。

4). AOF 包含一个格式清晰、易于理解的日志文件用于记录所有的修改操作。事实上，我们也可以通过该文件完成数据的重建。

AOF 的劣势有哪些呢？

1). 对于相同数量的数据集而言，AOF 文件通常要大于 RDB 文件。

2). 根据同步策略的不同，AOF 在运行效率上往往会慢于 RDB。总之，每秒同步策略的效率是比较高的，同步禁用策略的效率和 RDB 一样高效。

四、其它：

1\. Snapshotting:

缺省情况下，Redis 会将数据集的快照 dump 到 dump.rdb 文件中。此外，我们也可以通过配置文件来修改 Redis 服务器 dump 快照的频率，在打开 6379.conf 文件之后，我们搜索 save，可以看到下面的配置信息：

```sh
    save 900 1              #在900秒(15分钟)之后，如果至少有1个key发生变化，则dump内存快照。
    save 300 10            #在300秒(5分钟)之后，如果至少有10个key发生变化，则dump内存快照。
    save 60 10000        #在60秒(1分钟)之后，如果至少有10000个key发生变化，则dump内存快照。
```

2\. Dump 快照的机制：

```sh
    1). Redis先fork子进程。
    2). 子进程将快照数据写入到临时RDB文件中。
    3). 当子进程完成数据写入操作后，再用临时文件替换老的文件。
```

3\. AOF 文件：

上面已经多次讲过，RDB 的快照定时 dump 机制无法保证很好的数据持久性。如果我们的应用确实非常关注此点，我们可以考虑使用 Redis 中的 AOF 机制。对于 Redis 服务器而言，其缺省的机制是 RDB，如果需要使用 AOF，则需要修改配置文件中的以下条目：
将**appendonly no 改为 appendonly yes**
从现在起，Redis 在每一次接收到数据修改的命令之后，都会将其追加到 AOF 文件中。在 Redis 下一次重新启动时，需要加载 AOF 文件中的信息来构建最新的数据到内存中。

4\. AOF 的配置：

在 Redis 的配置文件中存在三种同步方式，它们分别是：

```sh
    appendfsync always     #每次有数据修改发生时都会写入AOF文件。
    appendfsync everysec  #每秒钟同步一次，该策略为AOF的缺省策略。
    appendfsync no          #从不同步。高效但是数据不会被持久化。
```

5\. 如何修复坏损的 AOF 文件：

```sh
1). 将现有已经坏损的AOF文件额外拷贝出来一份。
2). 执行"redis-check-aof --fix <filename>"命令来修复坏损的AOF文件。
3). 用修复后的AOF文件重新启动Redis服务器。
```

6\. Redis 的数据备份：

在 Redis 中我们可以通过 copy 的方式在线备份正在运行的 Redis 数据文件。这是因为 RDB 文件一旦被生成之后就不会再被修改。Redis 每次都是将最新的数据 dump 到一个临时文件中，之后在利用 rename 函数原子性的将临时文件改名为原有的数据文件名。因此我们可以说，在任意时刻 copy 数据文件都是安全的和一致的。鉴于此，我们就可以通过创建 cron job 的方式定时备份 Redis 的数据文件，并将备份文件 copy 到安全的磁盘介质中。

### 管道

一、请求应答协议和 RTT：

Redis 是一种典型的基于 C/S 模型的 TCP 服务器。在客户端与服务器的通讯过程中，通常都是客户端率先发起请求，服务器在接收到请求后执行相应的任务，最后再将获取的数据或处理结果以应答的方式发送给客户端。在此过程中，客户端都会以阻塞的方式等待服务器返回的结果。见如下命令序列：

```sh
    Client: INCR X
    Server: 1
    Client: INCR X
    Server: 2
    Client: INCR X
    Server: 3
    Client: INCR X
    Server: 4
```

在每一对请求与应答的过程中，我们都不得不承受网络传输所带来的额外开销。我们通常将这种开销称为 RTT(Round Trip Time)。现在我们假设每一次请求与应答的 RTT 为 250 毫秒，而我们的服务器可以在一秒内处理 100k 的数据，可结果则是我们的服务器每秒至多处理 4 条请求。要想解决这一性能问题，我们该如何进行优化呢？

二、管线(pipelining)：

Redis 在很早的版本中就已经提供了对命令管线的支持。在给出具体解释之前，我们先将上面的同步应答方式的例子改造为基于命令管线的异步应答方式，这样可以让大家有一个更好的感性认识。

```sh
    Client: INCR X
    Client: INCR X
    Client: INCR X
    Client: INCR X
    Server: 1
    Server: 2
    Server: 3
    Server: 4
```

从以上示例可以看出，客户端在发送命令之后，不用立刻等待来自服务器的应答，而是可以继续发送后面的命令。在命令发送完毕后，再一次性的读取之前所有命令的应答。这样便节省了同步方式中 RTT 的开销。
最后需要说明的是，如果 Redis 服务器发现客户端的请求是基于管线的，那么服务器端在接受到请求并处理之后，会将每条命令的应答数据存入队列，之后再发送到客户端。
