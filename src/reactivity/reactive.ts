/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-10-22 21:14:14
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-10-31 15:51:03
 * @FilePath: /mini-vue-study/src/reactivity/reactive.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { mutableHandles, readonlHandlers } from './baseHandlers'
import { track, trigger } from './effect'

export function reactive(raw: any) {
    return createActiveObject(raw,mutableHandles)
}

export function readonly(raw: any) {
    return createActiveObject(raw,readonlHandlers)
}

function createActiveObject(raw:any,baseHandlers:any){
     return new Proxy(raw,baseHandlers)
}