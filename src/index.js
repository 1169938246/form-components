// const fs =require('fs')
// const path = require('path')

// const componentsDir = path.join(__dirname, 'components')
// console.log(componentsDir,'componentsDir')
// // 遍历组件文件夹
// fs.readdirSync(componentsDir).forEach(file => {
//     exports[file] = require(path.join(componentsDir, file));
//   });

// import fs from 'fs'
// import path, { dirname } from 'path'
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const componentsDir = path.join(__dirname, 'components')
// const fileList = {}
// fs.readdirSync(componentsDir).map(async(file) => {
//     const modulePath = `${dirname}${file}`
//     fileList = {...fileList,fileItem}
//   });

import UploadImage from './components/UploadImage/index'

export {
    UploadImage
}


