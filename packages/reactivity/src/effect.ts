
/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-10-22 21:23:39
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-15 14:48:27
 * @FilePath: /mini-vue-study/src/reactivity/effect.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { extend } from "@mini-vue-study/shared";

let activeEffect: any;
let shouldTrack: any
function cleanupEffect(effect: any) {
    effect.deps.forEach((dep: any) => {
        dep.delete(effect)
    })
    effect.deps.length = 0
}
// tdd是先写一个测试，然后让我们的代码通过，然后重构我们的代码保持可读性
export class ReactiveEffect {
    private _fn: any
    public scheduler: any
    deps = []
    active = true
    onStop?: () => void
    constructor(fn: any, scheduler?: any) {
        this._fn = fn;
        this.scheduler = scheduler;
    }
    run() {
        if (!this.active) {
            return this._fn()
        }
        shouldTrack = true
        activeEffect = this
        const result = this._fn()
        shouldTrack = false
        return result

    }
    stop() {
        if (this.active) {
            cleanupEffect(this)
            if (this.onStop) {
                this.onStop()
            }
            this.active = false
        }
    }
}
export function isTracking() {
    return shouldTrack && activeEffect !== undefined
}

let targetMap = new Map()
export function track(target: any, key: any) {
    //target -> key ->dep
    if (!isTracking()) return
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Set()
        depsMap.set(key, dep)
    }
    trackEffect(dep)

}

export function trackEffect(dep: any) {
    if (dep.has(activeEffect)) return
    dep.add(activeEffect)
    activeEffect?.deps.push(dep)
}

export function trigger(target: any, key: any) {
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)
    triggerEffects(dep)

}

export function triggerEffects(dep: any) {
    const effects = Array.from(dep)
    effects.forEach((effect: any) => {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }

    })
}

export function effect(fn: any, options: any = {}) { //effect是一个函数，内部去 new 一个类 ，类的内部保存了传入的函数，并且先调用下传入的函数
    const scheduler = options.scheduler
    const _effect = new ReactiveEffect(fn, options.scheduler)
    extend(_effect, options)
    _effect.run()
    const runner: any = _effect.run.bind(_effect)
    runner.effect = _effect
    return runner
}

export function stop(runner: any) {
    runner.effect.stop()
}