const fs = require('fs'); // 文件模块
const path = require('path'); // 路径模块

let root;
function readFileList(dir, map, duplicateArr) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async resolve => {
    if (!dir) return;

    if (!root) {
      root = dir;
    }
    const files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i++) {
      const item = files[i];
      let filePath = path.join(dir, item);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory() && (item !== 'assets' || item !== 'images')) {
        await readFileList(path.join(dir, item), map, duplicateArr); //递归读取文件
      } else {
        if (filePath.endsWith('.md')) {
          // 过滤非 md 文件
          (await getTitles(filePath)).forEach(title => {
            if (title in map) {
              duplicateArr.push(title);
            } else {
              map[title] = true;
            }
          });
        }
      }
    }
    resolve([map, duplicateArr]);
  });
}

function getTitles(filePath) {
  return new Promise(resolve => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) throw err;
      const result = data && data.match(/#+ (.*)/g);
      resolve(result || []);
    });
  });
}

function start() {
  const map = {};
  const duplicateArr = [];
  readFileList('docs', map, duplicateArr).then(([, duplicateArr]) => {
    const result = [...new Set(duplicateArr.map(val => val.replace(/#+ /, '')))].reverse()
    console.log(JSON.stringify(result));
  });
}

console.log('start');
start();
