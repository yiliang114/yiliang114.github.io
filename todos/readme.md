### reduce

[mdn](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

> `arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])` 如果没有提供 initialValue 则第一个值除外

发现一个有意思的东西？

```js
var files = ["111", "222", "333", "444"];
var result = files.reduce((content, filename) => {
  console.log("content", content);
  console.log("filename", filename);
  return content + filename;
}, "");
console.log(result);
```

```js
var files = ["111", "222", "333", "444"];
var result = files.reduce((content, filename) => {
  console.log("content", content);
  console.log("filename", filename);
  return content + filename;
});
console.log(result);
```

reduce
