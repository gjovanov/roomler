module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  plugins: ['import', 'standard'],
  extends: ['@nuxtjs', 'plugin:nuxt/recommended', 'standard'],
  // add your custom rules here
  rules: {
    'nuxt/no-cjs-in-config': 'off',
    'no-console': 'off',
    'vue/no-v-html': 'off',
    'vue/no-mutating-props': 'off',
    'vue/custom-event-name-casing': 'off',
    'multiline-ternary': 'off'
  }
}
