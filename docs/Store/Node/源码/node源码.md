---
title: Node 源码
date: '2020-10-26'
draft: true
---

https://github.com/yjhjstz/deep-into-node

## Node 源码

Node 既不是一种语言，也不是一个框架，而是一个能执行 JavaScript 代码的运行时。

#### Node.js 模块类型

在 Node.js 中，模块主要分为以下几种类型：

- 核心模块： 包含在 Node.js 源码中，被编译成 Node.js 可执行的二进制文件 JavaScript 模块，也叫 native 模块，比如常用的 http, fs 等等
- C/C++ 模块，也叫 built-in 模块，一般我们不直接调用，而是在 native module 中调用，然后我们再 require
- native 模块，比如我们在 Node.js 中常用的 buffer , fs , os 等 native 模块，其底层都有调用 built-in 模块。
- 第三方模块： 非 Node.js 源码自带的模块都可以统称为第三方模块，比如 express, webpack 等
  - JavaScript 模块，最常见，开发的时候一般都是写 JavaScript 模块
  - JSON 模块， 就是一个 json 文件
  - C/C++ 扩展模块，使用 C/C++ 编写，编译之后的后缀名为 .node

#### Node.js 源码结构概览

下载 node 源码之后，其中的结构一般如下：

- `./lib` 文件夹主要包含了各种 JavaScript 文件，常用的 JavaScript native 模块都在这里
- `./src` 文件夹主要包含了 Node.js 的 C/C++ 源码文件，其中很多 built-in 模块都在这里。 是 lib 库对应的 C/C++ 实现。
- `./deps` 文件夹包含了 Node.js 依赖的各种库，典型的如 v8, libuv , zlib 等
  - http_parser
  - uv
  - v8
  - gtest 是 C/C++ 单元测试框架

#### Node.js 模块依赖

![1632709-a1a4c8670dc5c0c4](https://user-images.githubusercontent.com/11473889/57978148-c185b280-7a39-11e9-9559-7fa548bea6ce.png)

##### Node Standard Library

Node 标准库，应该是使用频率最高的，比如 Http Buffer 模块等

##### Node bindings

是沟通 JS 和 C++ 的桥梁，封装 V8 和 Libuv 的细节，向上层提供基础 API 服务。

##### 底层

这一层是 Node.js 运行的关键，C/C++ 编写

- V8 是谷歌开源的 JavaScript 引擎，能够使 JavaScript 能够下浏览器之外的地方运行。JavaScript 引擎是一个能够将 JavaScript 语言转化成浏览器能够识别的低级语言或机器码的程序
- Libuv C++的开源项目，使 Node 能够访问操作系统的底层文件系统（file system），访问网络（networking）并且处理一些高并发相关的问题。
- c-ares 提供了异步处理 DNS 相关的能力。
- http_parser、OpenSSL、zlib 提供包括 http 解析、SSL、数据压缩等其他的能力。

* Node Standard Library 是我们每天都在用的标准库，如 Http, Buffer 模块。

* Node Bindings 是沟通 JS 和 C++的桥梁，封装 V8 和 Libuv 的细节，向上层提供基础 API 服务. 这一层是支撑 Node.js 运行的关键，由 C/C++ 实现。

* V8 是 Google 开发的 JavaScript 引擎，提供 JavaScript 运行环境，可以说它就是 Node.js 的发动机。

* Libuv 是专门为 Node.js 开发的一个封装库，提供跨平台的异步 I/O 能力

在开发中使用的 release 版本的 Node.js 其实就是从源码编译得到的可执行文件。 这里以 Linux 平台为例，简单介绍 Node.js 编译流程。

首先需要认识一下编译用到的组织工具， 即 `gyp`。 Node.js 源码中我们可以看到一个 `node.gyp` ， 文件的内容是由 python 写的一些类似 JSON-like 的配置，定义了一连串的构建工程任务。我们举个例子，其中有一个字段如下：

```
{
      'target_name': 'node_js2c',
      'type': 'none',
      'toolsets': ['host'],
      'actions': [
        {
          'action_name': 'node_js2c',
          'inputs': [
            '<@(library_files)',
            './config.gypi',
          ],
          'outputs': [
            '<(SHARED_INTERMEDIATE_DIR)/node_natives.h',
          ],
          'conditions': [
            [ 'node_use_dtrace=="false" and node_use_etw=="false"', {
              'inputs': [ 'src/notrace_macros.py' ]
            }],
            ['node_use_lttng=="false"', {
              'inputs': [ 'src/nolttng_macros.py' ]
            }],
            [ 'node_use_perfctr=="false"', {
              'inputs': [ 'src/perfctr_macros.py' ]
            }]
          ],
          'action': [
            'python',
            'tools/js2c.py',
            '<@(_outputs)',
            '<@(_inputs)',
          ],
        },
      ],
    }, # end node_js2c
```

这个任务主要的作用从名称 `node_js2c` 就可以看出来，是将 JavaScript 转换为 C/C++ 代码。这个任务我们下面还会提到。

首先编译 Node.js，需要提前安装一些工具：

- gcc 和 g++ 4.9.4 及以上版本
- clang 和 clang++
- python 2.6 或者 2.7，这里要注意，只能是这两个版本，不可以为 python 3+
- GNU MAKE 3.81 及以上版本

有了这些工具，进入 Node.js 源码目录，我们只需要依次运行如下命令：

```
./configuration
make
make install
```

即可编译生成可执行文件并安装了。

#### 从 `node index.js` 开始

假设有一个文件 `index.js` ， 其中的内容只有简单一行 `console.log('hello world')`。 当我们执行 `node index.js` 的时候， Node.js 是如何进行编译、运行这个文件的呢？

当输入 Node.js 命令的时候，调用的是 Node.js 源码中的 main 函数，在 `src/node_main.cc` 中：(我已经将不会执行的部分都删掉了)

```
namespace node {
// 嵌套的命名空间
namespace per_process {
extern bool linux_at_secure;
}  // namespace per_process
}  // namespace node

// main 函数是 linux 系统的主函数。
int main(int argc, char* argv[]) {
  setvbuf(stdout, nullptr, _IONBF, 0);
  setvbuf(stderr, nullptr, _IONBF, 0);
  // 入口
  return node::Start(argc, argv);
}
#endif
```

这个文件做了入口区分，区分了 windows 和 unix 环境。 以 unix 为例，在 main 函数中最后调用了 `node::Start` ， 这个函数是定义在 `/src/node.cc` 文件中：

```C++
int Start(int argc, char** argv) {
  InitializationResult result = InitializeOncePerProcess(argc, argv);
  if (result.early_return) {
    return result.exit_code;
  }

  {
    Isolate::CreateParams params;
    // params.external_references.
    std::vector<intptr_t> external_references = {
        reinterpret_cast<intptr_t>(nullptr)};
    v8::StartupData* blob = NodeMainInstance::GetEmbeddedSnapshotBlob();
    const std::vector<size_t>* indexes =
        NodeMainInstance::GetIsolateDataIndexes();
    if (blob != nullptr) {
      params.external_references = external_references.data();
      params.snapshot_blob = blob;
    }
		// main_instance 实例中的 Run 函数执行，最重要就是执行了 LoadEnvironment 函数。
    NodeMainInstance main_instance(&params,
                                   uv_default_loop(),
                                   per_process::v8_platform.Platform(),
                                   result.args,
                                   result.exec_args,
                                   indexes);
    result.exit_code = main_instance.Run();
  }

  TearDownOncePerProcess();
  return result.exit_code;
}
```

这里的 Start 函数的内容比较长，目前最新版本 10.15 的 Node.js 跟之前的代码虽然在模块划分和函数命名上有一定的差别，但是实际的执行逻辑还是一致的。这里的 Start 函数主要的函数调用关系是：`Start -> main_instance.Run() -> LoadEnvironment`。

这里的 `LoadEnvironment` 函数主要做的事情就是， 执行 `StartMainThreadExecution` 函数。下面的内容是 `StartMainThreadExecution` 函数主要的内容，从语义上讲就是开始执行 `internal` 文件夹下的 js 文件。

```
MaybeLocal<Value> StartMainThreadExecution(Environment* env) {
  if (NativeModuleEnv::Exists("_third_party_main")) {
    return StartExecution(env, "internal/main/run_third_party_main");
  }

  std::string first_argv;
  // 选项参数的长度
  if (env->argv().size() > 1) {
    first_argv = env->argv()[1];
  }

  if (first_argv == "inspect" || first_argv == "debug") {
    return StartExecution(env, "internal/main/inspect");
  }

  if (per_process::cli_options->print_help) {
    return StartExecution(env, "internal/main/print_help");
  }

  if (per_process::cli_options->print_bash_completion) {
    return StartExecution(env, "internal/main/print_bash_completion");
  }

  if (env->options()->prof_process) {
    return StartExecution(env, "internal/main/prof_process");
  }

  // -e/--eval without -i/--interactive
  if (env->options()->has_eval_string && !env->options()->force_repl) {
    return StartExecution(env, "internal/main/eval_string");
  }

  if (env->options()->syntax_check_only) {
    return StartExecution(env, "internal/main/check_syntax");
  }

  if (!first_argv.empty() && first_argv != "-") {
    return StartExecution(env, "internal/main/run_main_module");
  }

  if (env->options()->force_repl || uv_guess_handle(STDIN_FILENO) == UV_TTY) {
    return StartExecution(env, "internal/main/repl");
  }
  return StartExecution(env, "internal/main/eval_stdin");
}
```

现在看起来，执行 `node index.js` 的时候，这里会走进 `StartExecution(env, "internal/main/run_main_module");` 这里的逻辑。`StartExecution` 函数暂时只需要理解为，读取第二个参数指定的 js 文件的内容，并且执行脚本。所以接下来看一下 `internal/main/run_main_module.js` 文件的内容：

```js
'use strict';

// js 文件是标准的 commonjs ，通过 require 来引入导出的对象，通过 module.exports 导出对象
const { prepareMainThreadExecution } = require('internal/bootstrap/pre_execution');

prepareMainThreadExecution(true);

// 执行 loader.js 的逻辑
const CJSModule = require('internal/modules/cjs/loader');
// 全局标记一下，引导程序已经执行完毕了。
markBootstrapComplete();

// Note: this actually tries to run the module as a ESM first if
// --experimental-modules is on.
// is an undocumented method available via `require('module').runMain`
// 如果 -experimental-modules 开启的话， 尝试先以 ESM 的形式运行模块。 执行 js 的主进程逻辑。
CJSModule.runMain();
```

`prepareMainThreadExecution` 函数主要做了以下的工作：

1. 为 `node` 运行时中的全局变量 `process` 定义和修改了一些属性， 这些逻辑在 `patchProcessObject` 函数中。

2. 初始化一些环境变量或者处理器模块。

   ```js
   function prepareMainThreadExecution(expandArgv1 = false) {
     patchProcessObject(expandArgv1);
     setupTraceCategoryState();
     setupInspectorHooks();
     setupWarningHandler();
     if (process.env.NODE_V8_COVERAGE) {
       process.env.NODE_V8_COVERAGE = setupCoverageHooks(process.env.NODE_V8_COVERAGE);
     }
     setupDebugEnv();
     setupSignalHandlers();
     initializeReport();
     initializeReportSignalHandlers();
     initializeHeapSnapshotSignalHandlers();
     setupChildProcessIpcChannel();
     initializePolicy();
     initializeClusterIPC();
     initializeDeprecations();
     initializeFrozenIntrinsics();
     initializeCJSLoader();
     initializeESMLoader();
     loadPreloadModules();
   }
   ```

接下来我们回到 `run_main_module.js` 文件中，`markBootstrapComplete` 函数我理解应该就只是有一个简单的标记"引导程序"执行完毕，主进程执行之前的准备都已经 ok 了。也就是要执行 `CJSModule.runMain();` 了。 具体的内容在 `internal/modules/cjs/loader.js` 中：

```js
// 加载执行 process.argv[1]
Module.runMain = function () {
  // Load the main module--the command line argument.
  // 根据命令行参数加载主模块
  if (experimentalModules) {
	...
  }
  // 检查缓存，最终会获取到指定的文件导出的对象
  Module._load(process.argv[1], null, true);
};
```

因为我们现在主要是先走一走主流程， 所以暂时不关注实验属性，所以 if 里面的逻辑先不管。

那也就是说， `runMain` 函数是调用了 `Module._load` 函数，其中的第一个参数 `process.argv[1]`， 应该很眼熟，这是执行脚本的文件目录地址。而这里的 `Module._load` 函数 Node 会做一次缓存的存取，如果有当前模块的缓存，则直接读取模块缓存内容并执行；如果是本地模块的话，直接可以通过 `NativeModule.prototype.compileForPublicLoader()` 返回导出对象；否则的话，为文件创建一个新模块并将其保存到缓存中。然后让它在返回导出对象之前加载文件内容。

这里的 `Module._load` 函数的第三个参数，布尔值表示这个模块是否是主进程。(在这里我猜测 Node 会对 所有被引用的 commonjs 模块，都执行一次 `Module._load` 函数，但是只会有一个模块在执行这个函数时，第三个参数给 true， 以标记这是一个 main 函数模块) 在其他模块的 require 的时候， 也会执行 `Module._load` 函数。 因为我们可以推断出，Node.js 项目的执行过程，实际上都是通过 `require` 一个 `js` 文件并执行的过程。那么接下来就先来看一下 `require` 模块的原理。

#### Node.js 模块加载原理 (require)

源码在 `internal/modules/cjs/loader.js` 文件中：

```js
Module.prototype.require = function(id) {
  // 校验模块 id 是否合法
  validateString(id, 'id');
  if (id === '') {
    throw new ERR_INVALID_ARG_VALUE('id', id, 'must be a non-empty string');
  }
  // 模块依赖计数
  requireDepth++;
  try {
    return Module._load(id, this, /* isMain */ false);
  } finally {
    requireDepth--;
  }
};
```

`require`方法定义在 `Module` 的原型链上， 可以看到在 `require` 方法实际是调用 `Module._load` 方法去加载一个模块的。 在代码中还存在一个 `requireDepth` 自增、自减的逻辑，猜测是因为 `Module._load` 方法是因为 IO 是一个异步函数，通过 `requireDepth` 最终是否为 0 来判断是否所有的 `require` 模块都已经被加载完毕。

接着继续来看看

需要分析，require 的是核心模块还是第三方的 js 模块。 这里会走不通的逻辑。

例如如果 index.js 文件中存在 `const http = require('http')` 的代码，这里的 http 模块是 Node.js 的核心模块，先看一看这里的逻辑：

Node.js 源码编译的时候，会采用 v8 附带的 js2c.py 工具，将 lib 文件夹下面的 js 模块的代码都转换成 C 里面的数组.

### libuv node 事件轮询解析

https://www.cnblogs.com/watercoldyi/p/5675180.html

https://copyfuture.com/blogs-details/d5a771813b6dfdff92e08b87c83fed6d

https://copyfuture.com/blogs-details/e79ca777b815b1fcadd47d1eb0acb62b

libuv => node => v8

libuv 是一个高效轻量的跨平台异步 IO 库，在 linux 下，它转让那个了 libevent ， 在 windows 下，它用 iocp 重写了一套。

![](https://images2015.cnblogs.com/blog/991936/201607/991936-20160716003523482-1392940674.png)

它的整体是基于事件循环，简单说就是外部的接口其实是对内层的一个个请求，并没有做真正的事情， 这些请求都存储在内部的一个请求队列中，在事件循环中，再从请求队列中取出他们，然后做具体的事情，完成了之后就利用回调函数通知调用者。 这样一来，所有外部的接口都可以变成异步的。

它的世界分为 3 类：

1. uv_loop_t,表示事件循环，为其他两类元素提供环境容器和统筹调度。
2. uv_handle_t 族,持续性请求,生命周期较长，且能多次触发事件。
3. uv_req_t 族,一次性请求.

![](https://raw.githubusercontent.com/gnailiy/jianshen/master/images/image.6yeq4mt6e93.png)

1. 核心数据结构 `default_loop_struct` 结构体为`struct uv_loop_s`
   当加载 js 文件时，如果代码有 io 操作，调用 lib 模块->底层 C++模块->LibUV(deps uv)->拿到系统返回的一个 fd（文件描述符），和 js 代码传进来的回调函数 callback，封装成一个 io 观察者（一个 uv\_\_io_s 类型的对象），保存到`default_loop_struct`.
2. 进入事件池， `default_loop_struct`保存对应 io 观察着，V8 Engine 处理 js 代码, main 函数调用 libuv 进入`uv_run()`, node 进入事件循环 ,判断是否有存活的观察者
   - 如果也没有 io, Node 进程退出
   - 如果有 io 观察者， 执行`uv_run()`进入`epoll_wait()`线程挂起，io 观察者检测是否有数据返回`callback`, 没有数据则会一直在`epoll_wait()`等待执行 `server.listen(3000)`会挂起一直等待。

### Module 对象

根据 CommonJS 规范，每一个文件就是一个模块，在每个模块中，都会有一个 module 对象，这个对象就指向当前的模块。

module 对象具有以下属性：

- id：当前模块的 bi
- exports：表示当前模块暴露给外部的值
- parent： 是一个对象，表示调用当前模块的模块
- children：是一个对象，表示当前模块调用的模块
- filename：模块的绝对路径
- paths：从当前文件目录开始查找`node_modules`目录；然后依次进入父目录，查找父目录下的`node_modules`目录；依次迭代，直到根目录下的`node_modules`目录
- loaded：一个布尔值，表示当前模块是否已经被完全加载

#### 目录

```
./lib
./src
./deps/uv
```

```
 1. 原生 js模块：node提供给 用户js 代码的类接口，平时用的require('fs')、require('http')调用的都是这部分的代码。【最左列的 lib文件夹，展开后是左二列】
 2. node 源码：node程序的main函数入口；还有提供给lib模块的C++类接口。【最左列的 src 文件夹，展开后是第三列】
 3. v8引擎：node用来解析、执行js代码的运行环境。【最左列的deps文件夹展开后是第四列，v8和libuv等依赖都放在这里】
 4. libuv：事件循环库，提供最底层的 io操作接口（包括网络io操作的epoll_wait()、文件异步io的线程池管理）、事件循环逻辑。 【第四列的uv文件夹，展开后是第五列】
```

### JS 调用 Node 的逻辑

用户的 js 代码如果有 IO 操作的时候，js 代码会首先会通过调用：

1. lib 模块（原生 js 模块）
2. C++ 模块快 （src 下的部分）
3. libuv 接口（代码在 deps/uv 文件夹下）
4. 最终的系统 api

拿到最终系统返回的一个 fd （文件描述符）， 和 js 模块传入的回调函数 callback， 会封装成一个 IO 观察者（一个 uv\_\_io_s 类型的对象）， 保存到 default_loop_struct 中。

#### Node 进入事件循环

当 Node 处理完 js 模块，如果此时有 io 操作，那么这时 default_loop_struct 中就会保存着对应的 IO 观察者的。当处理完 js 代码， main 函数继续往下调用 libuv 的事件循环入口 uv_run() ， node 就进入了事件循环：

uv_run() 的 while 循环做的就只有一件事，判断 default_loop_struct 是否还有存活的 IO 观察者。

1. 如果没有 io 观察者，那么 uv_run() 退出， node 进程就会退出
2. 如果还有 io 观察者，那么 uv_run() 会进入 epoll_wait() , 线程挂起等待， 监听对应的 IO 观察者是否有新的数据到来。 有数据到来就调用 io 观察者里保存着的 callback （一开始通过 js 代码传入的），没有数据到来时就一直在 epoll_wait() 进行等待。

这就是为什么 js 代码中 console.log('xxx') 的 js 代码会导致 node 退出，而 server.listen(80) 导致线程挂起等待。

在 uv_run() 里面如果监听的 io 观察者有数据到来，那么调用对应的 callback，执行 js 代码。如果没有数据到来，一直在 epoll_wait()等待。那如果我 js 代码里面有新的 io 操作想要交给 epoll_wait()进行监听，而此刻监听着的 io 观察者又没有数据到来，线程一直在这里等待，那怎么办？

首先第 1 点讲到，执行 js 代码的时候，通过调用 node 提供的 C++接口最终把 io 观察者都保存到 default_loop_struct 里面，js 代码执行完之后，node 继续运行才进入 epoll_wait()等待。也就是说 node 在 epoll_wait()的时候，js 代码执行完毕了。而 js 代码的回调函数部分，本来的设定就是在 epoll_wait()监听的 io 观察者被触发之后才会执行回调，在 epoll_wait()进行等待的时候，不可能存在“有新 io 操作要交给 epoll_wait()去监听”这样的 js 代码。
