/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-10 14:52:21
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-10 17:25:35
 * @FilePath: /mini-vue-study/src/runtime-core/helper/renderSlots.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createVNode,Fragment } from "../vnode";

export function renderSlots(slots: any, name: any, props:any) {
    console.log(slots, 'slots');
    const slot = slots[name];
    if (slot) {
        if (typeof slot === 'function') {
            return createVNode(Fragment, {}, slot(props))
        }
    }
}