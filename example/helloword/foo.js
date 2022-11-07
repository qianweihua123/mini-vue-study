
/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-07 14:57:07
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-07 15:03:34
 * @FilePath: /mini-vue-study/example/helloword/foo.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
    h
  } from "../../lib/mini-vue-study.esm.js";
export const Foo = {
    setup(props){
     console.log(props);
    },
    render(){
      return h("div",{}, "foo:" + this.count)
    }
}