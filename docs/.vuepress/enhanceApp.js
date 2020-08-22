export default ({ router }) => {
  // router 守卫函数
  router.beforeEach((to, from, next) => {
    // console.log('to', to);
    // console.log('from', from);
    // new Image().src = 'https://cgi.yiliang.site/api/site';
    // new Image().src = 'http://localhost:3000/api/site';
    next();
  });
};
