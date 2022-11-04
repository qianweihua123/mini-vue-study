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
 * @Date: 2022-10-30 20:40:52
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-01 14:48:58
 * @FilePath: /mini-vue-study/src/reactivity/shared/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const isObject = (val) => {
    return val !== null && typeof val === 'object';
};

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

//调用 render 的过程就是一个拆箱的过程
function render(vnode, container) {
    //render内部是调用 patch 方法
    patch(vnode, container);
}
function patch(vnode, container) {
    console.log(typeof vnode.type, container, '处理 patch');
    //如果是组件的话 vnode 上的 type 是一个对象，如果是元素的话 type 是 string(div)
    //我们先处理组件 processComponent
    if (typeof vnode.type === 'string') {
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance); //上面这些都是把组件的信息收集起来
    //下面的这个是开箱得到虚拟节点树
    setupRenderEffect(instance, container);
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
    patch(subTree, container);
}
function processElement(vnode, container) {
    //如果是元素节点那就初始化元素 mountElement(vnode, container)
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    console.log(vnode, container, '元素类型');
    //创建挂载元素
    const el = document.createElement(vnode.type);
    const { children } = vnode;
    if (typeof children === 'string') {
        el.textContent = children;
    }
    else {
        mountChildren(vnode, el);
    }
    const { props } = vnode;
    for (const key in props) {
        el.setAttribute(key, props[key]);
    }
    container.appendChild(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach((v) => {
        patch(v, container);
    });
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
            render(vnode, rootContainer);
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
