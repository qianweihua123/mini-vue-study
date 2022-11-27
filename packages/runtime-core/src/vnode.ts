
/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 10:14:31
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-18 14:30:12
 * @FilePath: /mini-vue-study/src/runtime-core/vnode.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { isObject } from "@mini-vue-study/shared"
import { ShapeFlags } from "@mini-vue-study/shared/src/ShapeFlags"

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')

export { createVNode as createElementVNode };
export function createVNode(type: any, props?: any, children?: any) {
    const vnode = {
        type,
        props,
        children,
        compoent: null,
        key: props && props.key,
        shapeFlag: getShapeFlag(type),
        el: null
    }
    if (typeof children == 'string') {
        // vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
    } else if (Array.isArray(children)) {
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
    }

    if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        if (typeof children === "object") {
            vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
        }
    }
    return vnode
}

function getShapeFlag(type: any) {
    return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}

//text
export function createTextVNode(text: string) {
    return createVNode(Text, {}, text)
}