/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-18 14:54:36
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-18 14:55:16
 * @FilePath: /mini-vue-study/example/nextTicker/App.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
    h,
    ref,
    getCurrentInstance,
    nextTick,
} from "../../lib/mini-vue-study.esm.js";

export default {
    name: "App",
    setup() {
        const count = ref(1);
        const instance = getCurrentInstance();

        function onClick() {
            for (let i = 0; i < 100; i++) {
                console.log("update");
                count.value = i;
            }

            debugger;
            console.log(instance);
            nextTick(() => {
                console.log(instance);
            });

            // await nextTick()
            // console.log(instance)
        }

        return {
            onClick,
            count,
        };
    },
    render() {
        const button = h("button", {
            onClick: this.onClick
        }, "update");
        const p = h("p", {}, "count:" + this.count);

        return h("div", {}, [button, p]);
    },
};