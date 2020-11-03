---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 在 React 测试中什么是浅层渲染（Shallow Renderer）?

     *浅层渲染*对于在 React 中编写单元测试用例很有用。它允许您渲染一个*一级深的组件*并断言其渲染方法返回的内容，而不必担心子组件未实例化或渲染。

     例如，如果您有以下组件：

     ```javascript
     function MyComponent() {
       return (
         <div>
           <span className={'heading'}>{'Title'}</span>
           <span className={'description'}>{'Description'}</span>
         </div>
       )
     }
     ```

     然后你可以如下断言：

     ```jsx
     import ShallowRenderer from 'react-test-renderer/shallow'

     // in your test
     const renderer = new ShallowRenderer()
     renderer.render(<MyComponent />)

     const result = renderer.getRenderOutput()

     expect(result.type).toBe('div')
     expect(result.props.children).toEqual([
       <span className={'heading'}>{'Title'}</span>,
       <span className={'description'}>{'Description'}</span>
     ])
     ```

### 在 React 中 `TestRenderer` 包是什么?

     此包提供了一个渲染器，可用于将组件渲染为纯 JavaScript 对象，而不依赖于 DOM 或原生移动环境。该包可以轻松获取由 ReactDOM 或 React Native 平台所渲染的视图层次结构（类似于DOM树）的快照，而无需使用浏览器或`jsdom`。

     ```jsx
     import TestRenderer from 'react-test-renderer'

     const Link = ({page, children}) => <a href={page}>{children}</a>

     const testRenderer = TestRenderer.create(
       <Link page={'https://www.facebook.com/'}>{'Facebook'}</Link>
     )

     console.log(testRenderer.toJSON())
     // {
     //   type: 'a',
     //   props: { href: 'https://www.facebook.com/' },
     //   children: [ 'Facebook' ]
     // }
     ```

### ReactTestUtils 包的目的是什么?

     *ReactTestUtils*由`with-addons`包提供，允许您对模拟 DOM 执行操作以进行单元测试。

### 什么是 Jest?

     *Jest*是一个由 Facebook 基于 Jasmine 创建的 JavaScript 单元测试框架，提供自动模拟创建和`jsdom`环境。它通常用于测试组件。

### Jest 对比 Jasmine 有什么优势?

     与 Jasmine 相比，有几个优点：

     - 自动查找在源代码中要执行测试。
     - 在运行测试时自动模拟依赖项。
     - 允许您同步测试异步代码。
     - 使用假的 DOM 实现（通过`jsdom`）运行测试，以便可以在命令行上运行测试。
     - 在并行流程中运行测试，以便更快完成。

### 举一个简单的 Jest 测试用例

     让我们为`sum.js`文件中添加两个数字的函数编写一个测试：

     ```javascript
     const sum = (a, b) => a + b

     export default sum
     ```

     创建一个名为`sum.test.js`的文件，其中包含实际测试：

     ```javascript
     import sum from './sum'

     test('adds 1 + 2 to equal 3', () => {
       expect(sum(1, 2)).toBe(3)
     })
     ```

     然后将以下部分添加到`package.json`：

     ```json
     {
       "scripts": {
         "test": "jest"
       }
     }
     ```

     最后，运行`yarn test`或`npm test`，Jest 将打印结果：

     ```console
     $ yarn test
     PASS ./sum.test.js
     ✓ adds 1 + 2 to equal 3 (2ms)
     ```
