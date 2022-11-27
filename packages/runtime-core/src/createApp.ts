

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 10:06:04
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-12 17:08:01
 * @FilePath: /mini-vue-study/src/runtime-core/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { createVNode } from "./vnode"
//这儿的 render从外部传入
export function createAppAPI(render:any){
    return function createApp(rootComponent:any){
        return {
            mount(rootContainer:any){
             //先 vnode
             //component->vnode
             //所有的逻辑操作都会基于 vnode 操作
             const vnode = createVNode(rootComponent)
             render(vnode,rootContainer)
            }
        }
    }
}


