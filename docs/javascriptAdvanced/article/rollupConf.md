# rollup基础配置

**vue react 中使用的代码打包工具**
* 安装相关插件
- npm install --save-dev rollup rollup-plugin-babel rollup-plugin-node-resolve @bebel/core @babel/plugin-external-helpers @babel/preset-env
- 配置 rollup.config.js
```js
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'src/index.js',
  output: {
    file: 'build/build.js',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
```

- 配置 .babelrc
```js
{
  "presets": [
    "@babel/preset-env"
  ],
  "plugins": [
    "@babel/external-helpers"
  ]
}
```
- package.json 执行 "rollup -c rollup.config.js"
