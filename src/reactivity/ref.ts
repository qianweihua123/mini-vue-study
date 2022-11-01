/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-01 14:29:54
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-01 15:15:46
 * @FilePath: /mini-vue-study/src/reactivity/ref.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { isTracking, trackEffect, triggerEffects } from "./effect"
import { reactive } from "./reactive"
import { hasChanged, isObject } from "./shared"

class RefImpl {
    _value = ''
    dep = new Set()
    private rawValue;
    public __v_isRef:any = true
    constructor(value: any) {
        this.rawValue = value
        this._value = convert(value)
    }

    get value() {
        trackRefValue(this)
        return this._value
    }
    set value(newValue) {
        if (hasChanged(this.rawValue, newValue)) {
            this.rawValue = newValue
            this._value = convert(newValue)
            triggerEffects(this.dep)
        }
    }
}
function trackRefValue(ref:any){
    if (isTracking()) {
        trackEffect(ref.dep)
    }
}

function convert(value:any){
    return isObject(value)? reactive(value) : value
}
export function ref(value: any) {
    return new RefImpl(value);
}

export function isRef(ref:any){
     return !!ref['__v_isRef']
}

export function unRef(ref: any){
     return isRef(ref)? ref.value: ref
}