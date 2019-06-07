# 迭代器模式

## 迭代器模式介绍
- 顺序访问一个集合
- 使用者无需知道集合的内部结构（封装）

## 设计原则验证
- 迭代器和目标对象分离
- 迭代器将使用者和目标对象分离
- 符合开放封闭原则

## 事例
* 事例1
```js
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>demo</title>
</head>

<body>
  <div id="div1">
    <a href="#">a1</a>
    <a href="#">a2</a>
    <a href="#">a3</a>
    <a href="#">a4</a>
    <a href="#">a5</a>
  </div>
  <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
  <script>
    var arr = [1, 2, 3]
    var nodeList = document.getElementsByName('a')
    var $a = $('a')

    function each(data) {
      var $data = $(data) // 变为Jquery对象，生成迭代器
      $data.each(function (key, val) {
        console.log(key, val)
      })
    }
    each(arr)
    each(nodeList)
    each($a)
  </script>
</body>

</html>
```
* 事例2
```js
class Iterator {
  constructor(container) {
    this.list = container.list
    this.index = 0
  }
  next() {
    if (this.hasNext) {
      return this.list[this.index++]
    }
    return null
  }
  hasNext() {
    if (this.index >= this.list.length) {
      return false
    }
    return true
  }
}

class Container {
  constructor(list) {
    this.list = list
  }
  // 生产迭代器
  getIterator() {
    return new Interator(this)
  }
}

let arr = [1, 2, 3, 4, 5, 6]
let container = new Container(arr)
let iterator = container.getIterator()
while (interator.hasNext()) {
  console.log(iterator.next())
}
// 1 2 3 4 5 6
```
## ES6 Iterator 为何存在？
- ES6 语法中，有序集合的数据类型已经很多
- Array Map Set String TypedArray arguments NodeList
- 需要有一个统一的遍历接口来遍历所有数据类型
- （注意）object不是有序数据集合，可以用Map代替
## ES6 Iterator 是什么？
- 以上数据类型，都有[Symbol.iterator] 属性
- 属性值是函数，执行函数返回一个迭代器
- 这个迭代器有就有 next 方法可顺序迭代子元素
- 可运行Array.prototype[Symbol.iterator]来测试

* 事例1
```js
function each(data) {
  <!--let iterator = data[Symbol.iterator]()-->

  <!--let item = { done: false }-->
  <!--while (!item.done) {-->
  <!--  item = iterator.next()-->
  <!--  if (!item.done) {-->
  <!--    console.log(item.value)-->
  <!--  }-->
  <!--}-->
  <!--可用 for...of 来实现-->
  for (let item of data) {
      console.log(item)
  }
}
let arr = [1, 2, 3, 4]
let nodeList = document.getElementsByTagName('p')
let m = new Map()
m.set('a', 100)
m.set('b', 200)
each(arr)
each(nodeList)
each(m)
```