/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-15 14:21:03
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-16 15:54:45
 * @FilePath: /mini-vue-study/example/patchChildren/App.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
    h
} from "../../lib/mini-vue-study.esm.js";

import ArrayToText from "./ArrayToText.js";
import TextToText from "./TextToText.js";
import TextToArray from "./TextToArray.js";
import ArrayToArray from "./ArrayToArray.js";

export default {
    name: "App",
    setup() {},

    render() {
        return h("div", {
            tId: 1
        }, [
            h("p", {}, "主页"),
            // 老的是 array 新的是 text
            //   h(ArrayToText),
            // 老的是 text 新的是 text
            // h(TextToText),
            // 老的是 text 新的是 array
            //   h(TextToArray)
            // 老的是 array 新的是 array
            h(ArrayToArray)
        ]);
    },
};