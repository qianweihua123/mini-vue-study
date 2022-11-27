

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-11 22:40:01
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-11 23:27:21
 * @FilePath: /mini-vue-study/src/runtime-core/apiInject.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { getCurrentInstance } from "./component";
export function provide(key: any, value: any) {
    //存值
    let currentInstance = getCurrentInstance()
    if (currentInstance) {
        let { provides } = currentInstance;
        //先获取到父级的 provides
        const parentProvides = currentInstance.parent.provides;
        //只需要去指向一次，所有我们判断下在初始化的时候因为会判断 parent 有值，那就拿到父级的 provides保存到自己身上，所以相等会进入判断
        if (provides === parentProvides) {
            provides = currentInstance.provides = Object.create(parentProvides); //相等的情况下，我们让父级的原型链指向子级
          }
        provides[key] = value
    }
}

export function inject(key: any, defaultValue: any) {
    //取值
    const currentInstance = getCurrentInstance()
    if (currentInstance) {
        const parentProvides = currentInstance.parent.provides;
        if (key in parentProvides) {
            return parentProvides[key];
          }else if(defaultValue){//支持 inject的时候给到默认值，支持函数返回值的形式和直接值的形式
            if(typeof defaultValue === "function"){
              return defaultValue()
            }
            return defaultValue
          }
    }
}