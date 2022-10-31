---
title: Sequelize
date: '2020-10-26'
draft: true
---

### Sequelize

https://github.com/demopark/sequelize-docs-Zh-CN
https://itbilu.com/nodejs/npm/VkYIaRPz-.html#api-instance-method
https://segmentfault.com/a/1190000007775553

https://blog.csdn.net/alex_my/article/details/83062458
中文：
https://demopark.github.io/sequelize-docs-Zh-CN/migrations.html

### Sequelize 增删改查

https://blog.csdn.net/qq328691560/article/details/50564697

修改已存在的数据库表：

https://cnodejs.org/topic/5a31e43d9807389a1809f39c

文档：

http://www.nodeclass.com/api/sequelize.html

查询条件：

https://itbilu.com/nodejs/npm/VJIR1CjMb.html

创建记录

```
User.create({
    userId: 23,
    userName: '老杨',
    updateTime: '2016-01-22 18:37:22'
});
```

修改记录

```
var pram={'userName':'晓博'};

user.update(

    pram,{

            'where':{'userId':{eq:23}}
}
);//将userId等于23的userName改为'晓博'

```

删除记录

```
user.destroy({'where':{'id':{eq:23}}});//将表内
userId等于23的元组删除
```
