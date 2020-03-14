module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["standard", "plugin:vue/recommended"],
  rules: {
    // if 条件判断中的逻辑运算符位置
    "operator-linebreak": [2, "after", { overrides: { "?": "after" } }]
  }
};
