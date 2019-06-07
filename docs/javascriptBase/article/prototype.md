# 原型和原型链

## 1. 构造函数
```js
function Foo(name, age) {
    // this 默认为空对象
    this.name = name
    this.age = age
    this.class = 'class-1'
    // return this 默认有这一行
}

var f = new Foo('zhangshan', 20)
var f1 = new Foo('lisi', 21) // 创建多个对象
```
## 2. 构造函数扩展

- var a = {} 其实是 var a = new Object() 的语法糖
- var a = [] 其实是 var a = new Array() 的语法糖
- function Foo(){...} 其实是 var Foo = new
Function(...)
- 使用 instanceof 判断一个函数是否是一个变量的构造函数

## 3. 原型规则和示例
- 所有的引用类型（数组、对象、函数），都具有对象特性，即可自由扩展（除了null）
```js
var obj = {}; obj.a = 100;
var arr = []; arr.a = 100;
function fn () {}
fn.a = 100;
```

- 所有的引用类型（数组、对象、函数），都有一个 __proto__ 属性，属性值是一个普通对象
```js
console.log(obj.__proto__);
console.log(arr.__proto__);
console.log(fn.__proto__);
```

- 所有的函数，都有一个 prototype 属性，属性值也是一个普通对象
```js
console.log(fn.prototype)
```

- 所有的引用类型（数组、对象、函数），__proto__ (隐式类型属性) 属性值指向它的构造函数的   "prototype" (显式类型属性) 属性值
```js
console.log(obj.__proto__ === Object.prototype) // true
```

- 当试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么会去它的__proto__ (即它的构造函数prototype) 中寻找
```js
function Foo(name) {
  this.name = name
}
Foo.prototype.alertName = function () {
  console.log(this.name)
}

var f = new Foo('zhangshan') // 隐式原型
f.printName = function () {
  console.log(this.name)
}

f.printName()
f.alertName() // 没有这个属性，会在 prototype（显式原型） 中去找（即 Foo.prototype）
// zhangshan
// zhangshan
```

- 循环对象自身的属性
```js
var item
for (item in f) {
    // 高级浏览器已经在 for in 中屏蔽了来自原型的属性
    // 建议加上判断，加强代码的健壮性
    if (f.hasOwnPrototype(item)) {
        console.log(item)
    }
}
```

## 4. 原型链
```js
f.toString() // 要去 f.__proto__.__proto__ 中查找
```
::: tip 提示
  <code>f.__proto__(Foo.prototype)</code>, <code>f.__proto__.__proto__ </code>对应<code>Object.prototype</code> （注意：再往下找为 null）
:::

## 5. instanceof
- 用于判断 **引用类型** 属于哪个 **构造函数** 的方法
::: tip 提示
  f instanceof Foo 的判断逻辑是：
  f 的__proto__ 一层一层往上，能否对应到Foo.prototype; 再试着判断 f instanceof Object
:::

## 6. 原型和原型链 - 解答
- 如何判断一个变量是数组类型
```js
var arr = []
arr instanceof Array // true
typeof arr // object, typeof 是无法判断是否是数组的
```
- 写一个原型链继承的例子
```js
// 动物
function Animal() {
    this.eat = function () {
        console.log('animal eat')
    }
}
// 狗
function Dog() {
    this.bark = function () {
        console.log('dog bark')
    }
}

Dog.prototype = new Animal()
// 哈士奇
var hashiqi = new Dog()
```

- 描述 new 一个对象的过程
1. 创建一个新对象
2. this 指向这个新对象
3. 执行代码，即对 this 赋值
4. 返回 this
```js
// 构造函数
function Foo(name, age) {
    this.name = name
    this.age = age
    this.class = 'class-1'
    // return this 默认有这一行
}
var f = new Foo('zhangsan', 21)
```

- zepto （或其它框架）源码中如何使用原型链
```js
function Elem(id) {
  this.elem = document.getElementById(id)
}

Elem.prototype.html = function (val) {
  var elem = this.elem
  if (val) {
    elem.innerHTML = val
    return this // 链式操作
  } else {
    return elem.innerHTML
  }
}

elem.prototype.on = function (type, fn) {
  var elem = this.elem
  elem.addEventListener(type, fn)
  return this // 进行链式操作
}

var div1 = new Elem('div1')
// console.log(div1.html())
div1.html('<p>hello world</p>').on('click', function () {
  alert('clicked')
}).html('<p>javascript</p>')
```