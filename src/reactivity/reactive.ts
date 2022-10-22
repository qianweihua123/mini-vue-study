/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-10-22 21:14:14
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-10-22 22:07:38
 * @FilePath: /mini-vue-study/src/reactivity/reactive.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { track,trigger } from './effect'
export function reactive(raw:any) {
    return new Proxy(raw, {
        get(target, key) {
          const res = Reflect.get(target, key)
          //依赖收集
          track(target, key)
          return res
        },
        set(target, key,value){
            const res = Reflect.set(target, key,value)
            //触发依赖
            trigger(target,key)
            return res
        }
    })
}