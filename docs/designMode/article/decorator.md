# 装饰器模式

## 装饰器模式介绍
- 为对象添加新功能
- 不改变其原有的结构和功能

## 设计原则验证
- 将现有对象和装饰器进行分离，两者独立存在
- 符合开放封闭原则

## 事例
* 事例1
```js
class Circle {
  draw() {
    console.log('画一个圆形')
  }
}

class Decorator {
  constructor(circle) {
    this.circle = circle
  }
  draw() {
    this.circle.draw()
    this.setRedBorder(circle)
  }
  setRedBorder(circle) {
    console.log('设置为红色边框', circle)
  }
}

let circle = new Circle()
circle.draw()
console.log('---分割线----')
let des = new Decorator(circle)
des.draw()
// 打印结果
// 画一个圆形
// ---分割线----
// 画一个圆形
// 设置为红色边框 Circle{}
```
* 事例2 （ES 7 装饰器）
```js
function testDec(isDec) {
  return function (target) {
    target.isDec = isDec
  }
}

@testDec(false)
class Demo {

}
alert(Demo.isDec) // false
```
* 事例3
```js
function mixins(...list) {
  return function (target) {
    Object.assign(target.prototype, ...list)
  }
}

const Foo = {
  foo() {
    alert('foo')
  }
}

@mixins(Foo)
class MyClass {

}
let obj = new MyClass()
obj.foo() // foo
```
* 事例4
```js
function readonly(target, name, descriptor) {
  descriptor.writable = false
  return descriptor
}

class Person {
  constructor() {
    this.first = 'A'
    this.second = 'B'
  }
  @readonly
  name() {
    return `${this.first} ${this.second}`
  }
}

let p = new Person()
console.log(p.name()) // A B
```
* 事例5
```js
function log(target, name, descriptor) {
  let oldValue = descriptor.value
  descriptor.value = function () {
    console.log(`calling ${name} with`, arguments, target)
    return oldValue.apply(this, arguments) // 执行方法并且传递参数
  }
  return descriptor
}

class Math {
  @log
  add(a, b) {
    return a + b
  }
}

let math = new Math()
const result = math.add(2, 4)
console.log(result) // 6
```