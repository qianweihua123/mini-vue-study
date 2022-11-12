/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-12 16:21:15
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-12 16:23:12
 * @FilePath: /mini-vue-study/example/customRenderer/App.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { h } from "../../lib/mini-vue-study.esm.js";

export const App = {
  setup() {
    return {
      x: 100,
      y: 100,
    };
  },
  render() {
    return h("rect", { x: this.x, y: this.y });
  },
};