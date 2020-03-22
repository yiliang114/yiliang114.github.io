module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  rules: {
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },
  rules: {
    // if 条件判断中的逻辑运算符位置
    "operator-linebreak": [2, "after", { overrides: { "?": "after" } }]
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
