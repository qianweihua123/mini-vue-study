/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-10-22 21:23:39
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-10-22 22:13:36
 * @FilePath: /mini-vue-study/src/reactivity/effect.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
class ReactiveEffect {
    private _fn:any
    constructor(fn:any){
        this._fn = fn;
    }
    run(){
        activeEffect = this
        this._fn()
    }
}

let targetMap = new Map()
export function track(target:any,key:any){
    //target -> key ->dep
    let depsMap = targetMap.get(target)
    if(!depsMap){
        depsMap = new Map()
        targetMap.set(target,depsMap)
    }
    let dep = depsMap.get(key)
    if(!dep){
        dep = new Set()
        depsMap.set(key,dep)
    }
    dep.add(activeEffect)

}

export function trigger(target:any,key:any){
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)
    for(const effect of dep){
        effect.run()
    }

}
let activeEffect: any;
export function effect(fn:any){ //effect是一个函数，内部去 new 一个类 ，类的内部保存了传入的函数，并且先调用下传入的函数
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}