/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-10-22 21:14:14
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-07 16:36:10
 * @FilePath: /mini-vue-study/src/reactivity/reactive.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { mutableHandles, readonlHandlers, shallowReadonlHandlers } from './baseHandlers'
import { track, trigger } from './effect'
import { isObject } from '../shared/index'
export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadOnly',
}
export function reactive(raw: any) {
    return createActiveObject(raw, mutableHandles)
}
//当我们使用 isReactive的时候，我们去触发传入对象上的 get
export function isReactive(value: any) {
    return !!value[ReactiveFlags.IS_REACTIVE]
}
export function isReadonly(value: any) {
    return !!value[ReactiveFlags.IS_READONLY]
}

export function isProxy(value: any) {
    return isReactive(value) || isReadonly(value)
}

export function readonly(raw: any) {
    return createActiveObject(raw, readonlHandlers)
}

export function shallowReadonly(raw: any) {
    return createActiveObject(raw, shallowReadonlHandlers)
}

function createActiveObject(raw: any, baseHandlers: any) {
    if (!isObject(raw)) {
        console.warn(`target ${raw} 必须是一个对象`);
        return raw
    }
    return new Proxy(raw, baseHandlers)
}