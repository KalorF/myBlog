# 作用域和闭包

## 变量声明（先被赋值成undefined）
```js
console.log(a)
var a = 100
// undefined

fn1()
var fn1 = function () {
    console.log(1)
}
// fn1 is not a function
```

## 函数声明 （函数会提前）
```js
fn1('zhanshan')
function fn1(name) {
  age = 20
  console.log(name, age)
  var age
}
// zhangsan 20
```

## 执行上下文
- 一段 <code>script</code> 或者一个函数
- 全局：变量定义、函数声明
- 函数：变量定义、函数声明、this、arguments

PS：注意“函数声明” 和 “变量表达式” 的区别
```js
console.log(a) // undefined
var a = 100

fn('zhangsan') // 'zhangsan' 20
function fn(name) {
    age = 20
    console.log(name, age)
    var age
}
```

## this
- this 要在执行时才能确认值，定义时无法确认
```js
var a = {
    name: 'A',
    fn: function () {
        console.log(this.name)
    }
}
a.fn() // this === a
a.fn.call({name: 'B'}) // this === {name: 'B'}
var fn1 = a.fn
fn1() // this === window
```

- 作为构造函数执行
```js
function Foo(name) {
    // var this = {}
    this.name = name
    // return this
}
var f = new Foo('zhangsan')
```

- 作为对象属性执行
```js
var obj = {
    name: 'A',
    printName: function () {
        console.log(this.name)
    }
}
obj.printName() // A this 指向obj
```

- 作为普通函数执行 (window)
```js
function fn() {
    console.log(this) // this === window
}
fn()
```

- call apply bind
```js
function fn1(name) {
  console.log(name)
  console.log(this)
}
fn1.call({ x: 100 }, 'zhangsan')
// zhangsan
// { x: 100 } 为this
// apply({ x: 100 }, ['zhangsan']) 后面参数传入数组

// bind 必须是变量声明
var fn2 = function (name) {
  console.log(name)
  console.log(this)
}.bind({ y: 200 })

fn2('zhangsan')
```

## 作用域
- 没有块级作用域
```js
// 无块级作用域
if (true) {
    var name = 'zhangsan'
}
console.log(name) // zhangsan
```

- 只有函数和全局作用域
```js
// 函数和全局作用域
var a = 100
function fn() {
    var a = 200
    console.log('fn', a) // fn 200
}
console.log('global', a) // global 100
fn()
```

## 作用域链
```js
var a = 100
function fn() {
    var b = 200
    
    // 当前函数没有定义的变量，即“自由变量”
    console.log(a)
    
    console.log(b)
}
fn()

var a = 100
function F1() {
    var b = 200
    function F2() {
        var c = 300
        console.log(a) // 自由变量 100
        console.log(b) // 自由变量 200
        console.log(c) // 300
    }
    F2()
}
F1()
```

## 闭包
- 函数作为返回值
- 函数作为参数传递
```js
function fn1() {
  var a = 100
  // 返回一个函数（函数作为返回值）
  return function () {
    console.log(a) // 自由变量，在父级作用域中寻找
  }
}
f1 得到一个函数
var f1 = fn1()
var a = 200
f1() // 100
```
**1. 说一下对变量提升的理解（执行上下文）**
- 变量定义
- 函数声明（注意和函数表达式的区别）

**2. 说明 this 几种不同的使用场景**
- 作为构造函数执行
- 作为对象属性执行
- 作为普通函数执行
- call apply bind

**3. 创建 10 个 a 标签 点击的时候弹出来对应的序号**
```js
// 错误写法
var i，a
for (i = 0; i < 10; i++) {
    a = document.createElement('a')
    a.innerHTML = i + '<br>'
    a.addEventListener('click', function (e) {
      e.preventDefault()
      alert(i) // 自由变量，要去父级作用域中找 为 10
    })
    document.body.appendChild(a)
}
// 正确写法
var i
for (i = 0; i < 10; i++) {
  (function (i) {
    var a = document.createElement('a')
    a.innerHTML = i + '<br>'
    a.addEventListener('click', function (e) {
      e.preventDefault()
      alert(i)
    })
    document.body.appendChild(a)
  })(i)
}
```

**4. 如何理解作用域**
- 自由变量
- 作用域链，即自由变量中查找
- 闭包的连个场景

**5. 实际开发中闭包的应用**
```js
// 闭包实际应用中主要用于封装变量，收敛权限
function isFirstLoad() {
    var _list = []
    return function(id) {
        if (_list.indexof(id) >= 0){
            return false
        } else {
            _list.push(id)
            retrun true
        }
    }
}
// 使用
var firstLoad = isFirstLoad()
firstLoad(10) // true
firstLoad(10) // false
firstLoad(20) // true
```