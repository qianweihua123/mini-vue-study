/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-12 16:21:56
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-12 16:22:10
 * @FilePath: /mini-vue-study/example/customRenderer/main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRenderer } from "../../lib/mini-vue-study.esm.js";
import { App } from "./App.js";

const game = new PIXI.Application({
  width: 500,
  height: 500,
});

document.body.append(game.view);

const renderer = createRenderer({
  createElement(type) {
    if (type === "rect") {
      const rect = new PIXI.Graphics();
      rect.beginFill(0xff0000);
      rect.drawRect(0, 0, 100, 100);
      rect.endFill();

      return rect;
    }
  },
  patchProp(el, key, val) {
    el[key] = val;
  },
  insert(el, parent) {
    parent.addChild(el);
  },
});

renderer.createApp(App).mount(game.stage);