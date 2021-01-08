---
title: 类型转换
date: '2020-11-02'
draft: true
---

### 请评价以下事件监听器代码并给出改进意见

```js
if (window.addEventListener) {
  var addListener = function(el, type, listener, useCapture) {
    el.addEventListener(type, listener, useCapture);
  };
} else if (document.all) {
  addListener = function(el, type, listener) {
    el.attachEvent('on' + type, function() {
      listener.apply(el);
    });
  };
}
```

作用：浏览器功能检测实现跨浏览器 DOM 事件绑定

优点：

1. 测试代码只运行一次，根据浏览器确定绑定方法
2. 通过`listener.apply(el)`解决 IE 下监听器 this 与标准不一致的地方
3. 在浏览器不支持的情况下提供简单的功能，在标准浏览器中提供捕获功能

缺点：

1. document.all 作为 IE 检测不可靠，应该使用 if(el.attachEvent)
2. addListener 在不同浏览器下 API 不一样
3. `listener.apply`使 this 与标准一致但监听器无法移除
4. 未解决 IE 下 listener 参数 event。 target 问题

改进:

```js
var addListener;

if (window.addEventListener) {
  addListener = function(el, type, listener, useCapture) {
    el.addEventListener(type, listener, useCapture);
    return listener;
  };
} else if (window.attachEvent) {
  addListener = function(el, type, listener) {
    // 标准化this，event，target
    var wrapper = function() {
      var event = window.event;
      event.target = event.srcElement;
      listener.call(el, event);
    };

    el.attachEvent('on' + type, wrapper);
    return wrapper;
    // 返回wrapper。调用者可以保存，以后remove
  };
}
```

### 编写一个函数接受 url 中 query string 为参数,返回解析后的 Object,query string 使用 application/x-www-form-urlencoded 编码

```js
/**
 * 解析query string转换为对象，一个key有多个值时生成数组
 *
 * @param {String} query 需要解析的query字符串，开头可以是?，
 * 按照application/x-www-form-urlencoded编码
 * @return {Object} 参数解析后的对象
 */
function parseQuery(query) {
  var result = {};

  // 如果不是字符串返回空对象
  if (typeof query !== 'string') {
    return result;
  }

  // 去掉字符串开头可能带的?
  if (query.charAt(0) === '?') {
    query = query.substring(1);
  }

  var pairs = query.split('&');
  var pair;
  var key, value;
  var i, len;

  for (i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i].split('=');
    // application/x-www-form-urlencoded编码会将' '转换为+
    key = decodeURIComponent(pair[0]).replace(/\+/g, ' ');
    value = decodeURIComponent(pair[1]).replace(/\+/g, ' ');

    // 如果是新key，直接添加
    if (!(key in result)) {
      result[key] = value;
    }
    // 如果key已经出现一次以上，直接向数组添加value
    else if (isArray(result[key])) {
      result[key].push(value);
    }
    // key第二次出现，将结果改为数组
    else {
      var arr = [result[key]];
      arr.push(value);
      result[key] = arr;
    } // end if-else
  } // end for

  return result;
}

function isArray(arg) {
  if (arg && typeof arg === 'object') {
    return Object.prototype.toString.call(arg) === '[object Array]';
  }
  return false;
}
/**
console.log(parseQuery('sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8'));
 */
```

### 解析一个完整的 url,返回 Object 包含域与 window.location 相同

```js
/**
 * 解析一个url并生成window.location对象中包含的域
 * location:
 * {
 *      href: '包含完整的url',
 *      origin: '包含协议到pathname之前的内容',
 *      protocol: 'url使用的协议，包含末尾的:',
 *      username: '用户名', // 暂时不支持
 *      password: '密码',  // 暂时不支持
 *      host: '完整主机名，包含:和端口',
 *      hostname: '主机名，不包含端口'
 *      port: '端口号',
 *      pathname: '服务器上访问资源的路径/开头',
 *      search: 'query string，?开头',
 *      hash: '#开头的fragment identifier'
 * }
 *
 * @param {string} url 需要解析的url
 * @return {Object} 包含url信息的对象
 */
function parseUrl(url) {
  var result = {};
  var keys = ['href', 'origin', 'protocol', 'host', 'hostname', 'port', 'pathname', 'search', 'hash'];
  var i, len;
  var regexp = /(([^:]+:)\/\/(([^:\/\?#]+)(:\d+)?))(\/[^?#]*)?(\?[^#]*)?(#.*)?/;

  var match = regexp.exec(url);

  if (match) {
    for (i = keys.length - 1; i >= 0; --i) {
      result[keys[i]] = match[i] ? match[i] : '';
    }
  }

  return result;
}
```
