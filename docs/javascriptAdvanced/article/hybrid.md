# hybrid

## hybrid 是什么，为何使用hybrid
**1. hybrid文字解析**
- hybrid 即 “混合”，即前端和客户端混合开发
- 需要前端开发人员和客户端开发人员配合开发
- 某些环节也可能涉及到 server 端

**2. hybrid 存在价值**
- 可以快速迭代更新【关键】（无需app审核）
- 体验流畅（和 NA 的体验基本类似）
- 减少开发和沟通成本，双端公用一套代码


## webview
- 是 app 中的一个组件（app 中可以有，可以没有）
- 用于加载 H5 页面，即一个小型的浏览器内核

## file 协议
- 一开始接触 html 开发，就已经使用了 file 协议
- 与 http(s) 协议相比较快
- file:// /本地的绝对路径

## 具体实现
- 前端做好静态页面（html js css），将文件交给客户端
- 客户端拿到前端静态页面，以文件形式存储在 app 中
- 客户端在一个 webview 中
- 使用 fle 协议加载静态页面

## hybrid更新上线流程
- 分版本，有版本号，如时间戳
- 将静态文件压缩成 zip 包，上传到服务端
- 客户端每次启动，都去服务端检查版本号
- 如果服务端版本号大于客户端版本号，就去下载最新 zip包
- 下载完之后解压，然后将现有文件覆盖

## hybrid 和 h5 区别
**1. 有点**
- 体验更好，跟 NV 体验基本一致
- 可快速迭代，无需 app 审核【关键】

**2. 缺点**
- 开发成本高。联调、测试、查 bug 都比较麻烦
- 运维成本高

**3. 使用场景**
- hybrid：产品的稳定功能，体验成本高，迭代频繁
- h5：单次的运营活动（如xx红包）获不常用功能

## JS 和客户端通信
**1. 遗留问题**
- 新闻详情页还用 hybrid，前端如何获取新闻内容？
- 不能用 ajax 获取。第一 跨域，第二 速度慢
- 客户端获取新闻内容，然后 JS 通讯拿到内容，在渲染

**2. 基本形式**
- JS 访问客户端能力，传递参数和回调函数
- 客户端通过回调函数返回内容

## schema 协议简介和使用
- schema 协议，前端和客户端约定
```js
function invokeScan(){
    window['_invoke_scan_callback'] = function (result) {
      alert(result)
    }

    var iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    // iframe.src = 'weixin://dl/scan' // iframe访问schame
    iframe.src = 'weixin://dl/scan?k1=v1&k2=v2&callback=_invoke_scan_callback'
    var body = document.body || document.getElementsByTagName('body')[0]
    body.appendChild(iframe)
    setTimeout(function () {
      body.removeChild(iframe) // 销毁 iframe
      iframe = null
    })
}

document.getElementById('btn').addEventListener('click', function() {
  invokeScan()
})
```

- schema 封装
```js
(function (window, undefined) {

  function _invoke(action, data, callback) {
    // 拼接 schema 协议
    var schema = 'myapp://utils/' + action

    // 拼接参数
    schema += '?a=a'
    for (key in data) {
      if (data.hasOwnProperty(key)) {
        schema += '&' + key + data[key]
      }
    }

    // 处理callback
    var callbackName = ''
    if (typeof callback === 'string') {
      callbackName = callbackName
    } else {
      callbackName = action + Date.now()
      window[callbackName] = callback
    }
    schema += 'callback=' + callbackName

    // 触发
    var iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    // iframe.src = 'weixin://dl/scan' // iframe访问schame
    iframe.src = schema
    var body = document.body || document.getElementsByTagName('body')[0]
    body.appendChild(iframe)
    setTimeout(function () {
      body.removeChild(iframe) // 销毁 iframe
      iframe = null
    })
  }

  // 暴露到全局变量
  window.invoke = {
    share: function (data, callback) {
      _invoke('share', data, callback)
    },
    scan: function (data, callback) {
      _invoke('scan', data, callback)
    },
    login: function (data, callback) {
      _invoke('login', data, callback)
    }
  }
})(window)

// 调用
document.getElementById('btn1').addEventListener('click', function () {
  window.invoke.scan({}, function () { })
})

document.getElementById('btn2').addEventListener('click', function () {
  window.invoke.share({
    title: 'xxx',
    content: 'xxx'
  }, function (result) {
    if (result.error === 0) {
      alert('分享成功')
    } else {
      alert(result.message)
    }
  })
})
```