# virtual dom

## vdom 是什么？为何存在 vdom？
**1. 什么是 vdom**
- virtual dom,虚拟 dom
```js
var dom = {
  tag: 'ul',
  attrs: {
    id: 'list'
  },
  children: [
    {
      tag: 'li',
      attrs: { className: 'item' },
      children: ['Item 1']
    },
    {
      tag: 'li',
      attrs: { className: 'item' },
      children: ['Item 2']
    }
  ]
}
```
- 用 JS 模拟 DOM 结构
- DOM 变化的对比，放在 JS 层来做（图灵完备语言）
- 提高重绘性能

**2. 设计一个需求场景**

**3. 用 jQuery 实现**
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>

<body>
  <div id="container"></div>
  <button id="btn-change">change</button>

  <script src="https://cdn.bootcss.com/jquery/3.3.0/jquery.min.js"></script>
  <script type="text/javascript">
    var data = [
      {
        name: '张三',
        age: 20,
        address: '北京'
      },
      {
        name: '李四',
        age: 21,
        address: '上海'
      },
      {
        name: '小李',
        age: 22,
        address: '广州'
      }
    ]

    // 渲染函数
    function render(data) {
      var $container = $('#container')
      // 清空容器
      $container.html('')

      // 拼接table
      var $table = $('<table>')
      $table.append('<tr><td>name</td><td>age</td><td>address</td></tr>')
      data.forEach(function (item) {
        $table.append('<tr><td>' + item.name + '</td><td>' + item.age + '</td><td>' + item.address + '</td><tr>')
      })
      $container.append($table)
    }

    $('#btn-change').click(function () {
      data[1].age = 30
      data[2].address = '深圳'
      // re-render 再次渲染
      render(data)
    })

    // 页面初次渲染
    render(data)
  </script>
</body>

</html>
```

**4. 遇到的问题**
- DOM 操作是 “昂贵” ，JS 运行效率高
- 尽量减少 DOM 操作，“推到重来”
- 项目越复杂，影响越严重
- vdom 可解决这个问题


---

## vdom如何应用，核心 API 是什么？
**1. 介绍 snabbdom**
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>

<body>
  <div id="container"></div>
  <button id="btn-change">change</button>

  <script src="https://cdn.bootcss.com/snabbdom/0.7.3/snabbdom.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.3/snabbdom-class.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.3/snabbdom-props.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.3/snabbdom-style.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.3/snabbdom-eventlisteners.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.3/h.js"></script>
  <script type="text/javascript">
    var snabbdom = window.snabbdom

    // 定义patch
    var patch = snabbdom.init([
      snabbdom_class,
      snabbdom_props,
      snabbdom_style,
      snabbdom_eventlisteners
    ])

    // 定义 h 函数
    var h = snabbdom.h

    var container = document.getElementById('container')

    // 生成 vnode
    var vnode = h('ul#list', {}, [
      h('li.item', {}, 'Item 1'),
      h('li.item', {}, 'Item 2')
    ])

    patch(container, vnode)

    document.getElementById('btn-change').addEventListener('click', function () {
      // 生成 newVnode
      var newVnode = h('ul#list', {}, [
        h('li.item', {}, 'Item 1'),
        h('li.item', {}, 'Item B'),
        h('li.item', {}, 'Item 3')
      ])
      // 做对比
      patch(vnode, newVnode)
    })
  </script>
</body>

</html>
```

**2. 重做之前的 demo**
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>

<body>
  <div id="container"></div>
  <button id="btn-change">change</button>

  <script src="https://cdn.bootcss.com/snabbdom/0.7.3/snabbdom.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.3/snabbdom-class.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.3/snabbdom-props.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.3/snabbdom-style.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.3/snabbdom-eventlisteners.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.3/h.js"></script>
  <script type="text/javascript">
    var snabbdom = window.snabbdom

    // 定义patch
    var patch = snabbdom.init([
      snabbdom_class,
      snabbdom_props,
      snabbdom_style,
      snabbdom_eventlisteners
    ])

    // 定义 h 函数
    var h = snabbdom.h

    var data = [
      {
        name: '张三',
        age: 20,
        address: '北京'
      },
      {
        name: '李四',
        age: 21,
        address: '上海'
      },
      {
        name: '小李',
        age: 22,
        address: '广州'
      }
    ]
    data.unshift({
      name: '姓名',
      age: '年龄',
      address: '地址'
    })

    var container = document.getElementById('container')

    // 渲染函数
    var vnode
    function render(data) {
      var newVnode = h('table', {}, data.map(function (item) {
        var tds = []
        var i
        for (i in item) {
          if (item.hasOwnProperty(i)) {
            tds.push(h('td', {}, item[i] + ''))
          }
        }
        return h('tr', {}, tds)
      }))

      if (vnode) {
        // re-render
        patch(vnode, newVnode)
      } else {
        // 初次渲染
        patch(container, newVnode)
      }

      // 存储当前 vnode的结果
      vnode = newVnode
    }
    // 初次渲染
    render(data)

    var btnChange = document.getElementById('btn-change')
    btnChange.addEventListener('click', function () {
      data[1].age = 30
      data[2].address = '深圳'
      render(data)
    })

  </script>
</body>

</html>
```

**3. 核心 API**
- h('<标签名>', {...属性...}, [...子元素...])
- h('<标签名>', {...属性...}, ...)
- patch(container, vnode)
- patch(vnode, newVnode)

## 介绍 diff 算法
**1. vdom 为何使用 diff 算法**
- DOM 操作是“昂贵”的，因此尽量减少 DOM 操作
- 找出本次 DOM 必须要更新节点来更新，其它不更新
- 这个 “找出” 的过程，就需要 diff 算法


**2. diff 实现过程**
- 实现 vnode
```js
var vnode = {
  tag: 'ul',
  attrs: {
    id: 'list'
  },
  children: [
    {
      tag: 'li',
      attrs: { className: 'item' },
      children: ['Item 1']
    }
  ]
}

function createElement(vnode) {
  var tag = vnode.tag
  var attrs = vnode.attrs || {}
  var children = vnode.children || []
  if (!tag) {
    return null
  }
  // 创建元素
  var elem = document.createElement(tag)
  // 属性
  var attrName
  for (attrName in attrs) {
    if (attrs.hasOwnProperty(attrName)) {
      // 给 elem 添加属性
      elem.setAttribute(attrName, attrs[attrName])
    }
  }
  // 子元素
  children.forEach(function (childVnode) {
    // 递归调用 createElement 创建子元素
    elem.appendChild(createElement(childVnode))
  })
  // 返回真实 dom
  return elem
}
```
- patch(vnode, newVnode)
```js
function updateChildren(vnode, newVnode) {
  var children = vnode.children || []
  var newChildren = newVnode.children || []
  children.forEach(function (childVnode, index) {
    var newChildVnode = newChildren[index]
    if (childVnode.tag === newChildVnode.tag) {
      // 深层次对比，递归
      updateChildren(childVnode, newChildVnode)
    } else {
      // 替换
      replaceNode(childVnode, newChildVnode)
    }
  })
}

function replaceNode(vnode, newVnode) {
  var elem = vnode.elem
  var newElem = newVnode.createElement(newVnode)

  // 替换
}
```
- diff 算法
- diff 算法是 Linux 的基础命令
- vdom 中应用 diff 算法是为了找出需要更新的节点
- 实现，patch(container, vnode) 和 patch(vnode, newVnode)
- 核心逻辑，createElement 和 updateChildren