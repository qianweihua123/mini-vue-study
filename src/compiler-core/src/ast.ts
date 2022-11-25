/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-19 22:27:44
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-21 20:20:51
 * @FilePath: /mini-vue-study/src/compiler-core/src/ast.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { CREATE_ELEMENT_VNODE } from "./runtimeHelpers";
export const enum NodeTypes {
    INTERPOLATION,
    SIMPLE_EXPRESSION,
    ELEMENT,
    TEXT,
    ROOT,
    COMPOUND_EXPRESSION,
}

export function createVNodeCall(context: any, tag: any, props: any, children: any) {
    context.helper(CREATE_ELEMENT_VNODE);

    return {
        type: NodeTypes.ELEMENT,
        tag,
        props,
        children,
    }
}