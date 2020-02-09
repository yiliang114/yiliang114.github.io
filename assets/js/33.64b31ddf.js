(window.webpackJsonp=window.webpackJsonp||[]).push([[33],{254:function(s,t,a){"use strict";a.r(t);var r=a(0),n=Object(r.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h1",{attrs:{id:"腾讯云香港番强-fanqiang"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#腾讯云香港番强-fanqiang"}},[s._v("#")]),s._v(" 腾讯云香港番强(fanqiang)")]),s._v(" "),a("h2",{attrs:{id:"步骤"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#步骤"}},[s._v("#")]),s._v(" 步骤")]),s._v(" "),a("p",[s._v("以 ubuntu 为例:")]),s._v(" "),a("ol",[a("li",[a("p",[s._v("使用 ssh 登录到需要设置番强(fanqiang)中转站的服务器.")])]),s._v(" "),a("li",[a("p",[s._v("获取 root 权限(若非 root 用户登录,可以使用"),a("strong",[s._v("sudo su")]),s._v(").")])]),s._v(" "),a("li",[a("p",[s._v("执行"),a("strong",[s._v("sudo apt-get update")]),s._v(" 更新系统.")])]),s._v(" "),a("li",[a("p",[s._v("执行"),a("strong",[s._v("sudo apt-get install python-pip")]),s._v(" 安装 python.")])]),s._v(" "),a("li",[a("p",[s._v("执行 **sudo pip install shadowsocks **安装 shadowsocks")])]),s._v(" "),a("li",[a("p",[s._v("启动 shadowsocks:")]),s._v(" "),a("p",[s._v("方法(1):直接命令启动")]),s._v(" "),a("p",[a("strong",[s._v("sudo ssserver -p PORT -k PASSWORD -m aes-256-cfb --log-file /var/log/shadowsocks.log -d start")])]),s._v(" "),a("p",[s._v("方法(2):指定配置文件启动")]),s._v(" "),a("p",[a("strong",[s._v("sudo touch /etc/shadowsocks.json")])]),s._v(" "),a("p",[a("strong",[s._v("sudo vim /etc/shadowsocks.json")])]),s._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"server"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"0.0.0.0"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"server_port"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("8388")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"local_address"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"127.0.0.1"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"local_port"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1080")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"password"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"PASSWORD"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"timeout"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("300")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"method"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"aes-256-cfb"')]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),a("p",[s._v("执行命令:"),a("strong",[s._v("sudo ssserver -c /etc/shadowsocks.json -d start")])])])]),s._v(" "),a("h2",{attrs:{id:"报错"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#报错"}},[s._v("#")]),s._v(" 报错")]),s._v(" "),a("p",[s._v("搭建 ss 之后连上代理 访问 google，发现报错： 500 Internal Privoxy Error")]),s._v(" "),a("p",[s._v("登录服务器之后，查看一下 8388 端口的占用状况：")]),s._v(" "),a("p",[a("code",[s._v("netstat -noa | grep :8388")]),s._v(" "),a("img",{attrs:{src:"https://chatflow-files-cdn-1256085166.cos.ap-chengdu.myqcloud.com/20180507204011558.png",alt:"这里写图片描述"}}),s._v("\n能够输出相关端口信息说明运行正常，那么通常是因为服务器防火墙的端口没有打开，比如说我这里就是 因为刚买的服务器，在配置安全组中没有将 8388 端口开放给外网访问，因为在我的 pc 上虽然开启了 ss，但是访问 google 会报 500 错误。")]),s._v(" "),a("p",[s._v("那么接下来只要防火墙端口开放就好了。至于是手动选择开放 8388 端口 还是 在服务器控制台配置安全组配置一下，就看你自己了。\n"),a("img",{attrs:{src:"https://chatflow-files-cdn-1256085166.cos.ap-chengdu.myqcloud.com/20180507204019631",alt:"这里写图片描述"}})])])}),[],!1,null,null,null);t.default=n.exports}}]);