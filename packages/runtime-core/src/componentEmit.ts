/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-09 22:18:42
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-09 22:41:47
 * @FilePath: /mini-vue-study/src/runtime-core/componentEmit.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { camelize, toHandlerKey } from "@mini-vue-study/shared";

export function emit(instance: any, event: any, ...args: any) {
    console.log('emit', event);
    const { props } = instance


    const handlerName = toHandlerKey(camelize(event))

    const handler = props[handlerName]
    handler && handler(...args)

}