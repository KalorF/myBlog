const designModeChild = {
  title: '前端设计模式',
  children: [
    '/designMode/article/rule',
    '/designMode/article/jquery',
    '/designMode/article/factory',
    '/designMode/article/singleton',
    '/designMode/article/proxy',
    '/designMode/article/observer',
    '/designMode/article/iteration',
    '/designMode/article/status',
    '/designMode/article/decorator',
    '/designMode/article/other',
  ]
}
const javascriptBaseChild = {
  title: 'javascript基础',
  collapsable: true,
  children: [
    '/javascriptBase/article/varType',
    '/javascriptBase/article/actionClosure',
    '/javascriptBase/article/prototype',
    '/javascriptBase/article/async',
    '/javascriptBase/article/dateAndmath',
    '/javascriptBase/article/webApi',
    '/javascriptBase/article/runENV',
    '/javascriptBase/article/devENV',
  ]
}

const javascriptAdvancedChild = {
  title: 'javascript进阶',
  children: [
    '/javascriptAdvanced/article/prototype',
    '/javascriptAdvanced/article/async',
    '/javascriptAdvanced/article/realizePromise',
    '/javascriptAdvanced/article/vdom',
    '/javascriptAdvanced/article/mvvm',
    '/javascriptAdvanced/article/component',
    '/javascriptAdvanced/article/hybrid',
    '/javascriptAdvanced/article/rollupConf',
    '/javascriptAdvanced/article/webpackConf',
  ]
}

const designModeBar = ['/all/', designModeChild]
const javascriptBaseBar = ['/all/', javascriptBaseChild]
const javascriptAdvancedBar = ['/all/', javascriptAdvancedChild]
const allBar = [javascriptBaseChild, javascriptAdvancedChild, designModeChild]
const sidebar = {
  '/javascriptBase/': javascriptBaseBar,
  '/javascriptAdvanced/': javascriptAdvancedBar,
  '/designMode/': designModeBar,
  '/all/': allBar
}

module.exports = sidebar;