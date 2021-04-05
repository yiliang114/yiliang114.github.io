const state = {
  padding: 'PADDING',
  resolved: 'RESOLVED',
  rejected: 'REJECTED',
}

function MyPromise(fn) {
  let that = this
  that.currentState = state.padding
  that.value = null
  // `resolvedCallbacks` 和 `rejectedCallbacks` 用于保存 `then` 中的回调
  // 因为当执行完`Promise` 时状态可能还是等待中，这时候应该把`then` 中的回调保存起来用于状态改变时使用
  that.resolvedCallbacks = []
  that.rejectedCallbacks = []

  that.resolve = function (value) {
    // 对于 `resolve` 函数来说，首先需要判断传入的值是否为 `Promise` 类型
    if (value instanceof MyPromise) {
      return value.then(that.resolve, that.reject)
    }
    // 为了保证函数执行顺序，需要将两个函数体代码使用 `setTimeout` 包裹起来
    setTimeout(() => {
      if (that.currentState === state.padding) {
        that.currentState = state.resolved
        that.value = value
        that.resolvedCallbacks.forEach(cb => cb(value))
      }
    })
  }

  that.reject = function (reason) {
    // 为了保证函数执行顺序，需要将两个函数体代码使用 `setTimeout` 包裹起来
    setTimeout(() => {
      if (that.currentState === state.padding) {
        that.currentState = state.rejected
        that.value = reason
        that.rejectedCallbacks.forEach(cb => cb(reason))
      }
    })
  }

  try {
    fn(that.resolve, that.reject)
  } catch (err) {
    that.reject(err)
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  const that = this;
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : r => {
        throw r;
      };
  if (that.state === state.padding) {
    that.resolvedCallbacks.push(onFulfilled);
    that.rejectedCallbacks.push(onRejected);
  }
  if (that.state === state.resolved) {
    onFulfilled(that.value);
  }
  if (that.state === state.rejected) {
    onRejected(that.value);
  }
};
