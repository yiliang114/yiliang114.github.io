var lengthOfLongestSubstring = function (s = '') {
  let start = 0, longestLen = 0;
  const map = {}

  for (let i = 0; i < s.length; i++) {
    const val = s[i]

    if (val in map && map[val] >= start) {
      // 旧节点往后移一位
      start = map[val] + 1
      map[val] = i
    } else {
      map[val] = i
      longestLen = Math.max(longestLen, i + 1 - start)
    }
  }
  return longestLen
};

console.log(lengthOfLongestSubstring('aab'))
console.log(lengthOfLongestSubstring('abcabcbb'))
console.log(lengthOfLongestSubstring('dvdf'))
