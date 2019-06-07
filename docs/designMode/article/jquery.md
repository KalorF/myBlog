## JQuery封装
```js
class JQuey {
  constructor(seletor) {
    let slice = Array.prototype.slice // 获取slice函数
    let dom = slice.call(document.querySelectorAll(seletor)) // 获取对应dom的数组
    let len = dom ? dom.length : 0 // 获取dom长度
    for (let i = 0; i < dom.len; i++) {
      this[i] = dom[i]
    }
    this.length = len
    this.seletor = seletor || ''
  }
  append(node) {
    // ...
  }
  addClass(name) {
    // ...
  }
  html(data) {
    // ...
  }
}
// 实例化返回$函数
window.$ = function (seletor) {
  return new JQuey(seletor)
}
// 测试代码
var $p = $('p')
console.log($p) // 打印出每个p节点
console.log($p.addClass) // 打印出addClass函数
```