/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 15:05:35
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-03 16:49:32
 * @FilePath: /mini-vue-study/rollup.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import typescript from '@rollup/plugin-typescript';
// const typescript = require('@rollup/plugin-typescript')

export default {
    input: './src/index.ts' ,//入口
    output:[
        //出口
        //cjs esm
        {
            format:'cjs',
            file:"lib/mini-vue-study.cjs.js"//pkg.main
        },
        {
            format:'es',
            file: "lib/mini-vue-study.esm.js"//pkg.module
        }
    ],
    plugins:[
        typescript()
    ]
}