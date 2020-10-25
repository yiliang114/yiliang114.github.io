---
title: '数据库系统原理'
draft: true
---

## Json 解析工具 Jackson 的注解

@JsonIgnoreProperties

此注解是类注解，作用是 json 序列化时将 Java bean 中的一些属性忽略掉，序列化和反序列化都受影响。

@JsonIgnore

此注解用于属性或者方法上（最好是属性上），作用和上面的@JsonIgnoreProperties 一样。

@JsonFormat

此注解用于属性或者方法上（最好是属性上），可以方便的把 Date 类型直接转化为我们想要的模式，比如@JsonFormat(pattern = "yyyy-MM-dd HH-mm-ss")

@JsonProperty

此注解用于属性上，作用是把该属性的名称序列化为另外一个名称，如把 trueName 属性序列化为 name，@JsonProperty("name")。

@JsonSerialize

此注解用于属性或者 getter 方法上，用于在序列化时嵌入我们自定义的代码，比如序列化一个 double 时在其后面限制两位小数点。

@JsonDeserialize

此注解用于属性或者 setter 方法上，用于在反序列化时可以嵌入我们自定义的代码，类似于上面的@JsonSerialize

@JsonInclude(Include.NON_NULL)
//将该标记放在属性上，如果该属性为 NULL 则不参与序列化
//如果放在类上边,那对这个类的全部属性起作用

其他可选项

```
//Include.ALWAYS 默认
//Include.NON_DEFAULT 属性为默认值不序列化
//Include.NON_EMPTY 属性为 空（“”） 或者为 NULL 都不序列化
//Include.NON_NULL 属性为NULL 不序列化
```
