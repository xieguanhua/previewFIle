// const fs = require('fs');
// const path = require('path');

// fs.readdir(directoryPath, function(err, files) {
//     if (err) {
//         return console.log('Unable to scan directory: ' + err);
//     }
//
//     files.forEach(function(file) {
//         const extname = path.extname(file);
//         if (extname === '.jpg' || extname === '.jpeg' || extname === '.png' || extname === '.gif') {
//             console.log(file);
//             // 在这里可以对文件进行操作，例如读取文件内容或者复制文件到其他目录
//         }
//     });
// });
import fs from 'fs'
import path from 'path'

function deep(dir, list) {
    const arr = fs.readdirSync(path.join(dir))
    arr.forEach(item => {
        const child = []
        const itemPath = path.join(dir, item)
        const isDir = fs.statSync(itemPath).isDirectory()
        list.push({name: item, child, isDir})
        isDir && deep(itemPath, child)
    })
}
export default defineEventHandler(async (event) => {
    try {
        const {path} = getQuery(event)
        const list = []
        deep(path, list)
        return list
    } catch (e) {
        return {
            code: 500,
            msg:'文件读取失败'
        }
    }
})
