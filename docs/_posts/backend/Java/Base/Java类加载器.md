---
title: '数据库系统原理'
draft: true
---

## 类装载器 ClassLoader

### 类装载器工作机制

类装载器就是寻找类的节码文件并构造出类在 JVM 内部表示对象的组件。在 Java 中，类装载器把一个类装入 JVM 中，要经过以下步骤：

[1.]装载：查找和导入 Class 文件；
[2.]链接：执行校验、准备和解析步骤，其中解析步骤是可以选择的：
[2.1]校验：检查载入 Class 文件数据的正确性；
[2.2]准备：给类的静态变量分配存储空间；
[2.3]解析：将符号引用转成直接引用；
[3.]初始化：对类的静态变量、静态代码块执行初始化工作。

类装载工作由 ClassLoader 及其子类负责，ClassLoader 是一个重要的 Java 运行时系统组件，它负责在运行时查找和装入 Class 字节码文件。JVM 在运行时会产生三个 ClassLoader：根装载器、ExtClassLoader（扩展类装载器）和 AppClassLoader（系统类装载器）。其中，根装载器不是 ClassLoader 的子类，它使用 C++编写，因此我们在 Java 中看不到它，根装载器负责装载 JRE 的核心类库，如 JRE 目标下的 rt.jar、charsets.jar 等。ExtClassLoader 和 AppClassLoader 都是 ClassLoader 的子类。其中 ExtClassLoader 负责装载 JRE 扩展目录 ext 中的 JAR 类包；AppClassLoader 负责装载 Classpath 路径下的类包。

这三个类装载器之间存在父子层级关系，即根装载器是 ExtClassLoader 的父装载器，ExtClassLoader 是 AppClassLoader 的父装载器。默认情况下，使用 AppClassLoader 装载应用程序的类，我们可以做一个实验：

```java
public class ClassLoaderTest {
	public static void main(String[] args) {
		ClassLoader loader = Thread.currentThread().getContextClassLoader();
		System.out.println("current loader:"+loader);
		System.out.println("parent loader:"+loader.getParent());
		System.out.println("grandparent loader:"+loader.getParent(). getParent());
	}
}
```

运行以上代码，在控制台上将打出以下信息：

```sh
current loader:sun.misc.Launcher$AppClassLoader@131f71a
parent loader:sun.misc.Launcher$ExtClassLoader@15601ea
//①根装载器在Java中访问不到，所以返回null
grandparent loader:null
```

通过以上的输出信息，我们知道当前的 ClassLoader 是 AppClassLoader，父 ClassLoader 是 ExtClassLoader，祖父 ClassLoader 是根类装载器，因为在 Java 中无法获得它的句柄，所以仅返回 null。

JVM 装载类时使用“全盘负责委托机制”，“全盘负责”是指当一个 ClassLoader 装载一个类的时，除非显式地使用另一个 ClassLoader，该类所依赖及引用的类也由这个 ClassLoader 载入；“委托机制”是指先委托父装载器寻找目标类，只有在找不到的情况下才从自己的类路径中查找并装载目标类。这一点是从安全角度考虑的，试想如果有人编写了一个恶意的基础类（如 java.lang.String）并装载到 JVM 中将会引起多么可怕的后果。但是由于有了“全盘负责委托机制”，java.lang.String 永远是由根装载器来装载的，这样就避免了上述事件的发生。

### ClassLoader 重要方法

在 Java 中，ClassLoader 是一个抽象类，位于 java.lang 包中。下面对该类的一些重要接口方法进行介绍：

- `Class loadClass(String name)`
  name 参数指定类装载器需要装载类的名字，必须使用全限定类名，如 com.baobaotao. beans.Car。该方法有一个重载方法 loadClass(String name ,boolean resolve)，resolve 参数告诉类装载器是否需要解析该类。在初始化类之前，应考虑进行类解析的工作，但并不是所有的类都需要解析，如果 JVM 只需要知道该类是否存在或找出该类的超类，那么就不需要进行解析。
- `Class defineClass(String name, byte[] b, int off, int len)`
  将类文件的字节数组转换成 JVM 内部的 java.lang.Class 对象。字节数组可以从本地文件系统、远程网络获取。name 为字节数组对应的全限定类名。
- `Class findSystemClass(String name)`
  从本地文件系统载入 Class 文件，如果本地文件系统不存在该 Class 文件，将抛出 ClassNotFoundException 异常。该方法是 JVM 默认使用的装载机制。
- `Class findLoadedClass(String name)`
  调用该方法来查看 ClassLoader 是否已装入某个类。如果已装入，那么返回 java.lang.Class 对象，否则返回 null。如果强行装载已存在的类，将会抛出链接错误。
- `ClassLoader getParent()`
  获取类装载器的父装载器，除根装载器外，所有的类装载器都有且仅有一个父装载器，ExtClassLoader 的父装载器是根装载器，因为根装载器非 Java 编写，所以无法获得，将返回 null。

除 JVM 默认的三个 ClassLoader 以外，可以编写自己的第三方类装载器，以实现一些特殊的需求。类文件被装载并解析后，在 JVM 内将拥有一个对应的 java.lang.Class 类描述对象，该类的实例都拥有指向这个类描述对象的引用，而类描述对象又拥有指向关联 ClassLoader 的引用，如图所示。

![](http://i.imgur.com/HuLuFXD.png)

每一个类在 JVM 中都拥有一个对应的 java.lang.Class 对象，它提供了类结构信息的描述。数组、枚举、注解以及基本 Java 类型（如 int、double 等），甚至 void 都拥有对应的 Class 对象。Class 没有 public 的构造方法。Class 对象是在装载类时由 JVM 通过调用类装载器中的 defineClass()方法自动构造的。

### 类的初始化

类什么时候才被初始化

1. 创建类的实例，也就是 new 一个对象
2. 访问某个类或接口的静态变量，或者对该静态变量赋值
3. 调用类的静态方法
4. 反射（Class.forName("com.lyj.load")）
5. 初始化一个类的子类（会首先初始化子类的父类）
6. JVM 启动时标明的启动类，即文件名和类名相同的那个类

只有这 6 中情况才会导致类的类的初始化。

类的初始化步骤：

1. 如果这个类还没有被加载和链接，那先进行加载和链接
2. 假如这个类存在直接父类，并且这个类还没有被初始化（注意：在一个类加载器中，类只能初始化一次），那就初始化直接的父类（不适用于接口）
3. 加入类中存在初始化语句（如 static 变量和 static 块），那就依次执行这些初始化语句。
