# 代理模式

## 代理模式介绍
- 使用者无权访问目标对象
- 中间加代理，通过代理做授权的控制

## 设计原则验证
- 代理类和目标类分离，隔离开目标类和使用者
- 符合开放封闭原则

* 事例1
```js
class ReadImg {
  constructor(fileName) {
    this.fileName = fileName
    this.loadFromDisk() // 从因盘中读取图片  模拟
  }
  display() {
    console.log('display...', this.fileName)
  }
  loadFromDisk() {
    console.log('loading...', this.fileName)
  }
}

class ProxyImg {
  constructor(fileName) {
    this.realImg = new ReadImg(fileName)
  }
  display() {
    this.realImg.display()
  }
}

let proxyImg = new ProxyImg('1.png')
proxyImg.display()
// loading... 1.png
// display... 1.png
```

* 事例2 （Jquery 中的代理方式,通过 $.proxy(fn,this) ）
```html
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
    $("#div1").click(function () {
      var fn = $.proxy(function () {
        $(this).css('background-color', 'yellow')
      }, this)
      setTimeout(fn, 1000)
    })
  </script>
</body>

</html>
```

* 事例3（ES 6 中的代理方法）
```js
// 明星
let star = {
  name: '张XX',
  age: 25,
  phone: 'star: 13499900000'
}

// 经纪人
let agent = new Proxy(star, {
  get: function (target, key) { // target 指向 star
    if (key === 'phone') {
      // 返回经纪人电话
      return 'agent: 16543543543'
    }
    if (key === 'price') {
      // 明星不报价，经纪人报价
      return 120000
    }
    return target[key]
  },
  set: function (target, key, value) {
    if (key === 'customerPrice') {
      if (value < 100000) {
        throw new Error('价格太低')
      } else {
        target[key] = value
        return true // 确保赋值成功
      }
    }
  }
})

// test
console.log(agent.name)
console.log(agent.age)
console.log(agent.phone)
console.log(agent.price)

agent.customerPrice = 150000
console.log('agent.customerPrice', agent.customerPrice)
张XX
// 25
// agent: 16543543543
// 120000
// agent.customerPrice 150000
```
## 代理模式 VS 适配器模式
- 适配器模式：提供一个不同的接口（如不同版本的插头）
- 代理模式：提供一模一样的接口

## 代理模式 VS 装饰器模式
- 装饰器模式：扩展功能，原有功能不变且可直接使用
- 代理模式：显示原有功能，但是经过限制或者阉割之后的