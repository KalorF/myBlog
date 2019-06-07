# 状态模式

## 状态模式介绍
- 一个对象有状态变化
- 每次状态变化都出发一个逻辑
- 不能总是用 if...else 来控制

## 设计原则验证
- 将状态对象和主体对象进行分离，状态的变化逻辑单独处理
- 符合开放封闭原则

## 事例
* 事例1（红绿灯）
```js
// 状态（红灯、绿灯、黄灯）
class State {
  constructor(color) {
    this.color = color
  }
  handle(context) {
    console.log(`turn to ${this.color} light`)
    // 设置状态
    context.setState(this)
  }
}

// 主体
class Context {
  constructor() {
    this.state = null
  }
  // 获取状态
  getState() {
    return this.state
  }
  setState(state) {
    this.state = state
  }
}
// 测试
let context = new Context()

let green = new State('green')
let yellow = new State('yellow')
let red = new State('red')

// 绿灯亮了
green.handle(context)
console.log(context.getState())
// 黄灯亮了
yellow.handle(context)
console.log(context.getState())
// 红灯亮了
red.handle(context)
console.log(context.getState())
```
* 事例2（利用第三方库实现Javascript-state-machine 更新收藏状态）
```js
import StateMachine from 'javascript-state-machine'
import $ from 'jquery'
// 初始化状态机模型
let fsm = new StateMachine({
  init: '收藏',
  transitions: [
    {
      name: 'doStore',
      from: '收藏',
      to: '取消收藏'
    },
    {
      name: 'deleteStore',
      from: '取消收藏',
      to: '收藏'
    }
  ],
  methods: {
    // 监听执行收藏
    onDoStore: function () {
      alert('收藏成功')
      updateText()
    },
    onDeleteStore: function () {
      alert('取消成功')
      updateText()
    }
  }
})

let $btn = $('#bt1')
$btn.click(function () {
  if (fsm.is('收藏')) {
    fsm.doStore()
  } else {
    fsm.deleteStore()
  }
})

// 更新按钮文案
function updateText() {
  console.log(fsm.state)
  $btn.text(fsm.state)
}
// 初始化文案
updateText()
```