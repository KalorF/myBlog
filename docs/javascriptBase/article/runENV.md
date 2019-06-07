# 运行环境

## 页面加载过程
**1. 加载资源的形式**
- 输入 url（或者跳转页面） 加载 html
- http:// coding.m.imooc.com
- 加载 html 中的静态资源


**2. 加载一个资源的过程**
- 浏览器根据 DNS 服务器得到域名的 IP 地址
- 向这个 IP 的机器发送 http 请求
- 服务器收到，处理并返回 http 请求
- 浏览器得到返回内容


**3. 浏览器渲染页面的过程**
- 根据 HTML 结构生成 DOM Tree
- 根据 CSS 生成 CSSOM
- 将DOM 和 CSSOM 整合形成 RenderTree
- 根据 RenderTree 开始渲染和展示
- 遇到 <code>script</code> 时，会执行并阻塞渲染

**4. window.onload 和 DOMContentLoaded**
- 页面资源完全加载完才会执行，包括图片、视频等
- DOM 渲染完即可执行，此时图片、视频可能还没加载完
```js
window.addEventListener('load', function(){
    // 页面资源完全加载完才会执行，包括图片、视频等
})

document.addEventListener('DOMContentLoaded', function(){
    // DOM 渲染完即可执行，此时图片、视频可能还没加载完
})
```

## 性能优化
**1. 原则**
- 多使用内存、缓存或者其它方法
- 减少 CPU 计算，减少网络
**2. 加载资源的优化**
- 静态资源的压缩合并
- 静态资源的缓存
- 使用 CDN 让资源加载更快
- 使用 SSR 后端渲染，数据直接输出到 HTML 中
**3. 渲染优化**
- CSS 放前面，JS 放后面
- 懒加载（图片懒加载，下拉加载更多）
- 减少DOM 查询，对DOM 查询做缓存
```js
var pList = document.getElementsByTagName('p')
var i 
for (i = 0; i < pList.length; i++) {
    // todo
}
```

- 减少DOM 操作，多个操作尽量合并在一起执行
```js
var listNode = document.getElementById('list')\

// 要插入 10个 li标签
var frag = document.createDocumentFragment() // 生产一个片段
var x, li
for (x = 0; x < 10; i++) {
  li = document.createElement('li')
  li.innerHTML = 'list item' + x
  frag.appendChild(li)
}

listNode.appendChild(frag)
```

- 事件节流
```js
var textarea = document.getElementById('text')
var timeoutId

textarea.addEventListener('keyup', function(){
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  timeoutId = setTimeout(function() {
    // change 事件
  }, 100)
})
```

- 尽早执行操作（如DOMContentLoaded）
```js
window.addEventListener('load', function(){
    // 页面资源完全加载完才会执行，包括图片、视频等
})

document.addEventListener('DOMContentLoaded', function(){
    // DOM 渲染完即可执行，此时图片、视频可能还没加载完
})
```

## 安全性
**1. XSS 跨站请求攻击**
- 写一篇文章，同时偷偷插入一段 <code>script</code>
- 攻击代码中，获取 cookie，发送到自己服务器
- 发布博客，有人查看博客内容
- 会把查看者的 cookie 发送到攻击者服务器
> **解决**
- 前端替换关键字，例如替换 < 为 <code>&lt</code> > 为 <code>&gt</code>
- 后端替换


**2. XSRF 跨站请求伪造**
- 你已登录一个购物网站，正在浏览商品
- 该网站的付费接口是 xxx.com/pay>id=100 但是没有任何验证
- 然后收到一封邮件，隐藏着 img src=xxx.com/pay>id=100>
- 你查看邮件的时候，就已经悄悄购买了
> **解决**

- 增加验证流程，如输入指纹，密码，短信验证码