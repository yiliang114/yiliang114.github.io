module.exports = {
  root: true,
  env: {
    node: true,
    jest: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'vue/no-unused-components': [
      'warn',
      {
        ignoreWhenBindingPresent: true
      }
    ],
    // if 条件判断中的逻辑运算符位置
    'operator-linebreak': [2, 'after', { overrides: { '?': 'after' } }]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
