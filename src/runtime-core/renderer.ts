import { ShapeFlags } from '../reactivity/shared/ShapeFlags';
import { isObject } from './../reactivity/shared/index';

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 10:19:35
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-06 23:35:27
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
   const {shapeFlag} = vnode
   if (shapeFlag & ShapeFlags.ELEMENT) {
      processElement(vnode, container)
   } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      processComponent(vnode, container)
   }

}

function processComponent(vnode: any, container: any) {
   mountComponent(vnode, container)
}

function mountComponent(initialVnode: any, container: any) {
   const instance = createComponentInstance(initialVnode)
   setupComponent(instance) //上面这些都是把组件的信息收集起来

   //下面的这个是开箱得到虚拟节点树
   setupRenderEffect(instance,initialVnode, container)
}




function setupRenderEffect(instance: any,vnode:any, container: any) {
   //这个 subTree 其实是一个虚拟节点树，
   /**
   * @description 描述
    相当于我们写的那个 render(){
       return h('div', 'hi,' +this.msg)
    }
   */
   const { proxy } = instance;
   //在执行 render 的时候使用 call指向这个 proxy
   const subTree = instance.render.call(proxy)
   // vnode -> patch
   //vnode -> element -> mountElement
   patch(subTree, container)

   //在这之后就是所有的 element 都处理好了，patch在传入 subTree 后，
   //内部也会执行到 mountElement里面会在subTree上挂载 el，el是真实节点
   //patch 是从上往下执行的，执行完后 subTree 身上的 el 就是一个完整的了得到
   vnode.el = subTree.el
}

function processElement(vnode: any, container: any) {
   //如果是元素节点那就初始化元素 mountElement(vnode, container)
   mountElement(vnode, container)
}

function mountElement(vnode: any, container: any) {
   console.log(vnode, container, '元素类型');

   //创建挂载元素
   //将创建的真实元素存储到虚拟节点的 el上
   const el = (vnode.el = document.createElement(vnode.type))
   const { children,shapeFlag } = vnode
   if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
   } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
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
