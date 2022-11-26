/*
 * @Author: qwh 15806293089@163.com1
 * @Date: 2022-11-03 10:06:04
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-18 15:13:12
 * @FilePath: /mini-vue-study/src/runtime-core/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// export { createApp } from "./createApp";

export { h } from "./h"

export { renderSlots } from "./helper/renderSlots"

export { createTextVNode, createElementVNode } from './vnode'

export { getCurrentInstance, registerRuntimeCompiler } from "./component";

export { provide, inject } from "./apiInject";

export { createRenderer } from "./renderer";

export { nextTick } from "./scheduler";

export { toDisplayString } from "../reactivity/shared";
export * from "../reactivity";