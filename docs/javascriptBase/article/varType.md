# 变量类型

## 值类型 VS 引用类型
- 值类型
```js
var a = 100
var b= a
a = 200
console.log(b) // 100
```
- 引用类型
```js
var a = {age:20}
var b = a
b.age = 21
console,log(a.gae) // 21
```
> a 和 b 同时指向age对象的地址，a 和 b 是age对象的指针名


## typeof 运算符详解
- typeof 运算符
```js
typeof undefined // undefined
typeof 'abc' // String
typeof 123 // number
typeof true // boolean
typeof {} // object
typeof [] // object
typeof null // object
typeof console.log // function
```
> typeof 只能区分值类型（前四个），不能区分引用类型5、6、7（function除外）

### 变量计算 - 强制类型转换
- 字符串拼接
```js
var a = 100 + 10 // 110
var b = 100 + '10' // '10010'
```
- == 运算符
```js
100 = '100' // true
0 = '' // true
null = undefined // true

if (obj.a == null) {
    // 相当于obj.a === null || obj.a === undefined,简写形式
}
```

- if 语句
```js
var a = true
if (a) {
    // ...
}
var b = 100
if (b) {
    // ...
}
var c = '' 
// 为false
if (c) {
    // ...
}
```

- 逻辑运算
```js
console.log(10 && 0) // 0
console.log('' || 'abc') // 'abc'
console.log(!window.abc) // true

// 判断一个变量会被当做 true 还是 false
var a = 100
console.log(!!a) // true
```

## JS 中的内置函数 —— 数据封装类对象
- Object
- Array
- Boolean
- Number
- String
- Function
- Date
- RegExp
- Error

## 如何理解 json
- json 是 JS 中的一个对象而已
- 常用api
```js
JSON.stringify({a:10, b: 20})
JSON.parse('{"a": 10, "b": 20}')
```