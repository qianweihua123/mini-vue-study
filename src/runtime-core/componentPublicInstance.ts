/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-05 23:02:08
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-05 23:09:25
 * @FilePath: /mini-vue-study/src/runtime-core/componentPublicInstance.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const publicPropertiesMap: any = {
    $el: (i: any) => i.vnode.el
}
export const PublicInstanceProxyHandlers: any = {
    get({ _: instance }, key: any) {
        const { setupState } = instance
        if (key in setupState) {
            return setupState[key]
        }
        //key ->$el
        // if (key == '$el') {
        //     return instance.vnode.el
        // }
        const publicGetter = publicPropertiesMap[key]
        if (publicGetter) {
           return publicGetter(instance)
        }
    }
}