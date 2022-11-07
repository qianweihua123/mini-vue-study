
/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 10:14:31
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-07 16:21:10
 * @FilePath: /mini-vue-study/src/runtime-core/vnode.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ShapeFlags } from "../reactivity/shared/ShapeFlags"
export function createVNode(type: any, props?: any, children?: any) {
    const vnode = {
        type,
        props,
        children,
        shapeFlag: getShapeFlag(type),
        el: null
    }
    if (typeof children == 'string') {
        // vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
    } else if (Array.isArray(children)) {
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
    }

    return vnode
}

function getShapeFlag(type: any) {
    return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}