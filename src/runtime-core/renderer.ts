import { effect } from '../reactivity/effect';
import { ShapeFlags } from '../reactivity/shared/ShapeFlags';
import { EMPTY_OBJ, isObject } from './../reactivity/shared/index';

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 10:19:35
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-15 14:58:39
 * @FilePath: /mini-vue-study/src/runtime-core/renderer.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { createComponentInstance, setupComponent } from "./component"
import { createAppAPI } from './createApp';
import { Fragment, Text } from './vnode';
//此方法可以创建一个渲染器 ,这个 options 就是传入的相关平台元素的操作方法
export function createRenderer(options: any) {
   const {
      createElement: hostCreateElement,
      patchProp: hostPatchProp,
      insert: hostInsert,
      remove: hostRemove,
      setElementText: hostSetElementText,
   } = options;
   //调用 render 的过程就是一个拆箱的过程
   function render(vnode: any, container: any, parentComponent: any) {
      //render内部是调用 patch 方法
      patch(null, vnode, container, parentComponent)
   }



   function patch(n1: any, n2: any, container: any, parentComponent: any) {

      //如果是组件的话 vnode 上的 type 是一个对象，如果是元素的话 type 是 string(div)
      //我们先处理组件 processComponent

      const { type, shapeFlag } = n2
      switch (type) {
         case Fragment:
            processFragment(n1, n2, container, parentComponent)
            break;
         case Text:
            processText(n1, n2, container)
            break
         default:
            if (shapeFlag & ShapeFlags.ELEMENT) {
               processElement(n1, n2, container, parentComponent)
            } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
               processComponent(n1, n2, container, parentComponent)
            }
      }
   }
   function processText(n1: any, n2: any, container: any) {
      const { children } = n2;
      const textNode = (n2.el) = document.createTextNode(children)
      container.append(textNode)
   }
   function processFragment(n1: any, n2: any, container: any, parentComponent: any) {
      mountChildren(n2.children, container, parentComponent)
   }
   function processComponent(n1: any, n2: any, container: any, parentComponent: any) {
      mountComponent(n2, container, parentComponent)
   }

   function mountComponent(initialVnode: any, container: any, parentComponent: any) {
      const instance = createComponentInstance(initialVnode, parentComponent)
      setupComponent(instance) //上面这些都是把组件的信息收集起来

      //下面的这个是开箱得到虚拟节点树
      setupRenderEffect(instance, initialVnode, container)
   }




   function setupRenderEffect(instance: any, initalVNode: any, container: any) {
      //这个 subTree 其实是一个虚拟节点树，
      /**
      * @description 描述
       相当于我们写的那个 render(){
          return h('div', 'hi,' +this.msg)
       }
      */
      effect(() => {
         if (!instance.isMounted) {
            const { proxy } = instance;
            //在执行 render 的时候使用 call指向这个 proxy
            // console.log(proxy,'proxy',instance);

            const subTree = instance.subTree = instance.render && instance.render.call(proxy)
            // vnode -> patch
            //vnode -> element -> mountElement
            patch(null, subTree, container, instance)

            //在这之后就是所有的 element 都处理好了，patch在传入 subTree 后，
            //内部也会执行到 mountElement里面会在subTree上挂载 el，el是真实节点
            //patch 是从上往下执行的，执行完后 subTree 身上的 el 就是一个完整的了得到
            initalVNode.el = subTree.el
            instance.isMounted = true
         } else {
            console.log('update');
            const { proxy } = instance;
            //在执行 render 的时候使用 call指向这个 proxy
            // console.log(proxy,'proxy',instance);

            const subTree = instance.render && instance.render.call(proxy)
            const prevSubTree = instance.subTree
            instance.subTree = subTree
            //接下来在 patch 中加入更新的流程，之前都是初始化
            patch(prevSubTree, subTree, container, instance)
         }
      })

   }

   function processElement(n1: any, n2: any, container: any, parentComponent: any) {
      //如果是元素节点那就初始化元素 mountElement(vnode, container)
      if (!n1) {
         mountElement(n2, container, parentComponent)
      } else {
         patchElement(n1, n2, container,parentComponent)
      }
   }

   function patchElement(n1: any, n2: any, container: any,parentComponent:any) {
      //处理 props
      //处理 children
      const oldProps = n1.props || EMPTY_OBJ;
      const newProps = n2.props || EMPTY_OBJ;
      const el = (n2.el = n1.el)
      patchProps(el, oldProps, newProps)
      patchChildren(n1, n2, el,parentComponent)
   }

   function patchChildren(n1: any, n2: any, container: any,parentComponent:any) {
      const prevShapeFlag = n1.shapeFlag
      const c1 = n1.children
      const { shapeFlag } = n2;
      const c2 = n2.children
      //新的是文本，老的是数组
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
         if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            //老数组清空，新的文本设置进去
            unmountChildren(n1.children)
         }

         if (c1 !== c2) {
            hostSetElementText(container, c2)
         }

      }else{
         //新的是数组，移除老的文本，挂载子节点
         if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
            hostSetElementText(container, "");
            mountChildren(c2, container, parentComponent);
          }
      }
   }
   function unmountChildren(children: any) {
      for (let i = 0; i < children.length; i++) {
         const el = children[i].el;
         hostRemove(el);
      }
   }

   function patchProps(el: any, oldProps: any, newProps: any) {
      if (oldProps !== newProps) {
         for (const key in newProps) {
            const prevProp = oldProps[key];
            const nextProp = newProps[key];

            if (prevProp !== nextProp) {
               hostPatchProp(el, key, prevProp, nextProp);
            }
         }

         if (oldProps !== EMPTY_OBJ) {
            for (const key in oldProps) {
               if (!(key in newProps)) {
                  hostPatchProp(el, key, oldProps[key], null);
               }
            }
         }
      }
   }
   function mountElement(vnode: any, container: any, parentComponent: any) {
      console.log(vnode, container, '元素类型');

      //创建挂载元素
      //将创建的真实元素存储到虚拟节点的 el上
      const el = (vnode.el = hostCreateElement(vnode.type))
      const { children, shapeFlag } = vnode
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
         el.textContent = children
      } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
         mountChildren(vnode.children, el, parentComponent)
      }

      const { props } = vnode
      for (const key in props) {
         console.log(key);
         const val = props[key];
         hostPatchProp(el, key, null, val);
         // const isOn = (key: string) => /^on[A-Z]/.test(key)
         // if (isOn(key)) {
         //    const event = key.slice(2).toLocaleLowerCase()
         //    el.addEventListener(event, props[key])
         // } else {
         //    el.setAttribute(key, props[key])
         // }

      }
      hostInsert(el, container);
   }

   function mountChildren(children: any, container: any, parentComponent: any) {
      children.forEach((v: any) => {
         patch(null, v, container, parentComponent)
      })
   }

   return {
      createApp: createAppAPI(render),
   };
}
