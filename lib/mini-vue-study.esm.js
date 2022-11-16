const Fragment = Symbol('Fragment');
const Text = Symbol('Text');
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
    if (vnode.shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        if (typeof children === "object") {
            vnode.shapeFlag |= 16 /* ShapeFlags.SLOT_CHILDREN */;
        }
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === 'string' ? 1 /* ShapeFlags.ELEMENT */ : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}
//text
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 15:40:21
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-09 23:04:10
 * @FilePath: /mini-vue-study/src/runtime-core/h.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function h(type, props, children) {
    return createVNode(type, props, children);
}

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-10 14:52:21
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-10 17:25:35
 * @FilePath: /mini-vue-study/src/runtime-core/helper/renderSlots.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function renderSlots(slots, name, props) {
    console.log(slots, 'slots');
    const slot = slots[name];
    if (slot) {
        if (typeof slot === 'function') {
            return createVNode(Fragment, {}, slot(props));
        }
    }
}

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-10-30 20:40:52
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-14 16:35:53
 * @FilePath: /mini-vue-study/src/reactivity/shared/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const extend = Object.assign;
const isObject = (val) => {
    return val !== null && typeof val === 'object';
};
const hasChanged = (val, newValue) => {
    return !Object.is(val, newValue);
};
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
const camelize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : "";
    });
};
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
const toHandlerKey = (str) => {
    return str ? "on" + capitalize(str) : '';
};
const EMPTY_OBJ = {};

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-10-22 21:23:39
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-15 14:48:27
 * @FilePath: /mini-vue-study/src/reactivity/effect.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
let activeEffect;
let shouldTrack;
function cleanupEffect(effect) {
    effect.deps.forEach((dep) => {
        dep.delete(effect);
    });
    effect.deps.length = 0;
}
// tdd是先写一个测试，然后让我们的代码通过，然后重构我们的代码保持可读性
class ReactiveEffect {
    constructor(fn, scheduler) {
        this.deps = [];
        this.active = true;
        this._fn = fn;
        this.scheduler = scheduler;
    }
    run() {
        if (!this.active) {
            return this._fn();
        }
        shouldTrack = true;
        activeEffect = this;
        const result = this._fn();
        shouldTrack = false;
        return result;
    }
    stop() {
        if (this.active) {
            cleanupEffect(this);
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    }
}
function isTracking() {
    return shouldTrack && activeEffect !== undefined;
}
let targetMap = new Map();
function track(target, key) {
    //target -> key ->dep
    if (!isTracking())
        return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    trackEffect(dep);
}
function trackEffect(dep) {
    if (dep.has(activeEffect))
        return;
    dep.add(activeEffect);
    activeEffect === null || activeEffect === void 0 ? void 0 : activeEffect.deps.push(dep);
}
function trigger(target, key) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    const effects = Array.from(dep);
    effects.forEach((effect) => {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    });
}
function effect(fn, options = {}) {
    options.scheduler;
    const _effect = new ReactiveEffect(fn, options.scheduler);
    extend(_effect, options);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-10-31 12:06:27
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-01 14:13:17
 * @FilePath: /mini-vue-study/src/reactivity/baseHandlers.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {
        if (key === "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadOnly" /* ReactiveFlags.IS_READONLY */) {
            return isReadonly;
        }
        const res = Reflect.get(target, key);
        if (shallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        //依赖收集
        if (!isReadonly) {
            track(target, key);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);
        //触发依赖
        trigger(target, key);
        return res;
    };
}
const mutableHandles = {
    get,
    set
};
const readonlHandlers = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`key :"${String(key)}" set 失败，因为 target 是 readonly 类型`, target);
        return true;
    }
};
const shallowReadonlHandlers = extend({}, readonlHandlers, {
    get: shallowReadonlyGet
});

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-10-22 21:14:14
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-07 16:36:10
 * @FilePath: /mini-vue-study/src/reactivity/reactive.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function reactive(raw) {
    return createActiveObject(raw, mutableHandles);
}
function readonly(raw) {
    return createActiveObject(raw, readonlHandlers);
}
function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlHandlers);
}
function createActiveObject(raw, baseHandlers) {
    if (!isObject(raw)) {
        console.warn(`target ${raw} 必须是一个对象`);
        return raw;
    }
    return new Proxy(raw, baseHandlers);
}

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-01 14:29:54
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-13 20:47:34
 * @FilePath: /mini-vue-study/src/reactivity/ref.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
class RefImpl {
    constructor(value) {
        this._value = '';
        this.dep = new Set();
        this.__v_isRef = true;
        this.rawValue = value;
        this._value = convert(value);
    }
    get value() {
        trackRefValue(this);
        return this._value;
    }
    set value(newValue) {
        if (hasChanged(this.rawValue, newValue)) {
            console.log('count值改变');
            this.rawValue = newValue;
            this._value = convert(newValue);
            triggerEffects(this.dep);
        }
    }
}
function trackRefValue(ref) {
    if (isTracking()) {
        trackEffect(ref.dep);
    }
}
function convert(value) {
    return isObject(value) ? reactive(value) : value;
}
function ref(value) {
    return new RefImpl(value);
}
function isRef(ref) {
    return !!ref['__v_isRef'];
}
function unRef(ref) {
    return isRef(ref) ? ref.value : ref;
}
function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs, {
        get(target, key) {
            return unRef(Reflect.get(target, key));
        },
        set(target, key, value) {
            //原值是 ref，新值不是,那就给到它的.value.其他的直接赋值
            if (isRef(target[key]) && !isRef(value)) {
                return target[key].value = value;
            }
            else {
                return Reflect.set(target, key, value);
            }
        }
    });
}

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-09 22:18:42
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-09 22:41:47
 * @FilePath: /mini-vue-study/src/runtime-core/componentEmit.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function emit(instance, event, ...args) {
    console.log('emit', event);
    const { props } = instance;
    const handlerName = toHandlerKey(camelize(event));
    const handler = props[handlerName];
    handler && handler(...args);
}

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-07 15:32:38
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-07 16:28:05
 * @FilePath: /mini-vue-study/src/runtime-core/componentProps.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-05 23:02:08
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-10 11:48:38
 * @FilePath: /mini-vue-study/src/runtime-core/componentPublicInstance.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState, props } = instance;
        console.log(setupState, props, 'setupState, props');
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
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
 * @Date: 2022-11-10 11:50:02
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-10 16:14:21
 * @FilePath: /mini-vue-study/src/runtime-core/componentSlots.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function initSolts(instance, children) {
    // instance.slots = Array.isArray(children) ? children : [children]
    const { vnode } = instance;
    if (vnode.shapeFlag & 16 /* ShapeFlags.SLOT_CHILDREN */) {
        normalizeObjectSlots(children, instance.slots);
    }
    else {
        instance.slots = {};
    }
}
function normalizeObjectSlots(children, slots) {
    for (const key in children) {
        slots[key] = (props) => normalizeSlotValue(children[key](props));
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 10:33:09
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-13 21:23:11
 * @FilePath: /mini-vue-study/src/runtime-core/component.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
let currentInstance = null;
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}
/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 10:33:09
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-10 15:42:24
 * @FilePath: /mini-vue-study/src/runtime-core/component.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function createComponentInstance(vnode, parent) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        provides: parent ? parent.provides : {},
        parent,
        isMounted: false,
        subTree: {},
        emit: () => { }
    };
    // TODO:给 emit 去赋值
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    initProps(instance, instance.vnode.props);
    initSolts(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}
//调用 setup 拿到对应的返回值
function setupStatefulComponent(instance) {
    const Component = instance.type;
    //在设置组件状态的时候设置一个 proxy,在 render 的时候去使用
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    const { setup } = Component;
    if (setup) {
        setCurrentInstance(instance);
        //存在 setup 的情况下调用拿到一个结果，返回的可能是一个函数，那就是
        //render 函数，如果是一个对象，将这个对象注入到组件的上下文中
        //在调用 setUp的时候传入 prop的值
        //我们的 props 是不能改的
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        setCurrentInstance(null);
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = proxyRefs(setupResult);
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
 * @Date: 2022-11-11 22:40:01
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-11 23:27:21
 * @FilePath: /mini-vue-study/src/runtime-core/apiInject.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function provide(key, value) {
    //存值
    let currentInstance = getCurrentInstance();
    if (currentInstance) {
        let { provides } = currentInstance;
        //先获取到父级的 provides
        const parentProvides = currentInstance.parent.provides;
        //只需要去指向一次，所有我们判断下在初始化的时候因为会判断 parent 有值，那就拿到父级的 provides保存到自己身上，所以相等会进入判断
        if (provides === parentProvides) {
            provides = currentInstance.provides = Object.create(parentProvides); //相等的情况下，我们让父级的原型链指向子级
        }
        provides[key] = value;
    }
}
function inject(key, defaultValue) {
    //取值
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        const parentProvides = currentInstance.parent.provides;
        if (key in parentProvides) {
            return parentProvides[key];
        }
        else if (defaultValue) { //支持 inject的时候给到默认值，支持函数返回值的形式和直接值的形式
            if (typeof defaultValue === "function") {
                return defaultValue();
            }
            return defaultValue;
        }
    }
}

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 10:06:04
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-12 17:08:01
 * @FilePath: /mini-vue-study/src/runtime-core/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//这儿的 render从外部传入
function createAppAPI(render) {
    return function createApp(rootComponent) {
        return {
            mount(rootContainer) {
                //先 vnode
                //component->vnode
                //所有的逻辑操作都会基于 vnode 操作
                const vnode = createVNode(rootComponent);
                render(vnode, rootContainer);
            }
        };
    };
}

//此方法可以创建一个渲染器 ,这个 options 就是传入的相关平台元素的操作方法
function createRenderer(options) {
    const { createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert, remove: hostRemove, setElementText: hostSetElementText, } = options;
    //调用 render 的过程就是一个拆箱的过程
    function render(vnode, container, parentComponent) {
        //render内部是调用 patch 方法
        patch(null, vnode, container, parentComponent, null);
    }
    function patch(n1, n2, container, parentComponent, anchor) {
        //如果是组件的话 vnode 上的 type 是一个对象，如果是元素的话 type 是 string(div)
        //我们先处理组件 processComponent
        const { type, shapeFlag } = n2;
        switch (type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent, anchor);
                break;
            case Text:
                processText(n1, n2, container);
                break;
            default:
                if (shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
                    processElement(n1, n2, container, parentComponent, anchor);
                }
                else if (shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
                    processComponent(n1, n2, container, parentComponent, anchor);
                }
        }
    }
    function processText(n1, n2, container) {
        const { children } = n2;
        const textNode = (n2.el) = document.createTextNode(children);
        container.append(textNode);
    }
    function processFragment(n1, n2, container, parentComponent, anchor) {
        mountChildren(n2.children, container, parentComponent, anchor);
    }
    function processComponent(n1, n2, container, parentComponent, anchor) {
        mountComponent(n2, container, parentComponent, anchor);
    }
    function mountComponent(initialVnode, container, parentComponent, anchor) {
        const instance = createComponentInstance(initialVnode, parentComponent);
        setupComponent(instance); //上面这些都是把组件的信息收集起来
        //下面的这个是开箱得到虚拟节点树
        setupRenderEffect(instance, initialVnode, container, anchor);
    }
    function setupRenderEffect(instance, initalVNode, container, anchor) {
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
                const subTree = instance.subTree = instance.render && instance.render.call(proxy);
                // vnode -> patch
                //vnode -> element -> mountElement
                patch(null, subTree, container, instance, anchor);
                //在这之后就是所有的 element 都处理好了，patch在传入 subTree 后，
                //内部也会执行到 mountElement里面会在subTree上挂载 el，el是真实节点
                //patch 是从上往下执行的，执行完后 subTree 身上的 el 就是一个完整的了得到
                initalVNode.el = subTree.el;
                instance.isMounted = true;
            }
            else {
                console.log('update');
                const { proxy } = instance;
                //在执行 render 的时候使用 call指向这个 proxy
                // console.log(proxy,'proxy',instance);
                const subTree = instance.render && instance.render.call(proxy);
                const prevSubTree = instance.subTree;
                instance.subTree = subTree;
                //接下来在 patch 中加入更新的流程，之前都是初始化
                patch(prevSubTree, subTree, container, instance, anchor);
            }
        });
    }
    function processElement(n1, n2, container, parentComponent, anchor) {
        //如果是元素节点那就初始化元素 mountElement(vnode, container)
        if (!n1) {
            mountElement(n2, container, parentComponent, anchor);
        }
        else {
            patchElement(n1, n2, container, parentComponent, anchor);
        }
    }
    function patchElement(n1, n2, container, parentComponent, anchor) {
        //处理 props
        //处理 children
        const oldProps = n1.props || EMPTY_OBJ;
        const newProps = n2.props || EMPTY_OBJ;
        const el = (n2.el = n1.el);
        patchProps(el, oldProps, newProps);
        patchChildren(n1, n2, el, parentComponent, anchor);
    }
    function patchChildren(n1, n2, container, parentComponent, anchor) {
        const prevShapeFlag = n1.shapeFlag;
        const c1 = n1.children;
        const { shapeFlag } = n2;
        const c2 = n2.children;
        //新的是文本，老的是数组
        if (shapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
            if (prevShapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
                //老数组清空，新的文本设置进去
                unmountChildren(n1.children);
            }
            if (c1 !== c2) {
                hostSetElementText(container, c2);
            }
        }
        else {
            //新的是数组，移除老的文本，挂载子节点
            if (prevShapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
                hostSetElementText(container, "");
                mountChildren(c2, container, parentComponent, anchor);
            }
            else {
                //数组和数组比较
                // array diff array
                patchKeyedChildren(c1, c2, container, parentComponent, anchor);
            }
        }
    }
    function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
        const l2 = c2.length;
        let i = 0;
        let e1 = c1.length - 1;
        let e2 = l2 - 1;
        function isSomeVNodeType(n1, n2) {
            return n1.type === n2.type && n1.key === n2.key;
        }
        while (i <= e1 && i <= e2) {
            const n1 = c1[i];
            const n2 = c2[i];
            if (isSomeVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor);
            }
            else {
                break;
            }
            i++;
        }
        while (i <= e1 && i <= e2) {
            const n1 = c1[e1];
            const n2 = c2[e2];
            if (isSomeVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor);
            }
            else {
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
        }
        else if (i > e2) {
            while (i <= e1) {
                hostRemove(c1[i].el);
                i++;
            }
        }
        else ;
    }
    function unmountChildren(children) {
        for (let i = 0; i < children.length; i++) {
            const el = children[i].el;
            hostRemove(el);
        }
    }
    function patchProps(el, oldProps, newProps) {
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
    function mountElement(vnode, container, parentComponent, anchor) {
        console.log(vnode, container, '元素类型');
        //创建挂载元素
        //将创建的真实元素存储到虚拟节点的 el上
        const el = (vnode.el = hostCreateElement(vnode.type));
        const { children, shapeFlag } = vnode;
        if (shapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
            el.textContent = children;
        }
        else if (shapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
            mountChildren(vnode.children, el, parentComponent, anchor);
        }
        const { props } = vnode;
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
    function mountChildren(children, container, parentComponent, anchor) {
        children.forEach((v) => {
            patch(null, v, container, parentComponent, anchor);
        });
    }
    return {
        createApp: createAppAPI(render),
    };
}

/*
 * @Author: qwh 15806293089@163.com1
 * @Date: 2022-11-03 15:06:29
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-16 15:37:44
 * @FilePath: /mini-vue-study/src/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function createElement(type) {
    return document.createElement(type);
}
function patchProp(el, key, prevVal, nextVal) {
    const isOn = (key) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, nextVal);
    }
    else {
        if (nextVal === undefined || nextVal === null) {
            el.removeAttribute(key);
        }
        else {
            el.setAttribute(key, nextVal);
        }
    }
}
function remove(child) {
    const parent = child.parentNode;
    if (parent) {
        parent.removeChild(child);
    }
}
function setElementText(el, text) {
    el.textContent = text;
}
function insert(child, parent, anchor) {
    parent.insertBefore(child, anchor || null);
}
const renderer = createRenderer({
    createElement,
    patchProp,
    insert,
    remove,
    setElementText,
});
function createApp(...args) {
    return renderer.createApp(...args);
}

export { createApp, createRenderer, createTextVNode, getCurrentInstance, h, inject, provide, proxyRefs, ref, renderSlots };
