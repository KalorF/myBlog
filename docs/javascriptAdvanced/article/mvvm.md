# MVVM

## 使用 jQuery 和使用框架的区别
- jQuery 实现 todo-list
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>to-do-list by jQuery</title>
</head>

<body>
  <div>
    <input type="text" name="" id="text-title">
    <button id="btn-submit">submit</button>
  </div>
  <div>
    <u id="ul-list"></u>
  </div>

  <script src="https://cdn.bootcss.com/jquery/3.3.0/jquery.min.js"></script>
  <script type="text/javascript">
    var $textTitle = $('#text-title')
    var $btnSubmit = $('#btn-submit')
    var $ulList = $('#ul-list')

    $btnSubmit.click(function () {
      var title = $textTitle.val()
      if (!title) {
        return null
      }
      var $li = $('<li>' + title + '</li>')
      $ulList.append($li)
      $textTitle.val('')
    })
  </script>
</body>

</html>
```
- vue 实现 todo-list
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>to-do-list by vue</title>
</head>

<body>
  <div id="app">
    <div>
      <input v-model="title">
      <button @click="add">submit</button>
    </div>
    <div>
      <ul>
        <li v-for="(item, index) in list" :key="index">{{item}}</li>
      </ul>
    </div>
  </div>
  <script src="https://cdn.bootcss.com/vue/2.6.10/vue.min.js"></script>
  <script type="text/javascript">
    var vm = new Vue({
      el: '#app',
      data: {
        title: '',
        list: []
      },
      methods: {
        add: function () {
          this.list.push(this.title)
          this.title = ''
        }
      }
    })
  </script>
</body>

</html>
```

- jQuery 和框架的区别
1. 数据和视图分离，解耦（开放封闭原则）
2. 以数据驱动视图，只关心数据变化，DOM 操作被封装


## MVVM 的理解
**1. MVC**
- M - Model 数据
- V - View 视图、界面
- C - Controller 控制器、逻辑处理

**2. MVVM**
- Model - 模型、数据
- View - 视图、模板（视图和模板是分离的）
- ViewModel - 连接 Model 和View

**3. MVVM框架的三要素**
- 响应式：vue 如何监听到 data 的每个属性的变化？
- 模板引擎：vue 的模板图和被解析，指令如何处理？
- 渲染：vue 的模板如何被渲染成 html？渲染的过程

**4. 什么是响应式？**
- 修改 data 属性后，vue 立即监听到
- data属性被代理到 vm 上
- Object.defineProperty
```js
// var obj = {
    //   name: 'zhangsan',
    //   age: 24
    // }
    // console.log(obj)
    var obj = {}
    var _name = 'zhangsan'
    Object.defineProperty(obj, 'name', {
      set: function () {
        console.log('get', _name) // 监听
        return _name
      },
      get: function (newVal) {
        console.log('set', newVal) // 监听
        _name = newVal
      }
    })
```
- 模拟 data 代理到 vm （vue）
```js
var vm = {}
    var data = {
      name: 'zhangsan',
      age: 20
    }

    var key, value
    for (key in data) {
      // 命中闭包，保存 key 的值
      (function (key) {
        Object.defineProperty(vm, key, {
          get: function () {
            return data[key]
          },
          set: function (newVal) {
            data[key] = newVal
          }
        })
      })(key)
    }
```

**5. vue 中如何解析模板**
* 模板是什么
  * 本质： 字符串
  * 有逻辑，如 v-if v-for等
  * 与 html 格式很像，但有很大区别
  * 最终转换为 html 来显示


* render 函数
1. render 函数 with
```js
 var obj = {
      name: 'zhangsan',
      age: 20,
      getAddress: function () {
        alert('北京')
      }
    }

    function fn() {
      with (obj) {
        alert(name)
        alert(age)
        getAddress()
      }
    }
    fn()
```
```js
<div id="app">
    <p>{{price}}</p>
</div>

with(this) {
    return _c(
        'div',
        {
            attrs: {"id": "app"}
        },
        [
            _c('p',[_v(_s(price))])
        ]
    )
}
```
```js
with (this) { // this 就是vm
  return _c(
    'div',
    {
      attrs: { "id": "app" }
    },
    [
      _c(
        'div',
        [
          _c(
            'input',
            {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: (title),
                  expression: "title"
                }
              ],
              domProps: {
                "value": (title)
              },
              on: {
                "input": function ($event) {
                  if ($event.target.composing) return;
                  title = $event.target.value
                }
              }
            }
          ),
          _v(" "),
          _c(
            'button',
            {
              on: {
                "click": add
              }
            },
            [_v("submit")]
          )
        ]
      ), 
      _v(" "), 
      _c('div', 
        [
          _c(
            'ul', 
            _l((list), function (item, index) { return _c('li', { key: index }, [_v(_s(item))]) })
          )
        ]
      )
    ]
  )
}

/**
 * vue 2.0 开始支持预编译
 * 开发环境：写模板
 * 编译打包
 * 生产环境 JS
*/
```

* render 函数与 vdom
   * vm._c 其实相当于 snabbdom 中的 h 函数
   * render 函数执行之后，返回的是 vnode
   * updateComponent 中实现了 vdom 的 patch
   * 页面首次渲染执行 updateComponent
   * data 中每次修改属性执行 updateComponent


* vue 的整个实现过程

**1. 第一步：解析模板成 render 函数**
- with 的用法
- 摸板中的所有信息都被 render 函数包含
- 摸板中用到的 data 中的属性，都变成了 JS 变量
- 模板中 v-model v-for v-on 都变成了js逻辑
- render 函数返回 vnode

**2. 第二步：响应式开始监听**
- Object.defineProperty
- 将 data 属性代理到 vm 上 

**3. 第三部：首次渲染，显示页面，且绑定依赖**
- 初次渲染，执行 updateComponent，执行 vm._render()
- 执行 render 函数，会访问到 vm.list 和 vm.title
- 被被响应式的方法 get 监听到
- 执行 updateComponent，会走到 vdom 的 patch 方法
- patch 将 vnode 渲染成 DOM，初次渲染完成 
- 被用到的属性走 get，不被用到的不会走到 get
- 为走到 get 属性中，set 的时候我们也无需关心 
- 避免不必要的重复渲染
```js
  vm._update(vnode) {
    const prevVnode = vm._vnode
    vm._vnode = vnode
    if (!prevVnode) {
      vm.$el = vm.__patch__(vm.$el, vnode)
    } else {
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
  }

function updateComponent() {
  // vm._update 即上面的 render 函数，返回 vnode
  vm._update(vm._render())
}
```

**4. 第四部：data 属性变化，触发 rerender**
- 修改属性，被响应式的 set 监听到
- set 中执行 updateComponent（异步）
- updataComponent 重新执行 vm._render()
- 生成的 vnode 和 preVnode，通过 patch 进行对比
- 渲染到 html 中