---
layout: Redis
title: 应用
date: 2022-05-31
aside: false
draft: true
---

# Redis

## API

### 过期时间

https://notes.jindll.com/node/egg-redis%E5%B8%B8%E7%94%A8api.html#%E5%8A%9F%E8%83%BD

### [](https://notes.jindll.com/node/egg-redis%E5%B8%B8%E7%94%A8api.html#%E5%AD%98%E5%8D%95%E4%B8%AA%E5%80%BC)存单个值

```js
redis.set(key, value, expiryMode, time);
```

expiryMode

- `EX` 过期时间单位是秒
- `PX` 过期时间单位是分钟

### set & get

```js
// 获取redis对象
let { app } = this;
const YDYRedis = app.redis.get('ydy');
// 测试数据
let bb = { aaa: ['afdas', 'asdfasdf'], vvv: { a: 'adfa', b: { c: 'asdf' } } };
let timeStr = JSON.stringify(bb);
// 设置缓存key
const redisKey = 'test-redis';
// 设置过期时间：秒
const expireTime = 20;

let aa = await YDYRedis.get(redisKey);
if (aa) {
  aa = JSON.parse(aa);
  return aa;
} else {
  await YDYRedis.set(redisKey, timeStr);
  await YDYRedis.expire(redisKey, expireTime);
  timeStr = JSON.parse(timeStr);
  return timeStr;
}
```

### hset & hget

```js
// 获取redis对象
let { app } = this;
const YDYRedis = app.redis.get('ydy');
// 测试数据
let bb = { aaa: ['afdas', 'asdfasdf'], vvv: { a: 'adfa', b: { c: 'asdf' } } };
let timeStr = JSON.stringify(bb);

// 设置Key
const redisKey = 'test-redis';

// 设置field
const fieldName = 'time-one';

// 设置过期时间
const expireTime = 20;

let aa = await YDYRedis.hget(redisKey, fieldName);
if (aa) {
  aa = JSON.parse(aa);
  return aa;
} else {
  await YDYRedis.hset(redisKey, fieldName, timeStr);
  await YDYRedis.expire(redisKey, expireTime);
  timeStr = JSON.parse(timeStr);
  return timeStr;
}
```

## 命令行

- redis-server 启动
- redis-cli 进入命令行控制
  - FLUSHALL 清理全部缓存
  - 查看所有的 key: keys \*
  - 普通设置： set key value
  - 设置并加过期时间： set key value EX 30 表示 30 秒后过期
  - 获取数据： get key
  - 删除指定数据： del key
  - 删除全部数据: flushall
  - 查看类型： type key
  - 设置过期时间: expire key 20 表示指定的 key5 秒后过期

## Error

### ERR value is not an integer or out of range

```js
redis.set(key, value, expiryMode, time);
```

expiryMode 值给错。

### 连接错误：MISCONF Redis is configured to save RDB snapshots，即 redis 无法向磁盘写入 RDB 的报错

一种是通过 redis 命令行修改，这种方式方便，直接，更改后直接生效，解决问题。

命令行修改方式示例：

```
127.0.0.1:6379> config set stop-writes-on-bgsave-error no
```

另一种是直接修改 redis.conf 配置文件，但是更改后需要重启 redis。

修改 redis.conf 文件：

vi 打开 redis-server 配置的 redis.conf 文件，然后使用快捷匹配模式：

```
/stop-writes-on-bgsave-error
```

定位到 stop-writes-on-bgsave-error 字符串所在位置，接着把后面的 yes 设置为 no
