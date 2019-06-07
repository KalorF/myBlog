# webpack基础配置

**安装插件**
- npm install --save-dev webpack webpack-cli babel-latest @babel/core @babel/preset-env
- 配置webpack.config.js
```js
module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname, // 单签路径
    filename: './build/bundle.js'  // 输出文件名
  },
  module: {
    rules: [{
      test: /\.js?$/,
      exclude: /(node_modules)/, // 忽略node_modules
      loader: 'babel-loader'
    }]
  }
}
```
- 配置 .babelrc
```js
{
  "presets": [
    "@babel/preset-env"
  ],
  "plugins": []
}
```
- package.json 配置 scripts "webpack"