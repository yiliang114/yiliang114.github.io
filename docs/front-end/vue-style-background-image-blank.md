### vue style 标签中 background-image 空白不显示

通常我们使用 `background-image` 标签时， `url` 的值无非就以下几种：
![](https://chatflow-files-cdn-1256085166.file.myqcloud.com/20181012193137547.png)
先说上面的第三种：

#### @/assets/media/hd.jpg

会提示文件不存在，编译报错

#### /assets/media/hd.jpg

不会提示报错，但是实际在开发页面不会显示图片。（对，其实就是加载不到图片吧。。。具体原因未知）

#### ../../../assets/media/hd.jpg

这种是我目前使用的，虽然相对路径在书写上比较麻烦，但是可以正确显示。也不需要像其他人博客里介绍的那样，通过 data 设置一个 url 值，再通过`:style="xxxx"` 在 `template` 标签上写动态的内敛样式。

#### /static/media/hd.jpg

推荐这种， 静态资源一般都需要存放到 static 目录下。
