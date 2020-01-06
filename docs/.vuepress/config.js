module.exports = {
  title: 'yiliang',
  description: '嘻嘻',
  base: '/blog/',
  head: [
    [
      'link',
      { rel: 'shortcut icon', href: '/favicon.icon.ico', type: 'image/jpg' }
    ]
  ],
  themeConfig: {
    logo: '/assets/img/logo.jpg',
    smoothScroll: true,
    nav: [
      {
        text: 'Languages',
        items: [
          { text: 'Chinese', link: '/language/chinese' },
          { text: 'Japanese', link: '/language/japanese' }
        ]
      },
      { text: '知识库', link: '/' },
      { text: '工具', link: '/guide/' },
      {
        text: '我',
        link: 'Github'
      }
    ],
    sidebar: {}
  }
}
