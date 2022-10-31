/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-10-30 20:40:52
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-10-31 21:04:14
 * @FilePath: /mini-vue-study/src/reactivity/shared/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const extend= Object.assign
export const isObject = (val:any) =>{
    return val !==null && typeof val === 'object'
}