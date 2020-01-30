/*
 * @Author: mrjzhang
 * @Date: 2020-01-28 21:06:46
 * @LastEditors: mrjzhang
 * @LastEditTime: 2020-01-30 15:42:14
 */
function createGitalk(commentID) {
  // 只在 yiliang.site 中显示评论系统
  if (
    typeof window === "undefined" &&
    location.origin !== "https://yiliang.site"
  ) {
    //只在浏览器中运行，以免发布时出错
    return;
  }

  const gitalk = new Gitalk({
    clientID: "48fbb5f715409b48da06",
    clientSecret: "c9e49316010d9e3336a6662545cba8b0ab903044",
    repo: "yiliang114.github.io",
    owner: "yiliang114",
    // 这里接受一个数组，可以添加多个管理员，可以是你自己
    admin: ["yiliang114"],
    // id 用于当前页面的唯一标识，一般来讲 pathname 足够了，
    // 但是如果你的 pathname 超过 50 个字符，GitHub 将不会成功创建 issue，此情况可以考虑给每个页面生成 hash 值的方法.
    id: commentID,
    distractionFreeMode: false
  });

  const gtBox = document.querySelector("#gitalk-container");

  if (gtBox) {
    gtBox.innerHTML = ""; //清空之
    gitalk.render("gitalk-container");
  } else {
    window.onload = () => {
      gitalk.render("gitalk-container");
    };
  }
}

export default ({
  Vue,
  options,
  router, // 当前应用的路由实例
  siteData
}) => {
  router.afterEach((to, from) => {
    if (to.fullPath.split("#")[0] === from.fullPath.split("#")[0]) {
      //页面内的路由变化不作处理
      return;
    }

    const pn = to.fullPath.split("/");
    const cid = pn[pn.length - 1].split(".")[0];
    createGitalk(cid);
  });
};
