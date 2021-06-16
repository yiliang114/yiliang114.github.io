---
title: react 性能优化
date: '2020-10-26'
draft: true
---

# react 性能优化

### 组件的异步数据加载

我不想在一开始挂载组件的时候就去异步操作（或者可以直接懒加载，那就可以在 constructor 中直接去加载异步数据。。），比如说 modal 的异步数据加载，最好是在 visable === true 的时候进行 ajax，否则 ajax 消耗的事件影响首屏体验。

```
import { observable, action, configure, runInAction, transaction } from 'mobx'
import { getBaseInfo, getExtractStatus, getExtractInfo } from '../../services/apis';

configure({ enforceActions: true })

class SupernatantStore {
  @observable visible = false
  @observable baseInfo = []
  @observable extractInfo = []
  @observable extractStatus = []

  // 一般很多人都会在组件初始化的时候进行ajax 操作
  // 但是实际页面在首屏渲染的时候就会挂载组件，执行constructor操作
  // constructor() {
  //   this.initData()
  // }

  initData = async () => {
    let result = await getBaseInfo()
    runInAction("上面的action修饰不到", () => {
      // console.log('runInAction...')
      this.baseInfo = result.data
    })

    result = await getExtractInfo()
    runInAction("上面的action修饰不到", () => {
      this.extractInfo = result.data
    })

    result = await getExtractStatus()
    runInAction("上面的action修饰不到", () => {
      this.extractStatus = result.data
    })
  }


  @action changeVisible = (bool) => {
    this.visible = typeof bool === 'boolean' ? bool : false
    // 这里优化组件的加载速度，只有在modal 显示的时候才会请求数据
    this.visible && this.initData()
  }

}

export default new SupernatantStore
```

或者 其实 我比较常用的一种简单的懒加载方式：

主要实现的原理也是 根据组件是否 **可见** 或者 **loading** 状态下 来选择是否 return dom。

```
            {
              this.state.current < steps.length - 1
              &&
              <div>
                <Button type="primary" onClick={() => this.next()}>下一步</Button>
                <Button style={{ marginLeft: 8 }} onClick={() => this.next()}>取消</Button>
              </div>
            }
```

## state or store？

这里有一条原则：只要是 别的组件不要使用到的属性（自产自销的那种。。。）， 那么久放在 state 中吧，毕竟如果强行放入 store 中，对于属性的操作，还不是得再实现一个 change 函数来改变属性的值，那跟 setState 有什么区别？ （唯一区别可能是 setState 的异步性。。。）

### Stateless Component or Class or PureComponent ？

stateless Component（无状态组件）只用作展示，一般不包含复杂逻辑。 已经很接近 一般的函数了。除了必须引入 React 。。。。

原则是： 如果组件使用 props 就可以的话（使用 state 并没有带来任何便利。。每个组件的 state 就像一个私有作用域，外部如果想要访问 很麻烦很麻烦。。。），直接上 stateless Component， 代码更简单。
