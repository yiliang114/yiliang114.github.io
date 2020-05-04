/**
 *  读取所有md文件数据
 */
const fs = require('fs') // 文件模块
const path = require('path') // 路径模块
const MD5 = require('md5.js')
const docsRoot = path.join(__dirname, '..', '..', 'docs') // docs文件路径

const PREFIX = '/pages/' // 链接前缀

function readFileList(dir = docsRoot, filesList = []) {
  const files = fs.readdirSync(dir)

  files.forEach(item => {
    const filePath = path.join(dir, item)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory() && item !== '.vuepress') {
      readFileList(path.join(dir, item), filesList) // 递归读取文件
    } else {
      if (path.basename(dir) !== 'docs') {
        // 过滤docs目录级下的文件
        const filename = path.basename(filePath)
        const lastIndex = filename.lastIndexOf('.')
        const name = filename.slice(0, lastIndex)
        const type = filename.slice(lastIndex + 1)
        if (type === 'md') {
          // 过滤非md文件
          filesList.push({
            name,
            filePath,
            permalink:
              PREFIX +
              new MD5()
                .update(name)
                .digest('hex')
                .substring(0, 16) // 永久链接
          })
        }
      }
    }
  })
  return filesList
}

module.exports = readFileList
