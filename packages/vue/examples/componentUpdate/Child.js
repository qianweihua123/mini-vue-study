/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-18 14:14:39
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-18 14:15:59
 * @FilePath: /mini-vue-study/example/componentUpdate/child.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
    h
} from "../../lib/mini-vue-study.esm.js";
export default {
    name: "Child",
    setup(props, {
        emit
    }) {},
    render(proxy) {
        return h("div", {}, [h("div", {}, "child - props - msg: " + this.$props.msg)]);
    },
};