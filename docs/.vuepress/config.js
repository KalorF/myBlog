const sidebar = require('../config/sidebar.js')
module.exports = {
  title: 'Kalor 个人博客',
  description: '分享前端知识',
  base: '/myBlog/',
  themeConfig: {
    nav: [{
        text: '博客首页',
        link: '/'
      },
      {
        text: '文章归档',
        items: [{
            text: 'javascript基础',
            link: '/javascriptBase/article/varType'
          },
          {
            text: 'javascript进阶',
            link: '/javascriptAdvanced/article/prototype'
          },
          {
            text: '前端设计模式',
            link: '/designMode/article/rule'
          },
        ]
      },
      {
        text: 'GitHub',
        link: 'https://github.com/KalorF'
      }
    ],
    sidebar: sidebar,
    editLinks: true,
    // 默认为 "Edit this page"
    editLinkText: '在GitHub中编辑'
  }
}