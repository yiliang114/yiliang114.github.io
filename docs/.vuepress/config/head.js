module.exports = [
  ['link', { rel: 'shortcut icon', href: '/favicon.ico', type: 'image/jpg' }],
  ['link', { rel: 'manifest', href: '/manifest.json' }],
  [
    'meta',
    {
      name: 'keywords',
      content:
        '前端博客,个人技术博客,前端,前端开发,前端框架,web前端,前端面试题,技术文档,学习,面试,JavaScript,js,ES6,TypeScript,vue,python,css3,html5,Node,git,github,markdown',
    },
  ],
  // ...(process.env.NODE_ENV === 'production'
  //   ? [
  //       // 不蒜子统计
  //       [
  //         'script',
  //         {
  //           async: true,
  //           src: '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js',
  //         },
  //       ],
  //     ]
  //   : []),
];
