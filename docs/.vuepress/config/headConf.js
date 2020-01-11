// headConfig
module.exports = [
  [
    "link",
    { rel: "shortcut icon", href: "/favicon.icon.ico", type: "image/jpg" }
  ],
  // gitalk js css 文件
  [
    "link",
    {
      ref: "stylesheet",
      src: "https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css"
    }
  ],
  [
    "script",
    {
      src: "https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js",
      type: "text/javascript"
    }
  ]
];
