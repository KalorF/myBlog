# 观察者模式

## 观察者模式介绍
- 发布&订阅
- 一对多

## 设计原则验证
- 主题和观察者分离，不是主动触发而是被动监听，两者解耦
- 符合开放封闭原则

## 示例
* 事例1
```js
// 主题，保存状态，状态变化之后出发所有观察者对象
class Subject {
  constructor() {
    this.state = 0
    this.observers = []
  }
  getState() {
    return this.state
  }
  setState(state) {
    this.state = state
    this.notifyAllObservers()
  }
  notifyAllObservers() {
    this.observers.forEach(observer => {
      observer.update()
    })
  }
  attach(observe) {
    this.observers.push(observe)
  }
}

// 观察者
class Observe {
  constructor(name, subject) {
    this.name = name
    this.subject = subject
    this.subject.attach(this)
  }
  update() {
    console.log(`${this.name} update, state: ${this.subject.getState()}`)
  }
}
// 测试
let s = new Subject()
let o1 = new Observe('o1', s)
let o2 = new Observe('o2', s)
let o3 = new Observe('o3', s)

s.setState(1)
s.setState(2)
s.setState(3) 
// o1 update, state: 1
// o2 update, state: 1
// o3 update, state: 1
// o1 update, state: 2
// o2 update, state: 2
// o3 update, state: 2
// o1 update, state: 3
// o2 update, state: 3
// o3 update, state: 3

```
* 事例2（nodejs中的观察者模式）
```js
const EventEmitter = require('events').EventEmitter

const emitter1 = new EventEmitter()
// 监听 some 事件
emitter1.on('some', info => {
  console.log('fn1', info)
})
// 监听 some 事件
emitter1.on('some', info => {
  console.log('fn2', info)
})
emitter1.emit('some', 'xxx')
```
* 事例2（继承）
```js
const EventEmitter = require('events').EventEmitter

// 继承
class Dog extends EventEmitter {
  constructor(name) {
    super()
    this.name = name
  }
}

let simon = new Dog('simon')
simon.on('bark', function (info) {
  console.log(this.name + '1', info)
})
simon.on('bark', function (info) {
  console.log(this.name + '2', info)
})
setInterval(function () {
  simon.emit('bark', 'xxxx')
}, 1000)
```
* 事例2（用流去读取文件）
```js
// stream 用到自定义事件
const fs = require('fs')
const readStream = fs.createReadStream('./data/file1.txt')

let length = 0
readStream.on('data', function (chunk) {
  let len = chunk.toString().length
  console.log('len', len)
  length += len
})
readStream.on('end', function () {
  console.log('length', length)
})
```

## 其它场景
- nodjs中：处理http请求；多进程通讯
- vue 和 React 组件生命周期
- vue watch