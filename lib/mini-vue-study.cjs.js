'use strict';

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 10:14:31
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-03 15:21:43
 * @FilePath: /mini-vue-study/src/runtime-core/vnode.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
    };
    return vnode;
}

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 10:33:09
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-03 15:59:40
 * @FilePath: /mini-vue-study/src/runtime-core/component.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type
    };
    return component;
}
function setupComponent(instance) {
    // initProps()
    //initSolts()
    setupStatefulComponent(instance);
}
//调用 setup 拿到对应的返回值
function setupStatefulComponent(instance) {
    const Component = instance.type;
    const { setup } = Component;
    if (setup) {
        //存在 setup 的情况下调用拿到一个结果，返回的可能是一个函数，那就是
        //render 函数，如果是一个对象，将这个对象注入到组件的上下文中
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    //保证存在 render
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    // if(Component.render){
    instance.render = Component.render;
    // }
}

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 10:19:35
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-03 16:08:19
 * @FilePath: /mini-vue-study/src/runtime-core/renderer.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//调用 render 的过程就是一个拆箱的过程
function render(vnode, container) {
    //render内部是调用 patch 方法
    patch(vnode);
}
function patch(vnode, container) {
    // processElement()
    //我们先处理组件 processComponent
    processComponent(vnode);
}
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance); //上面这些都是把组件的信息收集起来
    //下面的这个是开箱得到虚拟节点树
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    //这个 subTree 其实是一个虚拟节点树，
    /**
    * @description 描述
     相当于我们写的那个 render(){
        return h('div', 'hi,' +this.msg)
     }
    */
    const subTree = instance.render();
    // vnode -> patch
    //vnode -> element -> mountElement
    patch(subTree);
}

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 10:06:04
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-03 15:36:13
 * @FilePath: /mini-vue-study/src/runtime-core/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            //先 vnode
            //component->vnode
            //所有的逻辑操作都会基于 vnode 操作
            const vnode = createVNode(rootComponent);
            render(vnode);
        }
    };
}

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 15:40:21
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-03 15:42:57
 * @FilePath: /mini-vue-study/src/runtime-core/h.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
