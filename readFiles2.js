/*
 * @Author: mrjzhang
 * @Date: 2019-11-16 20:21:25
 * @LastEditors  : mrjzhang
 * @LastEditTime : 2020-02-01 16:58:15
 */
const fs = require("fs");
const join = require("path").join;

const excludeDirs = [".vuepress", "node_modules", ".git"];
const excludeFiles = ["README.md", "readme.md"];

function fileFilters(filename, excludeArr) {
  let bool = false,
    len = excludeArr.length;
  for (let i = 0; i < len; i++) {
    if (filename.indexOf(excludeArr[i]) > -1) {
      bool = true;
      break;
    }
  }
  return bool;
}

function getJsonFiles(jsonPath) {
  let jsonFiles = [];
  function findJsonFile(path) {
    const files = fs.readdirSync(path),
      len = files.length;
    for (let i = 0; i < len; i++) {
      let item = files[i];
      let fPath = join(path, item);
      let stat = fs.statSync(fPath);
      if (stat.isDirectory() && !fileFilters(fPath, excludeDirs)) {
        jsonFiles.push(fPath);
        findJsonFile(fPath);
      }
      if (
        stat.isFile() &&
        fPath.endsWith(".md") &&
        !fileFilters(fPath, excludeFiles)
      ) {
        // 如果发现是一个 md 文件的话， 就处理其中的图片
        jsonFiles.push(fPath);
      }
    }
  }

  findJsonFile(jsonPath);
  const result = jsonFiles.join("\r\n");
  fs.writeFileSync("./files.txt", result);
}

getJsonFiles("docs");