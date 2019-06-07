# js-Web-Api
## JS 基础知识：ECMA 262 标准
## JS - Web - API：W3C 标准
## DOM 操作
**1. DOM 本质：将 html 结构化一个能被浏览器或者JS识别的东西**
**2. DOM 节点操作**
```js
var div1 = document.getElementById('div1') // 元素
var dateList = document.getElementsByTagName('div') // 集合
console.log(dateList.length)
console.log(dateList[0])

var containerList = document.getElementsByClassName('.container') // 集合
var pList = document.querySelectorAll('p') // 集合

var p = pList[0]

// property
console.log(p.style.width) // 获取样式
p.style.width = '100px' // 修改样式
console.log(p.className) // 获取class
p.className = 'p1' // 修改class

// 获取nodeName 和 nodeType
console.log(p.nodeName)
console.log(p.nodeType)

// Attribute
p.getAttribute('data-name')
p.setAttribute('data-name', 'immoc')
p.getAttribute('style')
p.setAttribute('style', 'font-size:30px')
```
**3. DOM 结构操作**

> 新增节点

```js
var div1 = document.getElementById('div1')

// 添加节点
var p = document.createElement('p')
p.innerHTML = 'this is p1'
div1.appendChild(p1)

// 移动节点
var p2 = document.getElementById('p2')
div1.appendChild('p2')
```
> 获取父元素和子元素

```js
var div1 = document.getElementById('div1')

var parent = div1.parentElement

var child = div1.childNodes
```
> 删除节点

```js
var div1 = document.getElementById('div1')

var child = div1.childNodes
div1.removeChild(child[0])
```

**4. DOM 是哪种基本数据结构**
- 树

**5. DOM 操作的常用 API 有哪些**
- 获取 DOM 节点，以及节点的 property 和 Attribute
- 获取父节点，获取子节点
- 新增节点，删除节点

**6. DOM 节点 Attribute 和 property 的区别**
- property 只是一个 JS 对象的属性修改
- Attribute 是对 html 标签属性的修改


---

## BOM 操作
- navigator
```js
var ua = navigator.userAgent
var isChrome = ua.indexOf('Chrome')
console.log(isChrome)
```

- screen
```js
console.log(screen.width)
console.log(screen.height)
```

- location
```js
console.log(location.protocol) // 协议 http,https
console.log(location.host) // 域名
console.log(location.pathname) // 路径
console.log(location.search) // ? 后面的参数
console.log(location.hash) // #后面
```
- history
```js
history.back()
history.forward()
```

---

#### 事件绑定
- 通用事件绑定
```js
function bindEvent(elem, type, selector, fn) {
  if (fn === null) {
    fn = selector
    selector = null
  }
  elem.addEventListener(type, function (e) {
    var target
    if (selector) {
      target = e.target
      if (target.matches(selector)) {
        fn.call(target, e)
      }
    } else {
      fn(e)
    }
  })
}

// 使用代理
var div1 = document.getElementById('div1')
bindEvent(div1, 'click', 'a', function (e) {
  console.log(this.innerHTML)
})

// 不使用代理
var a = document.getElementById('a1')
bindEvent(div1, 'click', function (e) {
  console.log(a.innerHTML)
})
```

- 事件冒泡
```js
var p1 = document.getElementById('p1')
var body = document.body

bindEvent(p1, 'click', function (e) {
  e.stopPropagation() // 阻止冒泡
  alert('激活')
})
bindEvent(body, 'click', function (e) {
  e.preventDefault()
  alert('取消')
})
```

- 代理
1. 代码简洁
2. 减少浏览器内存占用
```js
var div1 = document.getElementById('div1')
div1.addEventListener('click', function (e) {
  var target = e.target
  if (target.nodeName === 'A') {
    alert(target.innerHTML) // 弹出被点击a标签的内容
  }
})
```
**1. 简述事件冒泡流程**
- DOM 树形结构
- 事件冒泡
- 阻止冒泡
- 冒泡的应用

**2. 无限下拉加载图片的页面，绑定事件**
- 使用代理
- 代理的两个优点


---

## ajax 请求（包括 http 协议）
**XMLHttpRequest**
```js
var xhr = new XMLHttpRequest()
xhr.onreadystatechange = function () {
  // 为异步请求
  if (xhr.readyState == 4) {
    if (xhr.status == 200) {
      alert(xhr.responseText)
    }
  }
}

xhr.send(null)
```

**状态码说明**
<code>readState</code>
- 0 - （未初始化）还没有调用 send() 方法
- 1 - （载入）已调用 send() 方法，正发送请求
- 2 - （载入完成）send() 方法执行完成，已经接收到全部响应内容
- 3 - （交互）正在解析响应内容
- 4 - （完成）响应内容解析完成，可以在客户端调用了

<code>status</code>
- 2xx - 表示成功处理请求，如 200
- 3xx - 需要重定向，浏览器直接跳转
- 4xx - 客户端请求错误，如 404
- 5xx - 服务器错误

## 跨域
**1. 什么事跨域**
- 浏览器有同源策略，不允许 ajax 访问其它域接口
- http://www.youername.com/page1.html
- http://m.imooc.com/course/ajaxcourse?cid=459
- 跨域条件：协议、域名、端口，有一个不同就算跨域

> 可以跨域的三个标签

- link href=xxx
- script src=xxx
- 图片标签

**2. JSONP**
```js
<script>
window.callback = function (data) {
    // 跨域得到的信息
    console.log(data)
}
</script>
<script src="http://coding.m.imooc.com/api.js"></script>
// 返回callback({ x:100, y: 200} )
```

**3. 服务端设置 http header**


---

## 存储
**1. cookie**
- 本身用于服务端和客户端通信
- 但是又具有本地存粗的功能，于是被“借用”
- 使用 document.cookie = ...获取餐后修改（为字符串）

> cookie 用于存储的缺点
- 存储量太小，只有 4KB
- 所有 http 请求都带着，最影响获取资源的效率
- API 简单，需要封装才能用 document.cookie = ...

**2. localStorage 和 sessionStorage**
- HTML5 专为存储而设计，最大容量为 5M
- API 简单易用
- localStorage.setItem(key, value); localStorage.getItem(key);
- iOS safari 隐藏模式下
- localStorage.getItem 会报错
- 建议统一使用 try-catch 封装

**3. 区别**
- 容量
- 是否会携带 ajax 中（cookie）
- API 易用性