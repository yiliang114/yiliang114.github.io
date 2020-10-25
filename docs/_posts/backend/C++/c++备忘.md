---
title: 'c++备忘'
draft: true
---

- c++ 中单引号和双引号不一样，字符和字符串一定要用双引号。

- strlen 包含在 string.h 头文件里,加上 #include <string.h>。

### c++ 中获取数组的长度

strlen 同样也可以用于 C++的 string。但是需要用 c_str()将 C++ string 转换为 char\*类型。

sizeof(int a[2])返回声明的长度。
strlen(str) 返回数组中真实的长度。

```c
char str[5] = {1,2,3,4};
string b = "hello";
cout<<b.length()<<endl;
cout<<b.size()<<endl;
cout << strlen(b.c_str()) << endl;

cout<<strlen(str)<<endl;
cout<<sizeof(str)<<endl;

//
5
5
5
4
5
```

#### string

string 和 char 数组 都能直接通过下标访问

```c
char str[]="Hello";
string b = "hello";

cout<<strlen(str)<<endl;
cout<<sizeof(str)<<endl;
cout<<b[1]<<endl;
cout<<b.c_str()[1]<<endl;
```
