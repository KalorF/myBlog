# 开发环境

## IDE（写代码的效率）
- webStorm
- sublime
- vscode
- atom

## git（代码版本管理，多人协作开发）
**git 常用命令**
- git add .
- git status
- git checkout xxx
- git commit -m "xxx"
- git push orgin master
- git pull origin master
- -git branch
- git checkout -b xxx / git checkout xxx
- git merge xxx
- git remote add orgin git@xxxx
- git diff （查看不同）

### JS 模块化
**1. 不适用模块化的情况**
```js
<script src="util.js"></script>
<script src="a-util.js"></script>
<script src="a.js"></script>
// 层级依赖关系，不能暴露给使用方，全局变量污染
```

**2. 使用模块化**
```js
// util.js
export {
    getFormDate:function(data, type) {
        //...
    }
}

// a-util.js
var getFormDate = require('util.js')
export {
    aGetFormDate:function (date) {
        return getFormDate(date, 2)
    }
}

// a.js
var aGetFormDate = require('a-util.js')
var dt = new Date()
console.log(aGetFormDate(dt))
```

**3. AMD (异步模块定义)**
- require.js requirejs.org
- 全局 define 函数
- 全局 require 函数
- 依赖 JS 会自动、异步加载
```js
// util.js
define(function () {
  return {
    getFormDate: function (date, type) {
      if (type === 1) {
        return '2019-04-02'
      }
      if (type === 2) {
        return '2019-04-03'
      }
    }
  }
})

// a-util.js
define(['./util.js'], function (util) {
  return {
    aGetFormDate: function (date) {
      return util.getFormDate(date, 2)
    }
  }
})

// a.js
define(['./a-util.js'], function (autil) {
  return {
    printDate: function (date) {
      console.log(autil.aGetFormDate(date))
    }
  }
})

// main.js
require(['./a.js'], function (a) {
  var date = new Date()
  a.printDate(date)
})

<script src="/require.min.js" data-main="./main.js"></script>
```

**4. CommonJS**
- nodejs 模块化规范，现在被大量应用于前端
- 前端开发依赖的插件和库，都可以从 npm 中获取
- 构建工具的高度自动化，使得使用 npm 的成本变低
- CommonJS 不会异步加载JS，而是同步一次性加载出来

```js
// util.js
module.exports = {
  getFormDate: function (date, type) {
    if (type === 1) {
      return '2019-04-02'
    }
    if (type === 2) {
      return '2019-04-03'
    }
  }
}

// a-util.js
var util = require('util.js')
module.exports = {
  aGetFormDate: function (date) {
    return util.getFormDate(date, 2)
  }
}
```
**5. AMD 和 CommonJS 的使用场景**
- 需要异步加载JS 使用AMD
- 使用了 npm 建议使用CommonJS

## 构建工具 (webpack)
```js
// webpack.config.js
var path = require('path')
var webpack = require('webpack')

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    app: './app/js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  plugins:[
    new webpack.optimize.UglifyJsPlugin() // 压缩
  ]
}
```

## 上线回滚流程
**1. 上线流程要点**
- 将测试完的代码提交到 git 版本库的 master 分支
- 将当前服务器的代码全部打包并记录版本号，备份
- 将 master 分支的代码提交覆盖到线上服务器，生成新版本号

**2. 回滚流程要点**
- 将当前服务器的代码打包并记录版本号，备份
- 将备份的上一个版本解压，覆盖到线上服务器，并生成新的版本号

**2. linux 基本命令**