import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'

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
        format: 'es'
    },
    plugins: [
        babel({
            exclude: 'node_modules/**', // 防止打包node_modules下的文件
        }),
        postcss() //不使用less可以删除
        ],
    // 设置react为外部引用，可避免打包时打进去，否则警告(!) Unresolved dependencies
    external: ['react']
}

