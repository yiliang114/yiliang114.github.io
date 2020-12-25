---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 什么是 React Fiber?

Fiber 是 React v16 中新的 _reconciliation_ 引擎，或核心算法的重新实现。React Fiber 的目标是提高对动画，布局，手势，暂停，中止或者重用任务的能力及为不同类型的更新分配优先级，及新的并发原语等领域的适用性。

### React Fiber 的主要目标是什么?

_React Fiber_ 的目标是提高其在动画、布局和手势等领域的适用性。它的主要特性是 **incremental rendering**: 将渲染任务拆分为小的任务块并将任务分配到多个帧上的能力。
