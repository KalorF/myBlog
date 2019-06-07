# 工厂模式

## 工厂模式概括
- 将 new 操作单独封装
- 遇到 new 时，就要考虑是否使用该工厂模式

## 设计原则验证
- 构造函数和创建者分离
- 符合开放封闭原则

## 例子
```js
class Product {
  constructor(name) {
    this.name = name
  }
  init() {
    alert(`init ${this.name}`)
  }
  fun1() {
    alert('fun1')
  }
  fun2() {
    alert('fun2')
  }
}

class Creator {
  create(name) {
    return new Product(name)
  }
}

let creator = new Creator()
let p = creator.create('p1')
p.init()
p.fun1()
```