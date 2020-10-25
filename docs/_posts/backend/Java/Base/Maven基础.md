---
title: '数据库系统原理'
draft: true
---

## Maven 基础

### 1.什么是 maven?

Maven:基于项目对象模型 pom 的项目管理工具

### 2.常用命令

```
mvn compile 编译
mvn test 测试
mvn package 打包
mvn clean 删除target目录
mvn install 安装Jar包到本地仓库
mvn archetype:generate 自动建立项目骨架
```

### 3.目录结构

1. src-main-java
2. src-test-java
3. src-main-resources
4. src-test-resources
5. target
6. pom.xml

### 4.仓库

- 本地仓库（用户的本地仓库）
- 中央仓库（Maven 的中央仓库）
- 镜像仓库（Mirrors 镜像仓库，在 settings.xml 中配置）

### 5.怎么向本地仓库导入官方仓库没有的 Jar 包

**注:简单复制是不可行的。**
正确方法是执行 cmd 命令：

```xml
mvn install:install file
-DgroupId=包名
-DartifactId=项目名
-Dversion=版本号
-Dpackage=Jar
-Dfile=文件路径
```

**一个简单的例子**
e.g.

```xml
mvn install:install file
-DgroupId=com.tinymood
-DartifactId=tinymood-core
-Dversion=1.0.0
-Dpackage=Jar
-Dfile=D:\lib\tinymood-core-1.0.0.jar
```

**pom.xml 中引用**

```xml
<dependency>
    <groupId>com.tinymood</groupId>
    <artifactId>tinymood-core</artifactId>
    <version>1.0.0</version>
</dependency>
```
