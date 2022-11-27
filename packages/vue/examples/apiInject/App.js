/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-11 22:36:37
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-11 22:36:54
 * @FilePath: /mini-vue-study/example/apiInject/App.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 组件 provide 和 inject 功能
import { h, provide, inject } from "../../lib/guide-mini-vue.esm.js";

const Provider = {
  name: "Provider",
  setup() {
    provide("foo", "fooVal");
    provide("bar", "barVal");
  },
  render() {
    return h("div", {}, [h("p", {}, "Provider"), h(ProviderTwo)]);
  },
};

const ProviderTwo = {
  name: "ProviderTwo",
  setup() {
    provide("foo", "fooTwo");
    const foo = inject("foo");

    return {
      foo,
    };
  },
  render() {
    return h("div", {}, [
      h("p", {}, `ProviderTwo foo:${this.foo}`),
      h(Consumer),
    ]);
  },
};

const Consumer = {
  name: "Consumer",
  setup() {
    const foo = inject("foo");
    const bar = inject("bar");
    // const baz = inject("baz", "bazDefault");
    const baz = inject("baz", () => "bazDefault");

    return {
      foo,
      bar,
      baz,
    };
  },

  render() {
    return h("div", {}, `Consumer: - ${this.foo} - ${this.bar}-${this.baz}`);
  },
};

export default {
  name: "App",
  setup() {},
  render() {
    return h("div", {}, [h("p", {}, "apiInject"), h(Provider)]);
  },
};