/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 15:05:35
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-03 16:53:42
 * @FilePath: /mini-vue-study/rollup.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import typescript from '@rollup/plugin-typescript';
// const1 typescript = require('@rollup/plugin-typescript')

export default {
    input: './packages/vue/src/index.ts', //入口
    output: [
        //出口
        //cjs esm
        {
            format: 'cjs',
            file: "packages/vue/dist/mini-vue-study.cjs.js" //pkg.main
        },
        {
            format: 'es',
            file: "packages/vue/dist/mini-vue-study.esm.js" //pkg.module
        }
    ],
    plugins: [
        typescript()
    ]
}