/*
 * @Author: qwh 15806293089@163.com1
 * @Date: 2022-11-03 15:06:29
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-15 14:48:13
 * @FilePath: /mini-vue-study/src/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */


import { createRenderer } from "../runtime-core";

function createElement(type:any) {
  return document.createElement(type);
}

function patchProp(el:any, key:any, prevVal:any,nextVal:any) {
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, nextVal);
  } else {
    if (nextVal === undefined || nextVal === null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextVal);
    };
  }
}

function remove(child:any) {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}

function setElementText(el:any, text:any) {
  el.textContent = text;
}
function insert(el:any, parent:any) {
  parent.append(el);
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
  remove,
  setElementText,
});

export function createApp(...args:any) {
  return renderer.createApp(...args);
}

export * from "../runtime-core";
