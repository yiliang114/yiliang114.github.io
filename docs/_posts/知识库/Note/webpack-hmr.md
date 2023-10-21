---
title: webpack-hmr
date: 2020-11-21
draft: true
---

#### 5. HotModuleReplacement.runtime 对模块进行热更新

这一步是整个模块热更新（HMR）的关键步骤，而且模块热更新都是发生在 HMR runtime 中的 `hotApply` 方法中

```js
// webpack/lib/HotModuleReplacement.runtime
function hotApply() {
  // ...
  var idx;
  var queue = outdatedModules.slice();
  while (queue.length > 0) {
    moduleId = queue.pop();
    module = installedModules[moduleId];
    // ...
    // remove module from cache
    delete installedModules[moduleId];
    // when disposing there is no need to call dispose handler
    delete outdatedDependencies[moduleId];
    // remove "parents" references from all children
    for (j = 0; j < module.children.length; j++) {
      var child = installedModules[module.children[j]];
      if (!child) continue;
      idx = child.parents.indexOf(moduleId);
      if (idx >= 0) {
        child.parents.splice(idx, 1);
      }
    }
  }
  // ...
  // insert new code
  for (moduleId in appliedUpdate) {
    if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
      modules[moduleId] = appliedUpdate[moduleId];
    }
  }
  // ...
}
```

模块热更新的错误处理，如果在热更新过程中出现错误，热更新将回退到刷新浏览器，这部分代码在 dev-server 代码中，简要代码如下：

```js
module.hot
  .check(true)
  .then(function (updatedModules) {
    if (!updatedModules) {
      return window.location.reload();
    }
    // ...
  })
  .catch(function (err) {
    var status = module.hot.status();
    if (["abort", "fail"].indexOf(status) >= 0) {
      window.location.reload();
    }
  });
```
