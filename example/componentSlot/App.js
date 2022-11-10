/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-10 11:38:52
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-10 16:08:22
 * @FilePath: /mini-vue-study/example/componentSlot/App.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
    h
} from "../../lib/mini-vue-study.esm.js";
import {
    Foo
} from "./Foo.js";

export const App = {
    name: "App",
    render() {
        // emit
        const app = h('div', {}, "App")
        const foo = h(Foo, {}, {
          //因为在 foo 中给了一个对象，这得解构下
          header:({age}) => h("p", {}, 'header'+age),
          footer:() => h("p",{},'footer'),
        })
        return h("div", {}, [
            app, foo
        ]);
    },

    setup() {
        return {};
    },
};