/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "0e77278937e56e5ea3fc847e3c9f7725"
  },
  {
    "url": "assets/css/0.styles.63940afe.css",
    "revision": "2df407ceb2e5f1316153c2bf0bd2936a"
  },
  {
    "url": "assets/images/avatar.jpg",
    "revision": "285fc8775b843a1dc6d3c2bcab485410"
  },
  {
    "url": "assets/images/wechat.jpeg",
    "revision": "e82ac7827dc25439d4bb95a6eae767ae"
  },
  {
    "url": "assets/js/10.9a756169.js",
    "revision": "84b306f597ab8c346dd4d0ef3643da47"
  },
  {
    "url": "assets/js/11.85f8dab7.js",
    "revision": "72a3e00577486069cc211372e46e3104"
  },
  {
    "url": "assets/js/12.b4cc6c17.js",
    "revision": "99c4cdcd2d4807860a67337e664ac0c8"
  },
  {
    "url": "assets/js/13.fbfbe27e.js",
    "revision": "209cab5963600899bddb90130d1a21a5"
  },
  {
    "url": "assets/js/14.dd96edfa.js",
    "revision": "238a5fba1da0864bb5a8d3ca7b93326b"
  },
  {
    "url": "assets/js/15.55718840.js",
    "revision": "0d1ef63fb07bf0729a16dcd1bdcc508d"
  },
  {
    "url": "assets/js/16.73f8e254.js",
    "revision": "11d3f02f0d85a63c5a668b3bea450069"
  },
  {
    "url": "assets/js/17.9f60deb8.js",
    "revision": "bbaa214888c9d0f812f9943f186a3757"
  },
  {
    "url": "assets/js/18.ac011fe0.js",
    "revision": "58cb7786b73d6569e3b4b94da1cd5bd0"
  },
  {
    "url": "assets/js/19.495fea85.js",
    "revision": "a088467c30807913ecf13770fadfa742"
  },
  {
    "url": "assets/js/20.b94e8387.js",
    "revision": "14efbe46a3f7132f7f8bf0319caffe91"
  },
  {
    "url": "assets/js/21.a899318f.js",
    "revision": "502c35c84810f5d937a2d518436de8ff"
  },
  {
    "url": "assets/js/22.8e8c9ab8.js",
    "revision": "63a84b8d92bcbb0ea4ae754cc4961731"
  },
  {
    "url": "assets/js/23.635fbb1c.js",
    "revision": "e1454575bdf27fdccfcaa94d42e229fe"
  },
  {
    "url": "assets/js/24.2c7afe79.js",
    "revision": "4a25025f549b6b4fde30e5bd7b7c590e"
  },
  {
    "url": "assets/js/25.4a17c9ae.js",
    "revision": "92be6ed83634cc0ef5378783ca5f3ec7"
  },
  {
    "url": "assets/js/26.d1b3b48a.js",
    "revision": "2e58a0705495e52ad59ebc7b5d0507c9"
  },
  {
    "url": "assets/js/27.9d447c0a.js",
    "revision": "ed26aeca4019336c0e5078c927f0cf86"
  },
  {
    "url": "assets/js/28.ab638595.js",
    "revision": "3aa42ae398f5dc9ba3c49e9a5fb1c8c1"
  },
  {
    "url": "assets/js/29.049a9710.js",
    "revision": "2251a834a9735c4828889c731e30d007"
  },
  {
    "url": "assets/js/3.5778f50e.js",
    "revision": "4c5922dbd5cbcbd6482b1d2d7686da07"
  },
  {
    "url": "assets/js/30.7dcc7a8c.js",
    "revision": "96b0faa4dd28ce313a6e2ed08df4bd2f"
  },
  {
    "url": "assets/js/31.ab880fe4.js",
    "revision": "23192ac6c9d4be5f9d4bf08909adbb08"
  },
  {
    "url": "assets/js/32.0e0cbd28.js",
    "revision": "654c7fafe5cbdc07d03ec45dbe43e4ff"
  },
  {
    "url": "assets/js/33.d0f8a4fc.js",
    "revision": "fe065214cef5eb12ce3017a57d274788"
  },
  {
    "url": "assets/js/34.0d1eca53.js",
    "revision": "78f1a58c32c72daf9f5359a560daa6f8"
  },
  {
    "url": "assets/js/35.8f67d7e8.js",
    "revision": "060c1f48abcb58091290cfa8e08762d9"
  },
  {
    "url": "assets/js/36.7f1e0fe5.js",
    "revision": "b314a28a31f3b427a166c6c6cd7d6e7f"
  },
  {
    "url": "assets/js/37.8207e352.js",
    "revision": "20642c030520abbe0ab09acb31713272"
  },
  {
    "url": "assets/js/38.fcb47a79.js",
    "revision": "c9749a159b2553c5e289416a9eb960d7"
  },
  {
    "url": "assets/js/39.e26e8758.js",
    "revision": "04391c2395ca2ae93fc277b7207fd074"
  },
  {
    "url": "assets/js/4.6697030e.js",
    "revision": "8615cf02da195e49bf0a468e9129c246"
  },
  {
    "url": "assets/js/40.511b7362.js",
    "revision": "20fe56c621d995c41fd517112da57856"
  },
  {
    "url": "assets/js/41.23980a04.js",
    "revision": "39eedfaa950df6fb78b5b29d6a085505"
  },
  {
    "url": "assets/js/42.7d812c8f.js",
    "revision": "a5167f935df0c2cc1d5f56463e556a83"
  },
  {
    "url": "assets/js/43.e9f4c163.js",
    "revision": "24f8713ea193a93d8d692d1e2efbf8ed"
  },
  {
    "url": "assets/js/44.a70b510d.js",
    "revision": "813c1476ffb68a69672bd0be13f1a6d2"
  },
  {
    "url": "assets/js/45.0e3f6992.js",
    "revision": "7adbcdecb5909fb5b2588edb8c661d69"
  },
  {
    "url": "assets/js/46.42614d9e.js",
    "revision": "684cb57cc39ab8e89109433d27dd7111"
  },
  {
    "url": "assets/js/47.acc03387.js",
    "revision": "ef862950e98f4943dc0141b1b2696aff"
  },
  {
    "url": "assets/js/48.1f987f52.js",
    "revision": "be068b609071fb6ffcfa02979872240a"
  },
  {
    "url": "assets/js/49.53a7fd46.js",
    "revision": "27881eacb3df8bf1673a21590b8b67b4"
  },
  {
    "url": "assets/js/5.c3113993.js",
    "revision": "c4679d222c28437c831f65d8019e4af7"
  },
  {
    "url": "assets/js/50.eb913ef1.js",
    "revision": "47d4377e04e3fe7da94e9641e8abf906"
  },
  {
    "url": "assets/js/51.24dbae80.js",
    "revision": "5cbb39f7b632905f8f40a99ea3ed905b"
  },
  {
    "url": "assets/js/52.5fcfa379.js",
    "revision": "f47606e16e8908c97c39adb65548c559"
  },
  {
    "url": "assets/js/53.fd9f3e2b.js",
    "revision": "be3829290ead4ba8cd5af50dd5d33969"
  },
  {
    "url": "assets/js/54.56ca5860.js",
    "revision": "9da415433c4c538c1936e4cc97f2eb1e"
  },
  {
    "url": "assets/js/55.5997fac6.js",
    "revision": "cfa352c585e441f628a797208de95048"
  },
  {
    "url": "assets/js/56.9c74e6d6.js",
    "revision": "5cdd0379a8a565d1ea3ac9cccdba269e"
  },
  {
    "url": "assets/js/57.f24bf036.js",
    "revision": "ba74d181236799d557230585093aae0a"
  },
  {
    "url": "assets/js/58.5c310d29.js",
    "revision": "4b950e3a8a102336e7f734747c0004a0"
  },
  {
    "url": "assets/js/6.72d4d30e.js",
    "revision": "f4154a87af1bfd14e9c1024ca549daf0"
  },
  {
    "url": "assets/js/7.64e679fc.js",
    "revision": "72a9ee31abc7c86ea550de189a0434c2"
  },
  {
    "url": "assets/js/8.f5c49058.js",
    "revision": "6c049aa8d9bd909d23c4c6a6ac6fc6db"
  },
  {
    "url": "assets/js/9.b9fcef5c.js",
    "revision": "108aa62ffac1fba3abe89272fd45939d"
  },
  {
    "url": "assets/js/app.34947d8e.js",
    "revision": "9d90c67a48468b71760aff7cadaa05a8"
  },
  {
    "url": "assets/js/vendor.commons.63940afe.js",
    "revision": "afe740fee655898d17488fdd1b64c3d4"
  },
  {
    "url": "assets/js/vendor.vue.22470dd9.js",
    "revision": "fd8cbfd91a3a1ea57ce307145cc3c22d"
  },
  {
    "url": "index.html",
    "revision": "347584d1e0293ff7cdb421d777c28124"
  },
  {
    "url": "links/index.html",
    "revision": "42fca294fb854cf484634b3e92038886"
  },
  {
    "url": "posts/2017/10/19/_2018前端校招总结.html",
    "revision": "146ef433e16e29935da997ea58f01de0"
  },
  {
    "url": "posts/2018/03/17/element-table组件内容换行方案.html",
    "revision": "e78071345fe1273fe67c6a1d51885412"
  },
  {
    "url": "posts/2018/04/10/mobx-4-x严格模式下的array-map.html",
    "revision": "63b7307d58ccb7166c22541c68f9de23"
  },
  {
    "url": "posts/2018/08/20/window右键菜单添加vscode.html",
    "revision": "455c83dce40d7eaf1d51984b87ba379a"
  },
  {
    "url": "posts/2018/09/01/轻量应用服务器-mysql-远程连接踩坑.html",
    "revision": "0b36f89b23ca069d9cc49f926ed283b0"
  },
  {
    "url": "posts/2018/09/02/腾讯云香港番强.html",
    "revision": "2cce3afe0197042265e0932e3c1dc270"
  },
  {
    "url": "posts/2018/10/03/还不起的技术债.html",
    "revision": "7633b0f22af5cc3a120c2293e255e771"
  },
  {
    "url": "posts/2018/10/11/css文字多行显示超出显示省略号.html",
    "revision": "40667aeb5b1c9c1de3d75f6de7fedd45"
  },
  {
    "url": "posts/2018/10/11/linux找不到iptables文件.html",
    "revision": "110d90d1edb3c56dc43f9ddb82797416"
  },
  {
    "url": "posts/2018/10/11/vscode-vue-文件模板.html",
    "revision": "a9e95df67c212bf8225a76690135b941"
  },
  {
    "url": "posts/2018/10/11/vue引用自定义ttf-otf在线字体.html",
    "revision": "3c256262deaae6382cb61b9a74a1ade2"
  },
  {
    "url": "posts/2018/10/12/vue的style标签中background-image空白不显示问题.html",
    "revision": "204b0b9154ec351cbd95439e32a3f1a3"
  },
  {
    "url": "posts/2018/10/13/vue-2-x代码分割.html",
    "revision": "e1ec6badd15b297c4aee893fec5306ba"
  },
  {
    "url": "posts/2018/10/18/vue-script-static-file-uncaught-syntaxerror.html",
    "revision": "16006214ae88c29b09b6cd11eda3ea22"
  },
  {
    "url": "posts/2018/10/22/mac安装go.html",
    "revision": "f69821b856ef97454ebb35220d39da52"
  },
  {
    "url": "posts/2018/10/22/win安装go.html",
    "revision": "d8864c1bec66eec0b382ed40a183effd"
  },
  {
    "url": "posts/2018/10/25/ubuntu中docker安装jenkins.html",
    "revision": "4f109548b055e338e7fb5d50c7ab6c2c"
  },
  {
    "url": "posts/2018/11/01/solo-migration.html",
    "revision": "d7efb17da3136a86636d402f6a213aab"
  },
  {
    "url": "posts/2018/11/21/electron.html",
    "revision": "2f14d9024127df5f082fbc8145e52c75"
  },
  {
    "url": "posts/2018/11/21/react-electron.html",
    "revision": "406aae03ebb471fcc9a37d9212882524"
  },
  {
    "url": "posts/2018/12/07/移除mobx在vscode中装饰器报错.html",
    "revision": "55b4dd1a287240291c9d0ffe80172a41"
  },
  {
    "url": "posts/2018/12/17/pc访问-127-0-0-1显示404报错.html",
    "revision": "c8f4b13324f8e3b5628763f0faa2ebab"
  },
  {
    "url": "posts/2019/01/15/vue项目部署找不到js或者css文件.html",
    "revision": "0e178d56b791697d3fb71719897fae24"
  },
  {
    "url": "posts/2019/02/14/添加sublime到鼠标右键功能.html",
    "revision": "df1a979a52a456bce1e61dfa3d8ce11b"
  },
  {
    "url": "posts/2019/04/04/vue中输入框的中文输入法的回车事件.html",
    "revision": "4b763247fcd35cddbf36f2262d57ff08"
  },
  {
    "url": "posts/2019/04/14/idea-or-webstorm-全局-排除-node-modules.html",
    "revision": "4fdca4f6badd7aee5be4da87d30fcc90"
  },
  {
    "url": "posts/2019/04/15/mac-os-命令行下使用-sublimetext-打开文本文件.html",
    "revision": "9022421cc26d8fe51f13820583b566ae"
  },
  {
    "url": "posts/2019/05/01/浏览器的强缓存和协商缓存.html",
    "revision": "a8b3f87e69ba78cfd665e64a2eb85836"
  },
  {
    "url": "posts/2019/05/05/用vue实现灭霸响指效果.html",
    "revision": "01f9dd13617017e3465eda9c29fc309c"
  },
  {
    "url": "posts/2019/05/14/js数组需要注意的api.html",
    "revision": "f327b8f1eb2f7719cd5e3395e024bb60"
  },
  {
    "url": "posts/2019/05/16/前端项目线上如何做跨域.html",
    "revision": "f8ea1181f6fb28c1ae9bcd62729a7c9e"
  },
  {
    "url": "posts/2019/06/14/vue-cli-2-x项目迁移日志.html",
    "revision": "a31a6a4dbabbf5013738a3dda0a3428f"
  },
  {
    "url": "posts/2019/07/17/思考-一.html",
    "revision": "f724e41d4d1cfc2954523b19af0c1f93"
  },
  {
    "url": "posts/2019/08/16/github-pages自定义域名失效.html",
    "revision": "2325f0f94131c4f329fef1ba78600e3a"
  },
  {
    "url": "posts/2019/09/15/ubuntu-环境搭建.html",
    "revision": "faacf8da97d660499572322cb11611be"
  },
  {
    "url": "posts/2019/09/16/docker介绍.html",
    "revision": "2e5e8624965b17fba0b2e65ca2501c0f"
  },
  {
    "url": "posts/2019/09/16/docker部署nodejs应用.html",
    "revision": "1c99d4423ea94d8d17793a6f821e0665"
  },
  {
    "url": "posts/2019/09/16/ubuntu-安装-docker.html",
    "revision": "d48aa96504793e3e3e3fb95c08ecea50"
  },
  {
    "url": "posts/2019/10/25/vscode-快捷键.html",
    "revision": "89b3b77f249ea342149830fea8a51e92"
  },
  {
    "url": "posts/2019/11/21/jquery-zh.html",
    "revision": "caa3e5b75e2b779b9237ebb285097c92"
  },
  {
    "url": "posts/2019/11/21/jquery源码.html",
    "revision": "7284d42016c17da95bda3394837aa1d0"
  },
  {
    "url": "posts/2020/01/22/git原理和操作.html",
    "revision": "7131408e74bf14e7238294eebce9db02"
  },
  {
    "url": "posts/2020/01/22/多个-origin-区分用户名.html",
    "revision": "3ba10bc80694350382cf2708b28312e0"
  },
  {
    "url": "posts/2020/07/19/个人博客的部署历史.html",
    "revision": "bbb69b9fd831ac2b584735b3c9d91b49"
  },
  {
    "url": "posts/2020/07/19/搜索引擎收录.html",
    "revision": "86d47f25be98d92913c10381eb24dd6e"
  },
  {
    "url": "posts/2020/08/06/workflow.html",
    "revision": "bd1bf295fc566a6d4c29db00dd977e61"
  },
  {
    "url": "posts/2020/08/12/node-终端命令别名添加.html",
    "revision": "9d31a13e258323fc8bc3fedba0d7457f"
  },
  {
    "url": "posts/2020/08/16/zeit-with-node.html",
    "revision": "72d2617ecb32b3edccc3484b6cd55c54"
  },
  {
    "url": "posts/2020/08/17/vue-js-3-0-的变化.html",
    "revision": "8fb5bc186de3513cd0b16ffd02131fb8"
  },
  {
    "url": "posts/2020/09/02/generate-vuex.html",
    "revision": "69285a5fbb2bead549f77e95a1172ba9"
  },
  {
    "url": "posts/2020/09/04/regular-expression.html",
    "revision": "3b618ec950ce01d414e61a6ef9281ea2"
  },
  {
    "url": "posts/2020/09/15/iterm-快捷键.html",
    "revision": "d50d2a55f276225bd392457f52a2e723"
  },
  {
    "url": "posts/2020/10/22/支付宝的坑点.html",
    "revision": "7f71d5787a60869467dd11d633f8c019"
  },
  {
    "url": "posts/categories/index.html",
    "revision": "280fb82c2784c6edb29064d564226ad6"
  },
  {
    "url": "posts/categories/vue.html",
    "revision": "0ea92d9ab032aeee2f5b87268ae8f629"
  },
  {
    "url": "posts/categories/正则.html",
    "revision": "f44c5720babe94fc70a6705a723e4dd2"
  },
  {
    "url": "posts/categories/生活.html",
    "revision": "0860e4773e1ca73f95bc4f58bef46072"
  },
  {
    "url": "posts/categories/翻译.html",
    "revision": "43a7e5139cdefcacefa610999f2bb10b"
  },
  {
    "url": "posts/columns/index.html",
    "revision": "bc002f0222937c78f1cc2a2e294f77f4"
  },
  {
    "url": "posts/index.html",
    "revision": "ef70983c8ff706031087b8acda2271fc"
  },
  {
    "url": "posts/tags/canvas.html",
    "revision": "7ebb935af261e829a87848460f0e6d0c"
  },
  {
    "url": "posts/tags/CS.html",
    "revision": "956d739225838399213398bad7915f9b"
  },
  {
    "url": "posts/tags/css3.html",
    "revision": "9fd95592916564914ee285bfef5a5422"
  },
  {
    "url": "posts/tags/docker.html",
    "revision": "b2c2e405ed03516253f5dc5d7fce730c"
  },
  {
    "url": "posts/tags/github.html",
    "revision": "799bd298a48a2a0741d78de9738913d8"
  },
  {
    "url": "posts/tags/go.html",
    "revision": "c3d0fb9da0625d6ca09bf8127e7d923c"
  },
  {
    "url": "posts/tags/index.html",
    "revision": "f0be1a239610a91db078f508b0b25bbb"
  },
  {
    "url": "posts/tags/Iterm2.html",
    "revision": "457ae0382dadefc73b42e9ed45bc29fa"
  },
  {
    "url": "posts/tags/jenkins.html",
    "revision": "4d1226af42ba611995e868ce0caa1906"
  },
  {
    "url": "posts/tags/JS.html",
    "revision": "b0b00986893df84bd8c700759f953d6f"
  },
  {
    "url": "posts/tags/linux.html",
    "revision": "0290fb057f000e0594a52c1d98d09eac"
  },
  {
    "url": "posts/tags/mobx.html",
    "revision": "8ddaca6b32088bb5d6350c27128e2428"
  },
  {
    "url": "posts/tags/node.html",
    "revision": "32e1853cf0f0bacfad9f1a4953c5669f"
  },
  {
    "url": "posts/tags/seo.html",
    "revision": "429f2ae6f231b04f36b6c5a2e4cc10d8"
  },
  {
    "url": "posts/tags/serverless.html",
    "revision": "838e6bc923181428bbfa8e8476e998a4"
  },
  {
    "url": "posts/tags/svg.html",
    "revision": "bfbaefd1c5d4c26fab42308aaa124c84"
  },
  {
    "url": "posts/tags/ubuntu.html",
    "revision": "51af925ab32083de727ccb3dc3986f92"
  },
  {
    "url": "posts/tags/Vercel.html",
    "revision": "294d69c84d51c00926922eb3a832463f"
  },
  {
    "url": "posts/tags/vscode.html",
    "revision": "3a4a40ae76ea2feef55eb8cbf5cf49ba"
  },
  {
    "url": "posts/tags/vue 3.html",
    "revision": "2a3fcf8e4f4c7f32577137205299a65e"
  },
  {
    "url": "posts/tags/vue-cli.html",
    "revision": "5bc57f0bf2885d7fb7e7b67b279b5da6"
  },
  {
    "url": "posts/tags/vue.html",
    "revision": "f34eeb8e30178a37657a3930b4a3c7b8"
  },
  {
    "url": "posts/tags/webpack.html",
    "revision": "9ed6d69242ceda2f0d0dc6ce5e0761be"
  },
  {
    "url": "posts/tags/服务器.html",
    "revision": "26c504393cd25071ef5dd2fb538b623b"
  },
  {
    "url": "posts/tags/浏览器.html",
    "revision": "ac82fa0b3acf4bf0451117e9c4871a83"
  },
  {
    "url": "posts/tags/生活.html",
    "revision": "e0e8e4e88d818e4e796c6106760c13e5"
  },
  {
    "url": "posts/tags/移动端.html",
    "revision": "443a7ec0228d8c5fc0a05d3fe1c9c94a"
  },
  {
    "url": "posts/tags/缓存.html",
    "revision": "625ff6d3970367e35a5ac5c515ce04fb"
  },
  {
    "url": "posts/tags/编辑器.html",
    "revision": "f4cfbdef22110d25b1325da8d2868277"
  },
  {
    "url": "posts/tags/跨域.html",
    "revision": "ea4c2d6c0e48170e8e3f5d62df9c60e5"
  },
  {
    "url": "whisper/index.html",
    "revision": "236152b1397fe705590724f46e40d2ab"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
