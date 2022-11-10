/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-10 11:39:11
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-10 16:00:35
 * @FilePath: /mini-vue-study/example/componentSlot/Foo.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
    h,
    renderSlots
} from "../../lib/mini-vue-study.esm.js";

export const Foo = {
    setup(props, {
        emit
    }) {
        const emitAdd = () => {
            console.log("emit add");
            emit("add", 1, 2);
            emit("add-foo");
        };

        return {
            emitAdd,
        };
    },
    render() {
        const foo = h("p", {}, "foo");
        //foo是插槽的占位，在 app.js里面我们传入的内容会在你这展示
        //
        // export const App = {
        //     name: "App",
        //     render() {
        //       // emit
        //       return h("div", {}, [
        //         h("div", {}, "App"),
        //         h(Foo, {
        //           onAdd(a, b) {
        //             console.log("onAdd", a, b);
        //           },
        //           onAddFoo() {
        //             console.log("onAddFoo");
        //           },
        //         }),
        //       ]);
        //     },

        //     setup() {
        //       return {};
        //     },
        //   };
        const age = 18
        return h("div", {}, [renderSlots(this.$slots, 'header',{age}), foo, renderSlots(this.$slots, "footer")]);
    },
};