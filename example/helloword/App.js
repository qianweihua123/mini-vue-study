/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 15:51:17
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-04 23:02:00
 * @FilePath: /mini-vue-study/example/helloword/App.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  h
} from "../../lib/mini-vue-study.esm.js";

export const App = {
  // 必须要写 render
  render() {
    // ui
    return h("div", {
      id: 'root',
      class: ["red", "hard"]
    },[h("p",{class:"red"},"hi"),h("p",{class:"blue"},"min-vue")]);// + this.msg
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};