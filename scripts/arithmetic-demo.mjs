function twoSum(nums = [], target) {
  const map = {}
  for (const num of nums) {
    const tmp = target - num
    if (map[tmp] !== undefined) return [num, tmp]
    map[num] = true
  }
}

function threeSum(nums = []) {
  const result = []
  for (const num of nums) {
    const tmp = twoSum(nums.filter((val) => val !== num), -1 * num)
    console.log(tmp)
    if (tmp) {
      result.push([num, ...tmp])
    }
  }
  return Array.from(new Set(result.map()))
}

console.log(threeSum([-1, 0, 1, 2, -1, -4]))
