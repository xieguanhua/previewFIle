// const fs = require('fs');
import fs from 'fs'
import path from 'path'

const regex = /\.(jpg|jpeg|png|gif)$/i
const filePath = 'public/'

function deep(dir, list) {
    const arr = fs.readdirSync(path.join(dir))
    arr.forEach(item => {
        const child = []
        const itemPath = path.join(dir, item)
        const isDir = fs.statSync(itemPath).isDirectory()
        //图片或者文件夹
        if (isDir || regex.test(item)) {

            list.push({name: item, child, isDir,path:dir.replace(/\\/g, '/').replace(filePath, ''), file: itemPath.replace(/\\/g, '/').replace(filePath, '')})
        }
        isDir && deep(itemPath, child)
    })
}

export default defineEventHandler(async (event) => {
    try {
        // const {path} = getQuery(event)
        const path = filePath
        const list = []
        deep(path, list)
        return list
    } catch (e) {
        console.log(e)
        return {
            code: 500,
            msg: '文件读取失败'
        }
    }
})
