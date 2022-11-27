/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 15:51:17
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-07 16:37:20
 * @FilePath: /mini-vue-study/example/helloword/App.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  h
} from "../../dist/mini-vue-study.esm.js";

import {
  Foo
} from "./foo.js";
export const App = {
  // 必须要写 render
  name: 'App',
  render() {
    // ui
    return h("div", {
        id: 'root',
        class: ["red", "hard"],
        onClick() {
          console.log('click')
        }
      },
      // [h("p", {
      //   class: "red"
      // }, "hi"), h("p", {
      //   class: "blue"
      // }, "min-vue")]
      // "hi," + this.msg
      [h("div", {
        id: '1'
      }, "hi," + this.msg), h(Foo, {
        count: 1
      })]
    ); // + this.msg
  },
  setup() {
    return {
      msg: "mini-vue1",
    };
  },
};