# 日期和Math

## 1. 日期
```js
Date.now() // 获取当前时间毫秒数
var dt = new Date()
dt.getTime() // 获取毫秒数
dt.getFullYear() // 年
dt.getMonth() // 月 （0 - 11）
dt.getDate() // 日 （0 - 31）
dt.getHours() // 小时（0 - 23）
dt.getMinutes() // 分钟（0 - 59）
dt.getSeconds() // 秒（0 - 59）
```

## 2. Math
- 获取随机数 Math.random() (一般用作清楚缓存)

## 3. 数组API
- forEach 遍历所有元素

```js
var arr = [1, 2, 3]
arr.forEach(function(item, index) {
    // 遍历数组所有元素
    console.log(index, item)
})
```

- every 判断所有元素是否都符合条件

```js
var arr = [1,2,3]
var result = arr.every(function (item, index){
    // 用来判断所有数组元素，都满足一个条件
    if (item < 4) {
        return true
    }
})
console.log(result) // true
```

- some 判断是否至少一个元素符合条件

```js
var arr = [1,2,3]
var result = arr.some(function (item, index){
    // 用来判断所有数组元素，紫瑶有一个满足条件即可
    if (item < 2) {
        return true
    }
})
console.log(result) // true
```

- sort 排序

```js
var arr = [1,4,2,3,5]
var arr2 = arr.sort(function(a, b){
    // 从小到大
    return a - b
    
    // 从大到小
    // return b - a
})
console.log(arr2) // [1, 2, 3, 4, 5]
```

- map 对元素重新组装，生成新数组

```js
var arr = [1,2,3,4]
var arr2 = arr.map(function(item, index) {
    // 将数组重新组装，并返回
    return '<b>' + item + '</b>'
})
console.log(arr2) // [ '<b>1</b>', '<b>2</b>', '<b>3</b>', '<b>4</b>' ]
```

- filter 过滤符合条件的元素
```js
var arr = [1,2,3]
var arr2 = arr.filter(function (item, index) {
    if (item >= 2) {
        return true
    }
})
console.log(arr2) // [2, 3]
```

## 4. 对象API

```js
var obj = {
  x: 100,
  y: 200,
  z: 300
}

var key
for (key in obj) {
  // hasOwnProperty 判断对象中是否含有此属性
  if (obj.hasOwnProperty(key)) {
    console.log(key, obj[key])
  }
}
// x 100
// y 200
// z 300
```

## 5. 获取 yyyy-MM-dd hh:mm:ss日期格式
```js
function formDate(dt) {
  if (!dt) {
    dt = new Date()
  }
  var year = dt.getFullYear()
  var month = (dt.getMonth() + 1) < 10 ? ('0' + (dt.getMonth() + 1)) : dt.getMonth() + 1
  var date = dt.getDate() < 10 ? ('0' + dt.getDate()) : dt.getDate()
  var hours = dt.getHours() < 10 ? ('0' + dt.getHours()) : dt.getHours()
  var minutes = dt.getMinutes() < 10 ? ('0' + dt.getMinutes()) : dt.getMinutes()
  var seconds = dt.getSeconds() < 10 ? ('0' + dt.getSeconds()) : dt.getSeconds()
  return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds
}

var dt = new Date()
var formDate = formDate(dt)
console.log(formDate)
```

## 6. 获取随机数，要求长度一致的字符串格式
```js
var random = Math.random()
var random = random + '0000000000'
var random = random.slice(0, 10)
console.log(random)
```

## 7. 写一个能遍历对象和数组的forEach函数
```js
function forEach(obj, fn) {
  if (obj instanceof Array) {
    // 判斷是否是數組
    obj.forEach(function (item, index) {
      fn(index, item)
    })
  } else {
    // 不是便是對象
    for (key in obj) {
      fn(key, obj[key])
    }
  }
}
var arr = [1, 2, 3]
forEach(arr, function (index, item) {
  console.log(index, item)
})

var obj = { x: 10, y: 20 }
forEach(obj, function (key, value) {
  console.log(key, value)
})
```