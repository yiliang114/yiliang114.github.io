---
title: '数据库系统原理'
draft: true
---

# java

### list

取值：

```
for(int i=0;i<list.size();i++)
{
	System.out.println(list.get(i));
}
```

java 中 list 取前几条数据：

```
List newList = list.subList(start, end);

 start,end分别是第几个到第几个。
```

过滤操作：

```
//过滤出符合条件的数据
List<Apple> filterList = appleList.stream().filter(a -> a.getName().equals("香蕉")).collect(Collectors.toList());

System.err.println("filterList:"+filterList);
[Apple{id=2, name='香蕉', money=2.89, num=30}]
```

### Java 在字符串中查找匹配的子字符串

https://blog.csdn.net/taotao12312/article/details/71330815

### spring boot

#### post

post 这样可以直接拿到传参的 对象。

```
    @RequestMapping(value="/addUser", method = RequestMethod.POST)
    public boolean addUser(User user) {
      System.out.println("开始新增。。。");
      System.out.println(user);
      return userService.addUser(user);
    }
```

### tomcat 热部署

https://blog.csdn.net/liuzhigang828/article/details/72875190

### SpringBoot 获取不到 PUT 方式提交的参数的问题

需要带上 `@RequestBody`， 虽然有的时候不带 postman 也能接受到，但是 axios 接受不带数据。

```
@RequestMapping(value = "/addElement", method = RequestMethod.POST)
public ResponseResult addElement(@RequestBody Element element) {
  System.out.println("开始新增。。。");
  return ResultUtil.success(elementService.addElement(element));
}
```

### springboot postman 调试注意事项

类似如下的 java 方法中用到了 RequestParam， 从请求 url 中去获取参数的请求。

```
  @RequestMapping(value = "/deleteElement", method = RequestMethod.DELETE)
  public ResponseResult deleteElement(@RequestParam(value = "id", required = true) int id) {
    System.out.println("开始删除。。。");
    return ResultUtil.success(elementService.deleteElement(id));
  }
```

controller 中类似如下 java 方法中用到了 @RequestBody 的请求，按照字面意思来说，springboot 接受到请求之后获取请求中的参数，获得的是一个 Element 的一个对象，换言之，请求中的参数要是一个 json，因此 `contentType : 'application/json'`, 并且 Body 要选用 row。

```
  @RequestMapping(value = "/updateELement", method = RequestMethod.PUT)
  public ResponseResult updateELement(@RequestBody Element element) {
    System.out.println("开始更新。。。");
    System.out.println(element.getName()+" "+element.getId());
    boolean result = elementService.updateELement(element);
    if(result) {
      return ResultUtil.success(result);
    } else {
      return ResultUtil.error(result,"访问出错");
    }
  }
```

**换言之，前端 http 请求数据，contentType 默认是 json，因此可以直接 post 时带一个对象。当然也有很多请求是将对象 stringify 一下转化成 字符串的，但是在 java controller 层面还要再次解析才能获得数据。**

### java list 循环

https://www.cnblogs.com/lzq198754/p/5774593.html

**todo**

查找一下 postman 中 form-data 和 x-www-form-urlencoded 以及 row 的区别
