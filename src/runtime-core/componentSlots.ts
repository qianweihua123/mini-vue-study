import { ShapeFlags } from "../reactivity/shared/ShapeFlags";

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-10 11:50:02
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-10 16:14:21
 * @FilePath: /mini-vue-study/src/runtime-core/componentSlots.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export function initSolts(instance: any, children: any) {
    // instance.slots = Array.isArray(children) ? children : [children]
    const { vnode } = instance;
    if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
        normalizeObjectSlots(children,instance.slots)
    }else{
        instance.slots = {};
    }

}

function normalizeObjectSlots(children: any, slots: any) {
    for (const key in children) {
        slots[key] = (props:any) => normalizeSlotValue(children[key](props))
    }
}

function normalizeSlotValue(value: any) {
   return Array.isArray(value) ? value : [value]
}