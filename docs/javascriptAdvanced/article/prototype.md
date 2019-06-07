# 框架中原型的实现
## zepto 如何实现原型
```js
(function (window) {
  var zepto = {}

  function Z(dom, selector) {
    var i, len = dom ? dom.length : 0
    for (i = 0; i < len; i++) {
      this[i] = dom[i]
    }
    this.length = len
    thiis.selector = selector || ''
  }

  zepto.Z = function (dom, selector) {
    return new Z(dom, selector) // 构造函数
  }

  zepto.init = function (selector) {
    var slice = Array.prototype.slice
    var dom = slice.call(document.querySelectorAll(selector)) // 类数组得到数组形式
    return zepto.Z(dom, selector)
  }

  var $ = function (selector) {
    return zepto.init(selector)
  }
  window.$ = $

  $.fn = {
  
    // 其它函数
    css: function (key, value) {
      alert('css')
    },
    html: function (value) {
      return '这是一个模拟的 html 函数'
    }
  }
  Z.prototype = $.fn // Z 原型继承 $.fn
})(window)
```

## jquery 如何实现原型
```js
(function (window) {

  var jQuery = function (selector) {
    return jQuery.fn.init(selector)
  }

  jQuery.fn = {
  
    // 其它函数
    css: function (key, value) {
      alert('css')
    },
    html: function (value) {
      return 'html'
    }
  }
  
  // 定义构造函数
  var init = jQuery.fn.init = function (selector) {
    var slice = Array.prototype.slice
    var dom = slice.call(document.querySelectorAll(selector))
    var i, len = dom ? dom.length : 0
    for (i = 0; i < len; i++) {
      this[i] = dom[i]
    }
    this.length = len
    this.selector = selector || ''
  }

  init.prototype = jQuery.fn // 构造函数原型继承 jQuery.fn
  window.$ = jQuery
})(window)
```
#### 为什么吧原型放在 $.fn 上
- 将定义的插件放在构造函数里面，方面扩展
- 举例
```js
$.fn.getNodeNmae = function () {
    //  this[i] = dom[i]
    return this[0].nodeName
}
```

- 只有 $ 会暴露在 window 全局变量
- 将插件扩展统一到 $.fn.xxx 这一接口，方便使用