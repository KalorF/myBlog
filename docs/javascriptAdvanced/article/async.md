# 异步

## 什么是单线程，和异步的关系
**1. 单线程 - 只有一个线程，只能做一件事，两段 JS 代码不能同时执行**
```js
// 循环运行期间， JS 执行和 DOM 渲染暂时卡顿
var i, sum = 0
for (i = 0; i < 100000000; i++) {
  sum += i
}
console.log(sum)

// alert 不处理，JS 执行和 DOM 渲染暂时卡顿
console.log(1)
alert('hello')
console.log(2)
```

**2. 原因 - 避免 DOM 渲染的冲突**
- 浏览器需要渲染 DOM 
- JS 可以修改 DOM 结构
- JS 执行的时候，浏览器 DOM 渲染会暂停
- 两端 JS 不能同时执行（都修改 DOM 就冲突了）
- webworker 支持多线程，单不能访问 DOM 

**3. 解决方案 - 异步**
```js
console.log(100)
setTimeout(function () {
  console.log(200)
}, 1000)

console.log(300)
console.log(400)
```
**4. 存在问题**
- 问题一：没按照书写方式执行，可读性差
- 问题二：callback 中不容易模块化


## 什么是 event-loop
**1. 文字解析**
- 事件轮询，JS 实现异步的具体解决方案
- 同步代码，直接执行
- 异步函数先放在 异步队列 中
- 待同步函数执行完毕，轮询执行 异步队列 的函数
```js
$.ajax({
  url: 'xxxxx',
  success: function (result) {
    console.log('a') // 等待完成后再放在异步队列中
  }
})
setTimeout(function () {
  console.log('b')  // 100ms 后被放入异步队列中  
}, 100)
setTimeout(function () {
  console.log('c') // 立即被放入异步队列中
})
console.log('d')
```

## jQuery 的 Deferred
**1. jQuery 1.5 之前**
```js
var ajax = $.ajax({
  url: 'data.json',
  success: function () {
    console.log('success1')
    console.log('success2')
    console.log('success3')
  },
  error: function () {
    console.log('error')
  }
})
console.log(ajax) // 返回一个 XHR 对象
```
**2. jQuery 1.5 之后**
```js
// 第一种写法
var ajax = $.ajax('data.json')
ajax.done(function () {
  console.log('success1')
})
  .fail(function () {
    console.log('error')
  })
  .done(function () {
    console.log('success2')
  })
console.log(ajax) // 返回一个 defeered 对象

// 第二种写法
var ajax = $.ajax('data.json')
ajax.then(function () {
  console.log('success 1')
}, function () {
  console.log('error 1')
})
  .then(function () {
    console.log('success 2')
  }, function () {
    console.log('error 2')
  })

```

**3. JQuery 1.5 的变化**
- 无法改变 JS 异步和单线程的本质
- 只能在写法上杜绝 callback 这种形式
- 它是一种语法糖形式，但是解耦了代码
- 很好的体现：开放封闭原则
```js
function waitHandle() {
      // 定义
      var dtd = $.Deferred()
      var wait = function (dtd) {
        var task = function () {
          console.log('执行完成')
          dtd.resolve()
          // dtd.reject()
        }
        setTimeout(task, 1000)

        return dtd.promise()
      }
      // 最终返回
      return wait(dtd)
}

var w = waitHandle() // promise 对象
$.when(w).then(function () {
  console.log('ok 1')
}, function () {
  console.log('error 1')
}).then(function () {
  console.log('ok 2')
}, function () {
  console.log('error 2')
})
```

## Promise 的基本使用和原理
**1. 基本语法回顾**
```js
import 'babel-polyfill'
function loadImg(src) {

  return new Promise((resolve, reject) => {
    var img = document.createElement('img')
    img.onload = function () {
      resolve()
    }
    img.onerror = function () {
      reject()
    }
  })
  img.src = src
}
var src = 'xxxxx'
var result = loadImg(src)

result.then(function (img) {
  console.log(img.width)
}, function () {
  console.log('failed')
}).then(function (img) {
  console.log(img.height)
})
```

**2. 异常捕获**
```js
result.then(function (img) {
  console.log(img.width)
  return img
}).then(function (img) {
  console.log(img.height)
}).catch(function (ex) {
  // 统一捕获异常   
  console.log(ex)
})
```

**3. 多个串联**
```js
import 'babel-polyfill'
function loadImg(src) {

  return new Promise((resolve, reject) => {
    var img = document.createElement('img')
    img.onload = function () {
      resolve()
    }
    img.onerror = function () {
      reject()
    }
    img.src = src
  })

}
var src1 = 'xxxxx1'
var result1 = loadImg(src1)
var src2 = 'xxxxx2'
var result2 = loadImg(src2)

result1.then(function (img1) {
  console.log(img1.width)
  return result2
}).then(function (img2) {
  console.log(img2.width)
}).catch(function (ex) {
  console.log(ex)
})
```

**4. Promise.all 和 Promise.race**
```js
// Promise.all 接收一个Promise 对象的数组
// 待全部完成之后，统一执行success
Promise.all([result1, result2]).then(datas => {
  // 接收到的 datas 是一个数组，依次包含多个 promise 返回的内容
  console.log(datas[0])
  console.log(datas[1])
})

// Promise.race 接收一个包含多个 Promise 对象的数组
// 只要有一个完成，就执行 success
Promise.race([result1, result2]).then(data => {
  // data 为最先执行完成的返回值
  console.log(data)
})
```

**5. Promise 标准**
- 三种状态变化：pending fulfilled rejected
- 初始状态是 pending
- pending 变为 fulfilled，或者 pending 变为 rejected
- 状态不可逆
- Promise 实例必须实现 then 方法
- then() 必须可以接收两个函数作为参数
- then() 返回的必须是一个 Promise 实例


**6. async / await**
- 使用await，函数必须用 async 标识
- await 后面跟的事一个 Promise 实例
- 需要 babel-polyfill
```js
import 'babel-polyfill'
function loadImg(src) {

  return new Promise((resolve, reject) => {
    var img = document.createElement('img')
    img.onload = function () {
      resolve()
    }
    img.onerror = function () {
      reject()
    }
    img.src = src
  })

}
var src1 = 'xxxxx1'
var src2 = 'xxxxx2'

const load = async function () {
  const result1 = await loadImg(src1)
  console.log(result1)
  const result2 = await loadImg(src2)
  console.log(result2)
}
load()

```

**7. 当前异步解决方案**
- jQuery Deferred
- Promise
- async / await
- Generator
