# 组件化

## 组件化的理解
- 组件的封装
  * 视图
  * 数据
  * 变化逻辑（数据驱动视图变化）
- 组件的复用
  * props 传递
  * 复用
```html
 <div>
    <Input addTitle={this.addTitle.bind(this)}></Input>
    <List data={this.state.list}></List>
    <List data={this.state.list}></List>
    <List data={this.state.list}></List>
  </div>
```

## jsx 的本质
- {} 内插入变量和表达式
- JSX 是语法糖，需被解析成 JS 才能运行
- JSX 是独立标准，可被其它项目使用


## jsx 的标准
- 不是 react 独有，可扩展
```js
class Input extends Component {
  render() {
    return (
      <div>
        <input value={this.state.title} onChange={this.changeHandle.bind(this)} />
        <button onClick={this.clickHandle.bind(this)}>submit</button>
      </div>
    )
  }
}

// 经过编译
class Input extends Component {
  render() {
    return React.createElement("div", null, React.createElement("input", {
      value: this.state.title,
      onChange: this.changeHandle.bind(this)
    }), React.createElement("button", {
      onClick: this.clickHandle.bind(this)
    }, "submit"));
  }

}
```
- 扩展
```js
/* @jsx h */

class Input extends Component {
  render() {
    return (
      <div>
        <input value={this.state.title} onChange={this.changeHandle.bind(this)} />
        <button onClick={this.clickHandle.bind(this)}>submit</button>
      </div>
    )
  }
}

// 编译后
class Input extends Component {
  render() {
    return h("div", null, h("input", {
      value: this.state.title,
      onChange: this.changeHandle.bind(this)
    }), h("button", {
      onClick: this.clickHandle.bind(this)
    }, "submit"));
  }

}
```

## JSX 和 vdom 的关系
**1. 为何需要 vdom**
- vdom 是 React 初次推广开来的，结合 JSX
- JSX 就是模板，最终要渲染成 html
- 初次渲染 + 修改 state 后 re-render
- 符合 vdom 的应用场景

**2. 何时 patch**
- 初次渲染 - ReactDOM.render(<App />,container)
- 会触发 patch(container, vnode)
- re-render - setState
- 会触发 patch(vnode, newVnode)

**3. 自定义组件的处理**
```js
import List from './list';
import Input from './input';

function render() {
  return React.createElement("div", null, React.createElement(Input, {
    addTitle: this.addTitle.bind(this)
  }), React.createElement(List, {
    data: this.state.list
  }));
}

React.createElement(List, {data: this.state.list})
var list = new List({data: this.state.list})
var vnode = list.render()

```

- 'div' - 直接渲染成 div 即可，vdom 直接渲染
- Input 和 List，是自定义组件（class），vdom 默认不认识
- 因此 Input 和 List 定义的时候必须声明 render 函数
- 根据 props 初始化实例，然后执行实例的 render 函数
- render 返回的事 vnode 对象
```js
/*
  var app = React.createElement(App, null)
  var App = new app()
  return App.render()
*/

/*
  React.createElement("div", null, React.createElement(Todo, null))
  var todo = new Todo()
  return tode.render()
*/

/*
  React.createElement(List, {data: this.state.list})
  var list = new List({data: this.state.list})
  return list.render()
*/

/* 
  React.createElement(
    "ul", 
    null, 
    list.map((item, index) => {
      return React.createElement("
      li", 
      {
        key: index
      },
      item);
    })
  );
*/
```

## React setState 的过程
- setState 是异步的
- 为何需要异步？
- 可能会一次执行多次 setState
- 无法规定，限制用户如何使用 setSatate
- 没必要每次 setState 都重新渲染，考虑性能
- 多个相同 setState 的时候。会覆盖前面的 

## setState 的过程
- 每个组件实例，都有 renderComponent 方法（继承于 Component）
- 执行 renderComponent 会重新执行实例的 render
- render 函数返回 newVnode，然后拿到 preVnode
- 执行 patch(preVnode, newVnode)
```
addTitle(title) {
    const currentList = this.state.list
    this.setState({
      list: currentList.concat(title)
    },() => {
      // console.log(this.state.list)
      this.renderComponent()
    })
}
renderComponent() {
    const preVnode = this._vnode
    const newVnode = this.render()
    patch(preVnode, newVnode)
    this._vnode = newVnode
}

```

## 总结
**1. 组件化的理解**
- 组件封装：封装视图、数据、变化逻辑
- 组件复用：props 传递、复用

**2. JSX 的本质**
- JSX 语法（标签、JS 表达式、判断、循环、事件绑定）
- JSX 是语法糖，需要被拆成 JS 才能运行
- JSX 是独立标准，可被其他项目使用

**3. JSX 和 vdom 的关系**
- 为何需要 vdom：JSX 需要渲染成 html，还有render
- React.createElement 和 h，都生成 vnode
- 何时 patch：ReactDOM.render(...) 和 setState
- 自定义组件解析：初始化实例，然后执行 render

## React 和 vue 对比
**1. 两者的本质区别**
- vue - 本质是 MVVM 框架，由 MVC 发展而来
- React - 本质是前端组件化框架，由后端组件化发展而来
- 两者都可实现相同的功能

**2. 模板的区别**
- vue - 使用模板（最初由 angular 提出）
- React - 使用 jsx
- 模板语法上，倾向于 JSX
- 模板分离上，倾向 vue

**3. 组件化区别**
- React 本身就是组件化，没有组件化就不是 React
- vue 也支持组件化，不过是在 MVVM 上扩展

**4. 两者的共同点**
- 都支持组件化
- 都是数据驱动视图