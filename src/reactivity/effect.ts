
/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-10-22 21:23:39
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-10-30 20:44:06
 * @FilePath: /mini-vue-study/src/reactivity/effect.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { extend } from "./shared";

let activeEffect: any;

function cleanupEffect(effect: any) {
    effect.deps.forEach((dep: any) => {
        dep.delete(effect)
    })
    effect.deps.length = 0
}
// tdd是先写一个测试，然后让我们的代码通过，然后重构我们的代码保持可读性
class ReactiveEffect {
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
        activeEffect = this
        return this._fn()
    }
    stop() {
        if (this.active) {
            cleanupEffect(this)
            if(this.onStop){
               this.onStop()
            }
            this.active = false
        }
    }
}


let targetMap = new Map()
export function track(target: any, key: any) {
    //target -> key ->dep
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
    if(!activeEffect) return
    dep.add(activeEffect)
    activeEffect?.deps.push(dep)

}

export function trigger(target: any, key: any) {
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }

    }

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