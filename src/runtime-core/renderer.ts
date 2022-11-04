import { isObject } from './../reactivity/shared/index';

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 10:19:35
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-04 23:10:40
 * @FilePath: /mini-vue-study/src/runtime-core/renderer.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { createComponentInstance, setupComponent } from "./component"

//调用 render 的过程就是一个拆箱的过程
export function render(vnode: any, container: any) {
   //render内部是调用 patch 方法
   patch(vnode, container)
}

function patch(vnode: any, container: any) {
   console.log(typeof vnode.type, container, '处理 patch');

   //如果是组件的话 vnode 上的 type 是一个对象，如果是元素的话 type 是 string(div)
   //我们先处理组件 processComponent
   if (typeof vnode.type === 'string') {
      processElement(vnode, container)
   } else if (isObject(vnode.type)) {
      processComponent(vnode, container)
   }

}

function processComponent(vnode: any, container: any) {
   mountComponent(vnode, container)
}

function mountComponent(vnode: any, container: any) {
   const instance = createComponentInstance(vnode)
   setupComponent(instance) //上面这些都是把组件的信息收集起来

   //下面的这个是开箱得到虚拟节点树
   setupRenderEffect(instance, container)
}




function setupRenderEffect(instance: any, container: any) {
   //这个 subTree 其实是一个虚拟节点树，
   /**
   * @description 描述
    相当于我们写的那个 render(){
       return h('div', 'hi,' +this.msg)
    }
   */
   const subTree = instance.render()
   // vnode -> patch
   //vnode -> element -> mountElement
   patch(subTree, container)
}

function processElement(vnode: any, container: any) {
   //如果是元素节点那就初始化元素 mountElement(vnode, container)
   mountElement(vnode, container)
}

function mountElement(vnode: any, container: any) {
   console.log(vnode, container, '元素类型');

   //创建挂载元素
   const el = document.createElement(vnode.type)
   const { children } = vnode
   if (typeof children === 'string') {
      el.textContent = children
   } else if(Array.isArray(children)){
      mountChildren(vnode, el)
   }

   const { props } = vnode
   for (const key in props) {
      el.setAttribute(key, props[key])
   }
   container.appendChild(el)

}

function mountChildren(vnode: any, container: any) {
   vnode.children.forEach((v: any) => {
      patch(v, container)
   })
}
