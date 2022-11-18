/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-18 14:45:27
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-18 14:45:51
 * @FilePath: /mini-vue-study/src/runtime-core/componentUpdateUtils.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export function shouldUpdateComponent(prevVNode, nextVNode) {
    const { props: prevProps } = prevVNode;
    const { props: nextProps } = nextVNode;

    for (const key in nextProps) {
        if (nextProps[key] !== prevProps[key]) {
            return true;
        }
    }

    return false;
}