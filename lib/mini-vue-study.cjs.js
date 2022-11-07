'use strict';

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        shapeFlag: getShapeFlag(type),
        el: null
    };
    if (typeof children == 'string') {
        // vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN
        vnode.shapeFlag |= 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === 'string' ? 1 /* ShapeFlags.ELEMENT */ : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-05 23:02:08
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-05 23:09:25
 * @FilePath: /mini-vue-study/src/runtime-core/componentPublicInstance.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const publicPropertiesMap = {
    $el: (i) => i.vnode.el
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        //key ->$el
        // if (key == '$el') {
        //     return instance.vnode.el
        // }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 10:33:09
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-05 23:10:10
 * @FilePath: /mini-vue-study/src/runtime-core/component.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {}
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
    //在设置组件状态的时候设置一个 proxy,在 render 的时候去使用
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
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
 * @LastEditTime: 2022-11-07 14:52:50
 * @FilePath: /mini-vue-study/src/runtime-core/renderer.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//调用 render 的过程就是一个拆箱的过程
function render(vnode, container) {
    //render内部是调用 patch 方法
    patch(vnode, container);
}
function patch(vnode, container) {
    console.log(typeof vnode.type, container, '处理 patch');
    //如果是组件的话 vnode 上的 type 是一个对象，如果是元素的话 type 是 string(div)
    //我们先处理组件 processComponent
    const { shapeFlag } = vnode;
    if (shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
        processElement(vnode, container);
    }
    else if (shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        processComponent(vnode, container);
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(initialVnode, container) {
    const instance = createComponentInstance(initialVnode);
    setupComponent(instance); //上面这些都是把组件的信息收集起来
    //下面的这个是开箱得到虚拟节点树
    setupRenderEffect(instance, initialVnode, container);
}
function setupRenderEffect(instance, vnode, container) {
    //这个 subTree 其实是一个虚拟节点树，
    /**
    * @description 描述
     相当于我们写的那个 render(){
        return h('div', 'hi,' +this.msg)
     }
    */
    const { proxy } = instance;
    //在执行 render 的时候使用 call指向这个 proxy
    const subTree = instance.render.call(proxy);
    // vnode -> patch
    //vnode -> element -> mountElement
    patch(subTree, container);
    //在这之后就是所有的 element 都处理好了，patch在传入 subTree 后，
    //内部也会执行到 mountElement里面会在subTree上挂载 el，el是真实节点
    //patch 是从上往下执行的，执行完后 subTree 身上的 el 就是一个完整的了得到
    vnode.el = subTree.el;
}
function processElement(vnode, container) {
    //如果是元素节点那就初始化元素 mountElement(vnode, container)
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    console.log(vnode, container, '元素类型');
    //创建挂载元素
    //将创建的真实元素存储到虚拟节点的 el上
    const el = (vnode.el = document.createElement(vnode.type));
    const { children, shapeFlag } = vnode;
    if (shapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
        mountChildren(vnode, el);
    }
    const { props } = vnode;
    for (const key in props) {
        console.log(key);
        const isOn = (key) => /^on[A-Z]/.test(key);
        if (isOn(key)) {
            const event = key.slice(2).toLocaleLowerCase();
            el.addEventListener(event, props[key]);
        }
        else {
            el.setAttribute(key, props[key]);
        }
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
