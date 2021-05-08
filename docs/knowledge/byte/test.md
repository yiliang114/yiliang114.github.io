```js
// 假设有一台本地机器，无法做加减乘除运算（包括位运算），因此无法执行 a + b、a+ = 1 这样的 JS 代码，然后我们提供一个服务器端的 HTTP API，可以传两个数字类型的参数，响应结果是这两个参数的和，这个 HTTP API 的 JS SDK（在本地机器上运行）的使用方法如下：

asyncAdd(3, 5, (err, result) => {
  console.log(result); // 8
});

// SDK 的模拟实现：

function asyncAdd(a, b, cb) {
  setTimeout(() => {
    cb(null, a + b);
  }, Math.floor(Math.random()*1000))
}

// 现在要求在本地机器上实现一个 sum 函数，支持以下用法：

(async () => {
  const result1 = await sum(1, 4, 6, 9, 2, 4);
  const result2 = await sum(3, 4, 9, 2, 5, 3, 2, 1, 7);
  const result3 = await sum(1, 6, 0, 5);
  console.log([result1, result2, result3]); // [26, 36, 12]
})();

// 要求 sum 能在最短的时间里返回以上结果
function sum() {
    const add = promiseify(asyncAdd)
   function queue(...args) {

      if(args.length < 2) return Promise.resolve(args[0])
      const result = [];

      for(let i = 0; i< args.length; ) {
         result.push([args[i], args[i + 1]])
         i = i + 2
      }

       const promises = result.map(item => add(...item))
       if(args.length / 2 !== 0) {
         promises.push(Promise.resolve(args[args.length - 1))
      }

      return Promise.all(promises).then(data => queue(data))

   }
    const a = [...arguments]
   return queue(a)
}

```
