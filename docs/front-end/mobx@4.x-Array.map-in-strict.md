### mobx@4.x 严格模式下 Array.map 的一点问题

背景是 React + mobx@4.x + antd 的项目，并且打开了严格模式的情况下：

```
configure({ enforceActions: true })
```

大概我的需求是， 将 store 中的一个数组（dataSource）在 stateless Component 中进行渲染，那么自然就想到了 Array 的 map 方法，然后再 JSX 中直接将数组转成 JSX 代码块。

```
const wrapperItem = (title, list) => {
  const result = list.map((item, index) => <Row>
    <Col span={2}>
      {index}
    </Col>
    <Col span={2}>
      {item}
    </Col>
  </Row>)
  return (
    <div>
      <h4>{title}</h4>
      {result}
    </div>
  )
}
```

上面的 demo 代码中的第二个参数 list 会传入 observable 属性----是一个数组。

然后浏览器狂报错误:

```
[mobx] Since strict-mode is enabled, changing observed observable values outside actions is not allowed. Please wrap the code in an `action` if this change is intended. Tried to modify: SupernatantStore@13.data.baseInfo
```

然后看一下 下面的简单代码排查错误吧：

```
var list = [{'a': 1},{'a': 2}];
var newList = list.map(function(index){
    return index.a += 1;
});
console.log(newList,'newList',list,'list');
// newList 和 list 都改变了。先修改了list的单个key值，再将key值返回，自然就修改了两个

var list = [{'a': 1},{'a': 2}];
var newList = list.slice(0).map(function(index){
    return index.a += 1;
});
console.log(newList,'newList',list,'list');
// newList 和 list 也都改变了，关键很不理解，明明 list 跟 list.slice(0) 已经不是指向同一个数组，为什么list.slice(0) 修改内容还会引发list 也改变？


// wa ...
// 难受的一批。。。
// slice() concat() 都是浅拷贝，整个数组的指向是不同的了，但是，里面的对象的指向是同一个，所以其实在map里执行的函数，操作的对象还是同一个。。。
list.slice(0)[0] === list[0] // truw
list.slice(0) === list // false
```

同样的，es6 的解构赋值，也只是浅拷贝：

```
    var a = {b: {c:111},d:{d:2222}}
    var {b} = a
    b === a.b
    // true
```

所以说，mobx 严格模式下一直再警告我不能修改 observable 的值。

---

```
  constructor() {
    this.initData()
  }
  @action initData = async () => {

     this.baseInfo = await getBaseInfo()
     this.extractInfo = await getExtractInfo()
     this.extractInfo = await getExtractStatus()

  }
```

我之前的代码是这样的，其实，我觉得连`@action` 也不要，因为就算在严格模式下`constructor`函数中也是可以修改 observable 中的值的。

那为什么一直报不能在`action`之外修改 observable 属性的错误呢？

action 仅影响当前运行的函数,而不会影响异步函数，这意味着如果你有 setTimeout,promise, then 或 异步的 constructor ,在回调更多的状态改变,这些回调应包装在 runInAction 中。。。。

写在最后：

1. 我之前真的没有好好注意这个问题，对于以前没有任何限制引用值的 `set` 的时候，我往往只关心我得到的值（return 出来的）是不是我想要的。。。。
2. 说明我对于什么 `slice`,`concat()` 产生一个新的数组这一个概念的理解，只停留于表面。。。。
