const fs = require('fs'); // 文件模块
const path = require('path'); // 路径模块

const fileDesc = name => `
---
layout: CustomPages
title: ${name}
date: 2020-11-21
aside: false
draft: true
---
`;

let data = '';

function readFiles(dir) {
  const name = dir.split('/').pop();
  // const desc = '';
  const desc = fileDesc(name);
  console.log('desc', desc);

  return new Promise(resolve => {
    if (!dir) return;
    const files = fs.readdirSync(dir);

    for (let item of files) {
      let filePath = path.join(dir, item);
      const stat = fs.statSync(filePath);
      if (
        ['.DS_Store', '__test__', 'test', 'assets', 'templates', 'todo'].includes(item) ||
        item.startsWith('.') ||
        item.endsWith('.json') ||
        item.endsWith('.lock')
      ) {
        continue;
      }
      if (stat.isDirectory()) {
        readFiles(path.join(dir, item));
      } else {
        const result = fs.readFileSync(filePath, 'utf8');

        data += `${desc}\n\n# ${filePath}\n${item.endsWith('.js') ? '```js\n' + result + '\n```' : result}\n\n`;

        console.log('data', data);
      }
    }

    resolve(data);
  });
}

// function cutPath(url, prefix) {
//   if (url && url.startsWith(prefix)) {
//     return url.slice(prefix.length);
//   }
//   return url;
// }

// function readFile(filename) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(filename, 'utf8', (err, result) => {
//       if (!err) {
//         resolve(result);
//       }
//       reject(err);
//     });
//   });
// }

function writeFile(result, filename) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, result, err => {
      if (!err) {
        resolve();
      }
      reject(err);
    });
  });
}

async function start() {
  const data = await readFiles('SF/azl397985856-leetcode');
  // console.log('data', data);
  await writeFile(data, 'result.md');
}

start();
