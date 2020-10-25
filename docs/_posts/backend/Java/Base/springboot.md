---
title: '数据库系统原理'
draft: true
---

# Spring Boot

## 起步

### Maven 依赖

### Spring Boot 父级依赖

```
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>1.5.1.RELEASE</version>
    <relativePath/> <!-- lookup parent from repository -->
</parent>
```

这块配置就是 spring boot 父级依赖，有了这个，当前项目就是 spring boot 项目了。 `spring-boot-starter-parent` 是一个特殊的 starter， 它用来提供相关 maven 默认依赖，使用它之后，常用的包依赖可以省去 version 标签。

#### 起步依赖 spring-boot-starter-xx

spring boot 提供了很多“开箱即用” 的依赖模块，都是以 `spring-boot-starter-xx`命名的。起步依赖自动封装好了想要实现的功能的依赖。就比如需要实现 web 功能，引入了`spring-boot-starter-web`这个起步依赖。

#### spring-boot-maven 插件

```
	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>
```

上面的配置就是 spring boot maven 插件，提供了功能：

- 把项目打包成一个可执行的超级 jar（user-JAR），包括应用程序的所有依赖打入 JAR 文件内，并为 JAR 添加一个描述文件，其中的内容能用 java -jar 来运行应用程序。

- 搜索 `public static void main()`方法来标记可运行类。

  ​

### 注解

要使用一下几个注解，需要 maven 输入：

```
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
```

#### RestController

```
import org.springframework.web.bind.annotation.RestController;
```

#### RequestMapping

```
import org.springframework.web.bind.annotation.RequestMapping;
```

```
	// 请求路由map
	@RequestMapping("/")
	public  String index() {
		return "hello Spring Boot";
	}
```

### 应用入口类

```
package com.yiliang.fileManagementSystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
public class FileManagementSystemApplication {

    // 被注释的方法最后都会输出json
	@RequestMapping("/")
	public  String index() {
		return "hello Spring Boot";
	}

	public static void main(String[] args) {
		SpringApplication.run(FileManagementSystemApplication.class, args);
	}
}

```

1. `@SpringBootApplication`是`Spring Boot`项目的核心注解，主要目的是开启自动配置。

2. `main` 方法表明这是一个标准的 java 应用的 main 方法，主要作用是作为项目启动的入口。

3. `@ResetController` 注解等价于 `@Controller`+`@ResponseBody` 的结合，使用这个注解的类里面的方法都以 json 格式输出。

   ​

## 配置文件解析

spring boot 使用 “习惯优于配置” （项目中存在大量的配置，此外还内置了一个习惯性的配置，让你无需手动进行配置）的理念让项目能够快速运行起来。所以，要想把 spring boot 玩的溜， 就要懂得如何开启各个功能模块的默认配置，这就需要了解 spring boot 的配置文件 `application.properties`。

spring boot 使用了一个全局的配置文件`application.propertites`， 放在 `src/main/resources` 目录中，这个文件的作用是对一些默认配置的配置值进行修改。

如果项目中没有`application.propertites`, 那就需要在 `src/main/resources`目录中新建一个。

### 自定义属性

`application.propertites` 提供自定义属性的支持，在这里可以定义一些常用的配置值：

```

```

## spring 启动原理

开发任何一个 spring boot 项目，都会用到如下的启动类：

```
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

上述代码与一般 java 代码最大的区别在于 Annotation(注解):

- SpringBootApplication
- SpringApplication.run

### SpringBootApplication

```
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = {
        @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
        @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {
...
}
```

虽然定义了多个 Annotation 进行了员信息标注，但实际上重要的只有三个 Annotation：

- @Configuration （@SpringBootConfiguration 点开查看发现里面还是应用了@Configuration）
- @EnableAutoConfiguration
- @ComponentScan

所以如果我们使用如下的 SpringBoot 启动类，整个应用依然可以与之前的启动类功能对等：

```
@Configuration
@EnableAutoConfiguration
@ComponentScan
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

但是每次都写三个比较类，所以写一个 `@SpringBootApplication` 方便点。接下来详细介绍这三个 Annotation。

#### @Configuration 配置

这里的 @Configuration 就是 JavaConfig 形式的 Spring Ioc 容器的配置类使用的 @Configuration， SpringBoot 社区推荐使用基于 JavaConfig 的配置形式，所以这里的启动类标注了 @Configuration 之后，本身其实也还是一个 IoC 容器的配置类。

- 表达形式层面

  基于 JavaConfig 的配置方式：

  ```
  @Configuration
  public class MockConfiguration{
      //bean定义
  }
  ```

  任何一个标注了 @Configuration 的 Java 类定义都是一个 JavaConfig 配置类。

- 注册 bean 定义层面

  基于 JavaConfig 的配置形式：

  ```
  @Configuration
  public class MockConfiguration{
      @Bean
      public MockService mockService(){
          return new MockServiceImpl();
      }
  }
  ```

  任何一个标注了 @Bean 的方法，其返回值将作为一个 bean 定义注册到 Spring 的 IoC 容器，方法名将默认成该 bean 定义的 id。

- 表达依赖注入关系层面

  基于 JavaConfig 的配置形式：

  ```
  @Configuration
  public class MockConfiguration{
      @Bean
      public MockService mockService(){
          return new MockServiceImpl(dependencyService());
      }

      @Bean
      public DependencyService dependencyService(){
          return new DependencyServiceImpl();
      }
  }
  ```

  如果一个 bean 的定义依赖其他 bean,则直接调用对应的 JavaConfig 类中依赖 bean 的创建方法就可以了。

### ComponentScan

@ComponentScan 这个注解在 spring 中很重要，它对应 XML 配置中的元素，@ComponentScan 的功能其实就是 自动扫描并加载符合条件的组件（比如@ComponentScan 和 @Repository 等） 或者 bean 的定义，最终将这些 bean 定义加载到 IoC 容器中。

### EnableAutoConfiguration

@EnableAutoConfiguration 借助 @import 的支持， 将所有符合自动配置条件的 bean 定义加载到 IoC 容器。

## spring boot 创建 restful api

### 数据库

### maven 依赖

maven 国内镜像

https://www.cnblogs.com/xiongxx/p/6057558.html

### 目录结构

- com.yiliang.web: Controller 层
- com.yiliang.dao: 数据操作层 DAO
- com.yiliang.bean: 实体类
- com.yiliang.service : 业务逻辑层
- application.properties: 应用配置文件，应用启动会自动读取配置

### 报错

- annotation are not allowed here

  ```
      @RequestMapping(value="/userAge", method = RequestMethod.GET);
      public User findUserByAge(@RequestParam(value = "userAge", required = true) int userAge) {
          System.out.println("开始查询。。。");
          return userService.findUserByAge(userAge);
      }
  ```

  注解后不能加分号。

- Whitelabel Error Page

  主要是目录结构的问题。程序只加载 Application.java 所在包及其子包下的内容。

  https://www.cnblogs.com/JealousGirl/p/whitelabel.html

- Could not autowire. No beans of 'UserDao' type found. less... (Ctrl F1)

  解决方法如下，在 Intellij Idea 中设置一下：

  **Settings - Editor - Inspections - Spring - Spring Core - Code - Autowiring for Bean Class - disable（idea2017 好像是把 √ 去掉）**

  但是其实不是很明白为什么它会下划线报错？？？

## 入门博客

https://blog.csdn.net/winter_chen001/article/details/77249029

https://blog.csdn.net/xiaoyu411502/article/details/48164311

https://blog.csdn.net/qazwsxpcm/article/details/79028689

## 优点和缺点

spring boot 的优点快速开发，特别适合构建微服务系统，另外为我们封装了各种经常使用的套件，比如 mybatis, hibernate， redis， mongodb 等。

### 特性

- 使用 spring boot 项目引导页面可以在几秒构建一个项目
- 方便对外输出各种形式的服务，如 REST API、WebSocket、Web、Streaming、Tasks
- 非常简洁的安全策略集成
- 支持关系数据库和非关系数据库
- 支持运行期内嵌容器，如 Tomcat、Jetty
- 强大的开发包，支持热启动
- 自动管理依赖
- 自带应用监控

### 搭建项目步骤

在开发一个 api 项目之前，搭建项目、引入依赖、配置框架这些基础活。通常为了加快项目的开发进度，还需要封装一些常用的类和工具，比如统一的响应结果封装、统一的异常处理、接口签名认证、基础的增删改查方法封装、基础代码生成工具等等。

#### idea 快捷键

快速生成 DAO 文件的 get ， set 以及构造函数，Alt + Insert
