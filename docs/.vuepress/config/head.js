module.exports = [
  ['link', { rel: 'shortcut icon', href: '/favicon.icon.ico', type: 'image/jpg' }],
  ['link', { rel: 'manifest', href: '/manifest.json' }],
  [
    'meta',
    {
      name: 'keywords',
      content:
        '前端博客,个人技术博客,前端,前端开发,前端框架,web前端,前端面试题,技术文档,学习,面试,JavaScript,js,ES6,TypeScript,vue,python,css3,html5,Node,git,github,markdown'
    }
  ],
  [
    'link',
    {
      rel: 'stylesheet',
      type: 'text/css',
      href: 'https://at.alicdn.com/t/font_1678482_u4nrnp8xp6g.css'
    }
  ],
  // 不蒜子统计
  [
    'script',
    {
      async: true,
      src: '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
    }
  ]
]
