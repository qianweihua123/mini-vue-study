/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-06 23:19:08
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-10 16:12:50
 * @FilePath: /mini-vue-study/src/reactivity/shared/ShapeFlags.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const enum ShapeFlags {
    ELEMENT = 1, // 0001
    STATEFUL_COMPONENT = 1 << 1, // 0010
    TEXT_CHILDREN = 1 << 2, // 0100
    ARRAY_CHILDREN = 1 << 3, // 1000
    SLOT_CHILDREN = 1 << 4, // 插槽
}