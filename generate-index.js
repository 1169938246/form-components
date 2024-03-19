/**
 * 动态地将src/components目录下的所有文件导出到src/index.js中。

 */
const fs = require("fs");
const path = require("path");

const compoentsDir = path.resolve(__dirname, "src/components");
const indexPath = path.resolve(__dirname, "src/index.js");
fs.writeFileSync(indexPath, '');
fs.readdirSync(compoentsDir).map((file) => {
  const importPath = "./components/" + file;
  // 动态导入语法在这里不会执行，但我们可以将其格式化成字符串写入到index.js中
  const importStatement = `export { default as ${file} } from '${importPath.replace(/\\/g, "/")}/index';\n`;
  fs.appendFileSync(path.resolve(__dirname, "src/index.js"), importStatement);
});
 