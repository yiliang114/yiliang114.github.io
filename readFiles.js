/*
 * @Author: mrjzhang
 * @Date: 2019-11-16 20:21:25
 * @LastEditors  : mrjzhang
 * @LastEditTime : 2020-02-02 13:55:45
 */
const fs = require("fs");
const join = require("path").join;
const ZH_CN_NAMES = require("./zh-cn.json");

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

const excludeDirs = [".vuepress", "node_modules", ".git"];
const excludeFiles = ["README.md", "readme.md"];

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
  const division = "### 全部文章\n\n";
  let oldContent = fs.readFileSync("./README.md", "utf8");
  oldContent = oldContent.slice(0, oldContent.indexOf(division));

  // 拼接并追加 markdown
  const result = jsonFiles.reduce((content, filename) => {
    const name = getNameOrClassify(filename);
    const newline = "\r\n \r\n",
      piece = !!isMd(filename)
        ? `[${getFirstLineOfMd(filename)}](${filename}) ${newline}`
        : // ? `[${ZH_CN_NAMES.filenames[filename] || name}](${filename}) ${newline}`
          `**${ZH_CN_NAMES.classifies[name] || name}** ${newline}`;

    return content + piece;
  }, oldContent + division);

  fs.writeFileSync("./README.md", result);
}

function isMd(filename) {
  return filename && filename.endsWith(".md");
}

function getNameOrClassify(filename) {
  if (!filename) return;
  const temp = filename.split("/");
  let name = temp.pop();
  if (!name) {
    throw new Error("文件名异常");
  }
  if (isMd(name)) {
    return name.slice(0, -3);
  }
  return name;
}

function getFirstLineOfMd(filename) {
  const data = fs.readFileSync(filename, "utf8");
  const lines = data.split("\n");
  if (lines.length > 0) {
    const firstLine = lines[0];
    // 提取每一个文件的第一行
    return firstLine.replace(/^#+\s+/, "");
  }
  return getNameOrClassify(filename);
}

getJsonFiles("docs");
