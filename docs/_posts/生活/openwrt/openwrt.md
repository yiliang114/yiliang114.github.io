---
title: openwrt
date: 2023-08-19
draft: true
---

# openwrt

## OPKG 配置

根据自己的路由器 CPU 架构而定

```
src/gz openwrt_core https://mirrors.aliyun.com/openwrt/releases/22.03.1/targets/x86/64/packages
src/gz openwrt_base https://mirrors.aliyun.com/openwrt/releases/22.03.1/packages/mipsel_24kc/base
src/gz openwrt_luci https://mirrors.aliyun.com/openwrt/releases/22.03.1/packages/mipsel_24kc/luci
src/gz openwrt_packages https://mirrors.aliyun.com/openwrt/releases/22.03.1/packages/mipsel_24kc/packages
src/gz openwrt_routing https://mirrors.aliyun.com/openwrt/releases/22.03.1/packages/mipsel_24kc/routing
src/gz openwrt_telephony https://mirrors.aliyun.com/openwrt/releases/22.03.1/packages/mipsel_24kc/telephony

```

## 软件

### 1. 阿里云 webdav

> https://www.ilovn.com/2022/04/12/infuse-with-alipan-use-webdav/

github 主页：https://github.com/messense/aliyundrive-webdav

下载和安装的应用：（也需要根据自己的 CPU 架构而定）

不清楚 CPU 架构类型可通过运行 `opkg print-architecture` 命令查询。

```
wget https://github.com/messense/aliyundrive-webdav/releases/download/v2.0.5/aliyundrive-webdav_2.0.5-1_mipsel_24kc.ipk
wget https://github.com/messense/aliyundrive-webdav/releases/download/v2.0.5/luci-app-aliyundrive-webdav_2.0.5_all.ipk
wget https://github.com/messense/aliyundrive-webdav/releases/download/v2.0.5/luci-i18n-aliyundrive-webdav-zh-cn_2.0.5-1_all.ipk
opkg install aliyundrive-webdav_2.0.5-1_mipsel_24kc.ipk
opkg install luci-app-aliyundrive-webdav_2.0.5_all.ipk
opkg install luci-i18n-aliyundrive-webdav-zh-cn_2.0.5-1_all.ipk
```

github 太慢了。。。。

https://chatflow-files-cdn-1252847684.cos.ap-nanjing.myqcloud.com/test/aliyundrive-webdav_2.0.5-1_mipsel_24kc.ipk
https://chatflow-files-cdn-1252847684.cos.ap-nanjing.myqcloud.com/test/luci-app-aliyundrive-webdav_2.0.5_all.ipk
https://chatflow-files-cdn-1252847684.cos.ap-nanjing.myqcloud.com/test/luci-i18n-aliyundrive-webdav-zh-cn_2.0.5-1_all.ipk

#### 问题

Error: Invalid refresh token value found in `--refresh-token` argument

不能用 JSON.stringify() 转换了，token 的格式变了。。

### 2. openClash

## 注意点

1. 下载的软件或者资源，最好都是下载到挂载的磁盘上去，而不是在默认的磁盘上 (/overlay) 上
