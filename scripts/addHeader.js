const fs = require('fs'); // 文件模块
const path = require('path'); // 路径模块

const fileDesc = name => `---
layout: CustomPages
title: ${name}
date: 2020-11-21
aside: false
draft: true
---
`;

// const ignoreFolders = ['.DS_Store', '__test__', 'test', 'assets', 'templates', 'todo'];

// const ignoreStartFiles = ['.'];

// const ignoreEndFiles = ['.json', '.lock', '.png', '.html', '.css', '.jsx', '.js', '.jpg'];

// function checkFolder(dir) {
//   const targetDir = dir.replace(/\s+/g, '');
//   const folders = targetDir.split('/');
//   let path = '';
//   console.log('fs.statSync(path)', fs.statSync('/new/SF/'));

//   // for (let i = 0; i < folders.length; i++) {
//   //   path += (i > 0 ? '/' : '') + folders[i];
//   //   const stat = fs.statSync(path);
//   //   console.log('stat', stat);
//   //   if (!stat || !stat.isDirectory()) {
//   //     console.log('不存在 path', path);
//   //     fs.mkdirSync(path);
//   //   } else {
//   //     console.log('存在 path', path);
//   //   }
//   // }
// }

function readFiles(dir) {
  if (!dir) return;
  const targetDir = ('new/' + dir).replace(/\s+/g, '');
  // for (let i = 1; i < targetDir.split('/'); i++) {}
  if (!fs.statSync(targetDir).isDirectory()) {
    fs.mkdirSync(targetDir);
  }
  const name = dir.split('/').pop();
  const desc = fileDesc(name);
  const files = fs.readdirSync(dir);
  console.log('files', files);

  for (let item of files) {
    let filePath = path.join(dir, item);
    const stat = fs.statSync(filePath);
    if (['.DS_Store', '__test__'].includes(item)) {
      continue;
    }
    if (stat.isDirectory()) {
      fs.mkdirSync('new/' + filePath);
      readFiles(filePath);
    } else {
      let data = '';
      const result = fs.readFileSync(filePath, 'utf8');
      data += `${desc}\n${result}`;
      console.log('filePath', filePath);

      fs.writeFileSync('new/' + filePath.replace(/\s+/g, ''), data);
    }
  }
}

async function start() {
  readFiles('前端/Store');
  // checkFolder('new/SF/题解');
}

start();
