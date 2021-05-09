let bool = false

function add(a, b, time = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      bool = !bool
      resolve(a + b);
    }, Math.floor(Math.random() * time))
  })
}

// 要求 sum 能在最短的时间里返回以上结果
async function sum() {
  console.time('sum')
  function queue(nums) {
    let len = nums.length
    if (len === 0) return Promise.resolve(0)
    if (len === 1) return Promise.resolve(nums[0])

    const result = [];
    let executing = [];

    while (len >= 2) {
      result.push([nums[len - 1], nums[len - 2]])
      len = len - 2
    }

    if (len === 1) {
      executing.push(Promise.resolve(nums[0]))
    }
    executing = [...executing, ...result.map((item, index) => add(...item, index / 2 === 0 ? 1000 : 2000))]
    return Promise.all(executing).then(data => queue(data))
  }
  const result = await queue([...arguments])
  console.timeEnd('sum')
  console.log(result)
  return result
}

async function sum1(...nums) {
  console.time('sum1')
  // 主运行队列
  let executing = [];
  // 副运行队列
  let executingCopy = []

  function queue() {
    let len = nums.length
    if (len === 0) return Promise.resolve(0)
    if (len === 1) return Promise.resolve(nums[0])

    const result = [];
    while (len >= 2) {
      result.push([nums[len - 1], nums[len - 2]])
      len = len - 2
    }

    if (len === 1) {
      executingCopy.push(nums[0])
    }

    executing = result.map((item, index) => {
      const p = add(...item, index / 2 === 0 ? 1000 : 2000).then((data) => {
        executing.splice(executing.indexOf(p), 1)
        return data
      })
      return p
    })

    function loop() {
      return Promise.race(executing).then(data => {
        executingCopy.push(data)
        // 副队列满 2 个，创建一个新的 promise 加入主队列
        if (executingCopy.length >= 2) {
          const a = executingCopy.shift()
          const b = executingCopy.shift()
          bool = !bool
          const p = add(a, b, bool ? 1000 : 2000).then((data) => {
            executing.splice(executing.indexOf(p), 1)
            return data
          })
          executing.push(p)
        }
        // 退出条件：主队列执行完毕，副队列只剩最后一个结果
        if (!executing.length) {
          return executingCopy[0]
        }
        return loop()
      })
    }

    return loop()
  }

  const result = await queue([...arguments])
  console.timeEnd('sum1')
  console.log(result)
  return result
}

(async () => {
  await sum(1, 4, 6, 9, 2, 4);
  await sum1(1, 4, 6, 9, 2, 4);
  await sum(3, 4, 9, 2, 5, 3, 2, 1, 7);
  await sum1(3, 4, 9, 2, 5, 3, 2, 1, 7);
  await sum(1, 6, 0, 5);
  await sum1(1, 6, 0, 5);
})();

