
# 单例模式

## 单例模式介绍
- 系统中被唯一使用
- 一个类只有一个实例

## 设计原则验证
- 符合单一职责原则，只实例化唯一对象
- 没法具体开发封闭原则，但是绝对不违反开放封闭原则

* 事例1
```js
class singleObject {
  login() {
    console.log('login...')
  }
}

singleObject.getInstance = (function () {
  let instance
  return function () {
    if (!instance) {
      instance = new singleObject()
    }
    return instance
  }
})()

let obj1 = singleObject.getInstance()
obj1.login()
let obj2 = singleObject.getInstance()
obj2.login()

console.log('obj1 === obj2', obj1 === obj2) // true

let obj3 = new singleObject() // 无法完全控制
obj3.login()
console.log('obj1 === obj3', obj1 === obj3) // false

```

* 事例2

```js
class LoginForm {
  constructor() {
    this.state = 'hide'
  }
  show() {
    if (this.state === 'show') {
      alert('已经显示')
      return
    }
    this.state = 'show'
    console.log('登录框显示成功')
  }
  hide() {
    if (this.state === 'hide') {
      alert('已经隐藏')
      return
    }
    this.state = 'hide'
    console.log('登录框隐藏成功')
  }
}

LoginForm.getInstance = (function () {
  let instance
  return function () {
    if (!instance) {
      instance = new LoginForm()
    }
    return instance
  }
})()

let login1 = LoginForm.getInstance()
login1.show()

let login2 = LoginForm.getInstance()
login2.hide()

console.log('login1 === login2', login1 === login2) // true

```