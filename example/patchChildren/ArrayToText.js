/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-15 14:22:06
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-15 14:24:21
 * @FilePath: /mini-vue-study/example/patchChildren/ArrayToText.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 老的是 array
// 新的是 text

import { ref, h } from "../../lib/mini-vue-study.esm.js";
const nextChildren = "newChildren";
const prevChildren = [h("div", {}, "A"), h("div", {}, "B")];

export default {
  name: "ArrayToText",
  setup() {
    const isChange = ref(false);
    window.isChange = isChange;

    return {
      isChange,
    };
  },
  render() {
    const self = this;

    return self.isChange === true
      ? h("div", {}, nextChildren)
      : h("div", {}, prevChildren);
  },
};