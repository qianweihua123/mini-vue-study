/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-08 16:32:40
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-09 23:02:23
 * @FilePath: /mini-vue-study/example/componentEmit/main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from "../../lib/mini-vue-study.esm.js";
console.log(createApp,11);

import { App } from "./App.js";

const rootContainer = document.querySelector("#app");
createApp(App).mount(rootContainer);