---
sidebarDepth: 2
---
# 其它

## 原型模式
- clone 自己，产生一个新的对象
- java 默认有 clone 接口，不用自己实现
- 对比JS中的原型 <code>prototype</code>
::: tip 对比
  1. prototype 可以理解为ES6 class 的一种底层原理
  2. 而 class 是实现面向对象的基础，并不服务与某个模式
  3. Object.create()会长久存在
:::
* 事例 <code>Object.create()</code>
```js
const prototype = {
  getName: function () {
    return this.first + ' ' + this.last
  },
  say: function () {
    alert('hello')
  }
}

let x = Object.create(prototype)
x.first = 'A'
x.last = 'B'
alert(x.getName())

let y = Object.create(prototype)
y.first = 'C'
y.last = 'D'
alert(y.getName())
```
## 桥接模式
- 用于把抽象化与实现化解耦
- 使得两者可以独立变化

## 组合模式
- 生成树形结构，表示 “整体-部分” 关系
- 让整体和部分都具有一致的操作方式
- vDome中的dome

* 设计原则验证
::: tip 验证
1. 将整体和单个节点的操作抽象出来
2. 符合开放封闭原则
:::

## 享元模式
- 共享内存（主要考虑内存，而非效率）
- 相同的数据，共享使用
* 设计原则验证
::: tip 验证
1. 将相同的部分抽象出来
2. 符合开放封闭原则
:::

## 策略模式
- 不同策略分开处理
- 避免出现大量 <code>if...else</code> 或者 <code>switch...case</code>

* 设计原则验证
::: tip 验证
- 不同策略，分开处理，而不是混在一起
- 符合开放封闭原则
:::

* 事例
```js
class OrdinaryUser {
  buy() {
    console.log('普通用户购买')
  }
}

class MemberUser {
  buy() {
    console.log('会员用户购买')
  }
}

class VipUser {
  buy() {
    console.log('vip用户购买')
  }
}

let u1 = new OrdinaryUser()
u1.buy()
let u2 = new MemberUser()
ux.buy()
let u3 = new VipUser()
u3.buy()
```

## 命令模式
- 执行命令时，发布者和执行者分开
- 中间加加入命令对象，作为中转站

* 设计原则验证
::: tip 验证
1. 命令对象与执行对象分开，解耦
2. 符合开放封闭原则
:::

* 事例
```js
// 接受者
class Receiver {
  exec() {
    console.log('执行')
  }
}

// 命令者
class Commond {
  constructor(receiver) {
    this.receiver = receiver
  }
  cmd() {
    console.log('执行命令')
    this.receiver.exec()
  }
}

// 触发者
class Invoker {
  constructor(commond) {
    this.commond = commond
  }
  invoke() {
    console.log('开始')
    this.commond.cmd()
  }
}

// 士兵
let soldier = new Receiver()
// 小号手
let trumpeter = new Commond(soldier)
// 将军
let general = new Invoker(trumpeter)
general.invoke()
// 开始
// 执行命令
// 执行
```