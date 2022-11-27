/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-18 14:15:04
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-18 14:16:47
 * @FilePath: /mini-vue-study/example/componentUpdate/main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
    h,
    ref
} from "../../lib/mini-vue-study.esm.js";
import Child from "./Child.js";

export const App = {
    name: "App",
    setup() {
        const msg = ref("123");
        const count = ref(1);

        window.msg = msg;

        const changeChildProps = () => {
            msg.value = "456";
        };

        const changeCount = () => {
            count.value++;
        };

        return {
            msg,
            changeChildProps,
            changeCount,
            count
        };
    },

    render() {
        return h("div", {}, [
            h("div", {}, "你好"),
            h(
                "button", {
                    onClick: this.changeChildProps,
                },
                "change child props"
            ),
            h(Child, {
                msg: this.msg,
            }),
            h(
                "button", {
                    onClick: this.changeCount,
                },
                "change self count"
            ),
            h("p", {}, "count: " + this.count),
        ]);
    },
};