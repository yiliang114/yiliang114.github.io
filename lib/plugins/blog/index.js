const path = require('path');
const format = require('date-fns/format');
const crypto = require('crypto-js');

function md5(s) {
  return crypto
    .MD5(s)
    .toString()
    .toUpperCase();
}

function randomString(len) {
  len = len || 8;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

let cachePrefixMap;

module.exports = ({
  // lib 中使用 blog 插件传入的参数
  postsDirs = ['_posts'],
  randomDirs = ['_random'],
  postsLayout = 'Post',
  permalink = '/posts/:year/:month/:day/:slug.html',
  lang,
  prefixMap,
}) => {
  cachePrefixMap = prefixMap;
  // 确保 str 是携带前后两个斜杠
  const ensureBothSlash = dirs => dirs.map(str => str.replace(/^\/?(.*)\/?$/, '/$1/'));

  return {
    plugins: [
      [
        require('../blog-vuepress'),
        {
          categoryIndexPageUrl: '/posts/categories/',
          tagIndexPageUrl: '/posts/tags/',
          columnIndexPageUrl: '/posts/columns/',
          // 透传给 blog-vuepress 插件
          postsDirs,
          randomDirs,
          lang,
          // 额外扩展
          // pageEnhancers: [
          //   {
          //     when: ({ regularPath }) => randomDirs.some(prefix => regularPath.startsWith(`/${prefix}/`)),
          //     // func
          //     frontmatter: {
          //       layout: 'Post',
          //       permalink: ({ frontmatter: { title = '', date = '', random = randomString() } }) => {
          //         // const str = md5(`${date || random}-${title}`);
          //         const str = `${random}-${title}`;
          //         console.log('ctx ===== ', str);
          //         return `/${str}/:slug.html`;
          //       },
          //     },
          //     data: { type: 'post' },
          //   },
          // ],
        },
      ],
    ],

    extendPageData($page) {
      // Test the page if is a post according to the postsDirs
      if (ensureBothSlash([...postsDirs, ...randomDirs]).some(prefix => $page.path.startsWith(prefix))) {
        // Set the meta data of the page
        $page.frontmatter.layout = $page.frontmatter.layout || postsLayout;
        $page.frontmatter.permalink = $page.frontmatter.permalink || permalink;
        $page.type = 'post';
        $page.top = $page.frontmatter.top || false;
        $page.tags = $page.frontmatter.tags || [];
        $page.category = $page.frontmatter.category;
        $page.createdAt = $page.frontmatter.date ? format($page.frontmatter.date, 'YYYY-MM-DD') : null;

        // 随机目录的链接: 改写 permalink
        if (ensureBothSlash(randomDirs).some(prefix => $page.path.startsWith(prefix))) {
          const { title = '', date = '', random = randomString() } = $page.frontmatter;
          const str = md5(`${date || random}-${title}`);
          $page.frontmatter.permalink = `/posts/${str}/:slug.html`;
        } else {
          // 修改 permalink 的前缀。 可以在 md 中自己添加前缀。也可以设置成直接从 path 中读取
          let { prefix = '' } = $page.frontmatter;
          $page.frontmatter.oldPermalink = $page.frontmatter.permalink;
          const pathPrefix = $page.path.match(/^\/\w+\//) || [];
          // 优先 md 中指定的 prefix
          prefix = prefix ? `/${prefix}/` : pathPrefix[0];
          const { permalink: oldPermalink } = $page.frontmatter;
          if (prefix && cachePrefixMap[prefix.slice(1, prefix.length - 1)]) {
            $page.frontmatter.permalink = oldPermalink.replace(/^\/\w+\//, prefix);
          }
        }
      }
    },
    enhanceAppFiles: [path.resolve(__dirname, 'enhanceApp.js')],
  };
};
