---
  title: "vue引用自定义ttf,otf在线字体"
  date: "2020-03-14 17:06:38"
  permalink: "/pages/40f29bbce96747d3"
---
### vue 引用自定义 ttf、otf、在线字体

#### 1. 将下载好的字体放到本地目录

分别是两种字体
![在这里插入图片描述](https://chatflow-files-cdn-1256085166.file.myqcloud.com/2018101123140241.png)

放到项目的 `assets` 目录中
![在这里插入图片描述](https://chatflow-files-cdn-1256085166.file.myqcloud.com/20181011231505484.png)

#### 2. 引入字体文件

首先创建一个 `styles` 文件夹，之后也可以用于存放一些公共的样式文件。再新建一个 `index.less` 文件，引入字体。
![在这里插入图片描述](https://chatflow-files-cdn-1256085166.file.myqcloud.com/20181011232447610.png)

```css
@font-face {
  font-family: Snickles;
  src: url("../assets/Snickles-webfont.ttf");
}
@font-face {
  font-family: Ronda;
  src: url("../assets/RondaITCbyBT-Roman.otf");
}
```

#### 3. 在项目中（main.js）引入刚刚加载进来的字体

![在这里插入图片描述](https://chatflow-files-cdn-1256085166.file.myqcloud.com/20181011232048180.png)

#### 4. 测试

![在这里插入图片描述](https://chatflow-files-cdn-1256085166.file.myqcloud.com/20181011232301318.png)
效果图：
![在这里插入图片描述](https://chatflow-files-cdn-1256085166.file.myqcloud.com/20181011232355373.png)

![在这里插入图片描述](https://chatflow-files-cdn-1256085166.file.myqcloud.com/20181011232510368.png)

效果图：
![在这里插入图片描述](https://chatflow-files-cdn-1256085166.file.myqcloud.com/20181011232534170.png)

#### 5. Happy Coding!
