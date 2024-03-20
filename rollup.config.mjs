import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import del from 'rollup-plugin-delete';
import { terser } from 'rollup-plugin-terser';
import autoprefixer from 'autoprefixer';

export default {
    input: './src/index.js',
    output: {
        file: './lib/bundle.js',
        // 输出类型 (amd, cjs, es, iife, umd, system)：
        // iife——最早的模块，jQuery时代流行，封装成一个自执行函数，缺点是污染全局变量，且需手动维护script标签加载顺序
        // cjs——即CommonJS，解决了以上问题，但只运行在node.js环境，不支持浏览器。
        // amd——通过requirejs实现，支持浏览器，解决了前面所有问题，但写法复杂，可读性很差，不符合通用的模块化思维
        // umd——兼容了cjs和amd，但产生了更难理解的代码，包也增大
        // system——面向未来的模块依赖方式，微前端流行
        // es——现代化标准
        format: 'es',
        sourcemap: false,
    },
    plugins: [
        babel({
            exclude: 'node_modules/**', // 防止打包node_modules下的文件
        }),
        // peerDepsExternal(),
        resolve(), // 解析第三方模块
        commonjs(), // 将CommonJS模块转换为ES6模块
        // postcss(), //不使用less可以删除
        del({targets: ['lib']}),
        terser(), // 添加此插件以进行代码压缩
        // less(),
        postcss({
            extract: true,
            minimize: true,
            plugins: [autoprefixer()], // 自动添加浏览器前缀
          })
        ],
        
    // 设置react为外部引用，可避免打包时打进去，否则警告(!) Unresolved dependencies
    external: ['react','moment','antd','fl-pro','less','lodash','moment','react-color','react-dom','wangeditor','dva']
}

