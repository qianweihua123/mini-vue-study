/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-08 16:31:34
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-09 22:58:27
 * @FilePath: /mini-vue-study/example/componentEmit/Foo.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { h } from "../../lib/mini-vue-study.esm.js";

export const Foo = {
  setup(props, { emit }) {
    const emitAdd = () => {
      console.log("emit add");
      emit("add",1,2);
      emit("add-foo");
    };

    return {
      emitAdd,
    };
  },
  render() {
    const btn = h(
      "button",
      {
        onClick: this.emitAdd,
      },
      "emitAdd"
    );

    const foo = h("p", {}, "foo");
    return h("div", {}, [foo, btn]);
  },
};