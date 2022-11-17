import { effect } from '../reactivity/effect';
import { ShapeFlags } from '../reactivity/shared/ShapeFlags';
import { EMPTY_OBJ, isObject } from './../reactivity/shared/index';

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 10:19:35
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-17 11:18:26
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
      patch(null, vnode, container, parentComponent, null)
   }



   function patch(n1: any, n2: any, container: any, parentComponent: any, anchor: any) {

      //如果是组件的话 vnode 上的 type 是一个对象，如果是元素的话 type 是 string(div)
      //我们先处理组件 processComponent

      const { type, shapeFlag } = n2
      switch (type) {
         case Fragment:
            processFragment(n1, n2, container, parentComponent, anchor)
            break;
         case Text:
            processText(n1, n2, container)
            break
         default:
            if (shapeFlag & ShapeFlags.ELEMENT) {
               processElement(n1, n2, container, parentComponent, anchor)
            } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
               processComponent(n1, n2, container, parentComponent, anchor)
            }
      }
   }
   function processText(n1: any, n2: any, container: any) {
      const { children } = n2;
      const textNode = (n2.el) = document.createTextNode(children)
      container.append(textNode)
   }
   function processFragment(n1: any, n2: any, container: any, parentComponent: any, anchor: any) {
      mountChildren(n2.children, container, parentComponent, anchor)
   }
   function processComponent(n1: any, n2: any, container: any, parentComponent: any, anchor: any) {
      mountComponent(n2, container, parentComponent, anchor)
   }

   function mountComponent(initialVnode: any, container: any, parentComponent: any, anchor: any) {
      const instance = createComponentInstance(initialVnode, parentComponent)
      setupComponent(instance) //上面这些都是把组件的信息收集起来

      //下面的这个是开箱得到虚拟节点树
      setupRenderEffect(instance, initialVnode, container, anchor)
   }




   function setupRenderEffect(instance: any, initalVNode: any, container: any, anchor: any) {
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
            patch(null, subTree, container, instance, anchor)

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
            patch(prevSubTree, subTree, container, instance, anchor)
         }
      })

   }

   function processElement(n1: any, n2: any, container: any, parentComponent: any, anchor: any) {
      //如果是元素节点那就初始化元素 mountElement(vnode, container)
      if (!n1) {
         mountElement(n2, container, parentComponent, anchor)
      } else {
         patchElement(n1, n2, container, parentComponent, anchor)
      }
   }

   function patchElement(n1: any, n2: any, container: any, parentComponent: any, anchor: any) {
      //处理 props
      //处理 children
      const oldProps = n1.props || EMPTY_OBJ;
      const newProps = n2.props || EMPTY_OBJ;
      const el = (n2.el = n1.el)
      patchProps(el, oldProps, newProps)
      patchChildren(n1, n2, el, parentComponent, anchor)
   }

   function patchChildren(n1: any, n2: any, container: any, parentComponent: any, anchor: any) {
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

      } else {
         //新的是数组，移除老的文本，挂载子节点
         if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
            hostSetElementText(container, "");
            mountChildren(c2, container, parentComponent, anchor);
         } else {
            //数组和数组比较
            // array diff array
            patchKeyedChildren(c1, c2, container, parentComponent, anchor);
         }
      }
   }

   function patchKeyedChildren(
      c1: any,
      c2: any,
      container: any,
      parentComponent: any,
      parentAnchor: any
   ) {
      const l2 = c2.length;
      let i = 0;
      let e1 = c1.length - 1;
      let e2 = l2 - 1;

      function isSomeVNodeType(n1: any, n2: any) {
         return n1.type === n2.type && n1.props.key === n2.props.key;
      }

      while (i <= e1 && i <= e2) {
         const n1 = c1[i];
         const n2 = c2[i];

         if (isSomeVNodeType(n1, n2)) {
            patch(n1, n2, container, parentComponent, parentAnchor);
         } else {
            break;
         }

         i++;
      }

      while (i <= e1 && i <= e2) {
         const n1 = c1[e1];
         const n2 = c2[e2];

         if (isSomeVNodeType(n1, n2)) {
            patch(n1, n2, container, parentComponent, parentAnchor);
         } else {
            break;
         }

         e1--;
         e2--;
      }

      if (i > e1) {
         if (i <= e2) {
            const nextPos = e2 + 1;
            const anchor = nextPos < l2 ? c2[nextPos].el : null;
            while (i <= e2) {
               patch(null, c2[i], container, parentComponent, anchor);
               i++;
            }
         }
      } else if (i > e2) {
         while (i <= e1) {
            hostRemove(c1[i].el);
            i++;
         }
      } else {
         // 中间对比
         let s1 = i;
         let s2 = i;

         const toBePatched = e2 - s2 + 1;
         let patched = 0;
         const keyToNewIndexMap = new Map();

         const newIndexToOldIndexMap = new Array(toBePatched);
         let moved = false;
         let maxNewIndexSoFar = 0;
         for (let i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;

         for (let i = s2; i <= e2; i++) {
            const nextChild = c2[i];
            keyToNewIndexMap.set(nextChild.key, i);
         }

         for (let i = s1; i <= e1; i++) {
            const prevChild = c1[i];

            if (patched >= toBePatched) {
               hostRemove(prevChild.el);
               continue;
            }

            let newIndex;
            if (prevChild.key != null) {
               newIndex = keyToNewIndexMap.get(prevChild.key);
            } else {
               for (let j = s2; j < e2; j++) {
                  if (isSomeVNodeType(prevChild, c2[j])) {
                     newIndex = j;

                     break;
                  }
               }
            }

            if (newIndex === undefined) {
               hostRemove(prevChild.el);
            } else {
               if (newIndex >= maxNewIndexSoFar) {
                  maxNewIndexSoFar = newIndex;
               } else {
                  moved = true;
               }
               //有映射的情况我们就将下标放进去，但是可能有 0 的情况，没有意义，加 1
               newIndexToOldIndexMap[newIndex - s2] = i + 1;
               console.log(newIndexToOldIndexMap, 'newIndexToOldIndexMap');

               patch(prevChild, c2[newIndex], container, parentComponent, null);
               patched++;
            }
         }

         const increasingNewIndexSequence = moved
            ? getSequence(newIndexToOldIndexMap)
            : [];
         let j = increasingNewIndexSequence.length - 1;

         for (let i = toBePatched - 1; i >= 0; i--) {
            const nextIndex = i + s2;
            const nextChild = c2[nextIndex];
            const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null;

            if (newIndexToOldIndexMap[i] === 0) {
               patch(null, nextChild, container, parentComponent, anchor);
            } else if (moved) {
               if (j < 0 || i !== increasingNewIndexSequence[j]) {
                  hostInsert(nextChild.el, container, anchor);
               } else {
                  j--;
               }
            }
         }
      }
   }
   function getSequence(arr: any) {
      const p = arr.slice();
      const result = [0];
      let i, j, u, v, c;
      const len = arr.length;
      for (i = 0; i < len; i++) {
         const arrI = arr[i];
         if (arrI !== 0) {
            j = result[result.length - 1];
            if (arr[j] < arrI) {
               p[i] = j;
               result.push(i);
               continue;
            }
            u = 0;
            v = result.length - 1;
            while (u < v) {
               c = (u + v) >> 1;
               if (arr[result[c]] < arrI) {
                  u = c + 1;
               } else {
                  v = c;
               }
            }
            if (arrI < arr[result[u]]) {
               if (u > 0) {
                  p[i] = result[u - 1];
               }
               result[u] = i;
            }
         }
      }
      u = result.length;
      v = result[u - 1];
      while (u-- > 0) {
         result[u] = v;
         v = p[v];
      }
      return result;
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
   function mountElement(vnode: any, container: any, parentComponent: any, anchor: any) {
      console.log(vnode, container, '元素类型');

      //创建挂载元素
      //将创建的真实元素存储到虚拟节点的 el上
      const el = (vnode.el = hostCreateElement(vnode.type))
      const { children, shapeFlag } = vnode
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
         el.textContent = children
      } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
         mountChildren(vnode.children, el, parentComponent, anchor)
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
      hostInsert(el, container, anchor);
   }

   function mountChildren(children: any, container: any, parentComponent: any, anchor: any) {
      children.forEach((v: any) => {
         patch(null, v, container, parentComponent, anchor)
      })
   }

   return {
      createApp: createAppAPI(render),
   };
}
