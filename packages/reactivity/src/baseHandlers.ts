/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-10-31 12:06:27
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-01 14:13:17
 * @FilePath: /mini-vue-study/src/reactivity/baseHandlers.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { track, trigger } from "./effect"
import { reactive, ReactiveFlags, readonly } from "./reactive";
import { extend, isObject } from "@mini-vue-study/shared";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly: any = false, shallow = false) {
    return function get(target: any, key: any) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly;
        }
        const res = Reflect.get(target, key)
        if (shallow) {
            return res
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res)
        }
        //依赖收集
        if (!isReadonly) {
            track(target, key)
        }
        return res
    }
}

function createSetter() {
    return function set(target: any, key: any, value: any) {
        const res = Reflect.set(target, key, value)
        //触发依赖
        trigger(target, key)
        return res
    }
}

export const mutableHandles = {
    get,
    set
}

export const readonlHandlers = {
    get: readonlyGet,
    set(target: any, key: any, value: any) {
        console.warn(
            `key :"${String(key)}" set 失败，因为 target 是 readonly 类型`,
            target
        );
        return true
    }
}

export const shallowReadonlHandlers = extend({}, readonlHandlers, {
    get: shallowReadonlyGet
})