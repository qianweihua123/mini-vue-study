/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 10:14:31
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-03 10:15:56
 * @FilePath: /mini-vue-study/src/runtime-core/vnode.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export function createVNode(type,props?,children?){
    const vnode = {
        type,
        props,
        children,
    }
    return vnode
}