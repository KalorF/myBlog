# 异步和单线程
## 1. 什么是异步 ？
```js
console.log(100)
setTimeout(function() {
    console.log(200)
},1000)
console.log(300)
// 100 300 200

// 对比同步
console.log(100)
alert(200) // 1秒钟之后点击确认
console.log(300)
```
::: tip 何时需要同步
- 在可能发生等待的情况
- 等待过程中不能像 alert 一样阻塞程序运行
- 因此，所以 “等待的情况” 都需要异步
:::

## 2. 前端使用异步的场景
- 定时任务：setTimeout, setInterval 
- 网络请求：ajax 请求，动态 <img> 加载
- 事件绑定
```js
// ajax 请求例子
console.log('start')
$.get('./data1.json',function(data1) {
    console.log(data1)
})
console.log('end')
// 打印结果: start end data1的数据

// <img> 加载示例
console.log('start')
var img = document.createElement('img')
img.onload = function () {
    console.log('loaded')
}
img.src = '/xxx.png'
console.log('end')
// 打印结果：start end loaded

// 事件绑定示例
console.log('start')
document.getElementById('btn1').addEventListener('click', function() {
    laert('clicked')
})
console.log('end')
// 打印结果：start end 点击的时候clicked
```

## 3. 异步和单线程
```
console.log(100)
setTimeout(function(){
    console.log(200)
})
console.log(300)
```
- 执行第一行，打印 100
- 执行 setTimeout 后，传入setTimeout 的函数会被暂存起来，不会立即执行（单线程的特点，不能同时干两件事）
- 执行最后一行，打印 300
- 待所有程勋执行完，处于空闲状态时，会立马看有没有暂存起来的要执行
- 发现暂存起来的 setTimeout 中的函数无需等待事件，就立即执行

## 4. 同步和异步的区别是什么？
- 同步会阻塞代码执行，而异步不会
- alert 是同步，setTimeout 是异步

## 5. 一个关于 setTimeout 的面试题
```js
console.log(1)
setTimeout(function(){
   console.log(2) 
},0)
console.log(3)
setTimeout(function(){
   console.log(4) 
},1000)
console.log(5)

// 打印结果：1 3 5 2 4（一秒钟之后打印）
```