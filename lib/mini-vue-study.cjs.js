'use strict';

var Fragment = Symbol('Fragment');
var Text = Symbol('Text');
function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
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
    var slot = slots[name];
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
 * @LastEditTime: 2022-11-09 22:41:19
 * @FilePath: /mini-vue-study/src/reactivity/shared/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
var extend = Object.assign;
var isObject = function (val) {
    return val !== null && typeof val === 'object';
};
var hasChanged = function (val, newValue) {
    return !Object.is(val, newValue);
};
var hasOwn = function (val, key) { return Object.prototype.hasOwnProperty.call(val, key); };
var camelize = function (str) {
    return str.replace(/-(\w)/g, function (_, c) {
        return c ? c.toUpperCase() : "";
    });
};
var capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
var toHandlerKey = function (str) {
    return str ? "on" + capitalize(str) : '';
};

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-10-22 21:23:39
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-13 21:03:14
 * @FilePath: /mini-vue-study/src/reactivity/effect.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
var activeEffect;
var shouldTrack;
function cleanupEffect(effect) {
    effect.deps.forEach(function (dep) {
        dep.delete(effect);
    });
    effect.deps.length = 0;
}
// tdd是先写一个测试，然后让我们的代码通过，然后重构我们的代码保持可读性
var ReactiveEffect = /** @class */ (function () {
    function ReactiveEffect(fn, scheduler) {
        this.deps = [];
        this.active = true;
        this._fn = fn;
        this.scheduler = scheduler;
    }
    ReactiveEffect.prototype.run = function () {
        if (!this.active) {
            return this._fn();
        }
        shouldTrack = true;
        activeEffect = this;
        var result = this._fn();
        shouldTrack = false;
        return result;
    };
    ReactiveEffect.prototype.stop = function () {
        if (this.active) {
            cleanupEffect(this);
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    };
    return ReactiveEffect;
}());
function isTracking() {
    return shouldTrack && activeEffect !== undefined;
}
var targetMap = new Map();
function track(target, key) {
    //target -> key ->dep
    if (!isTracking())
        return;
    var depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    var dep = depsMap.get(key);
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
    var depsMap = targetMap.get(target);
    var dep = depsMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    debugger;
    // debugger
    var effects = Array.from(dep);
    effects.forEach(function (effect) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    });
}
function effect(fn, options) {
    if (options === void 0) { options = {}; }
    options.scheduler;
    var _effect = new ReactiveEffect(fn, options.scheduler);
    extend(_effect, options);
    _effect.run();
    var runner = _effect.run.bind(_effect);
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
var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
var shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly, shallow) {
    if (isReadonly === void 0) { isReadonly = false; }
    if (shallow === void 0) { shallow = false; }
    return function get(target, key) {
        if (key === "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadOnly" /* ReactiveFlags.IS_READONLY */) {
            return isReadonly;
        }
        var res = Reflect.get(target, key);
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
        var res = Reflect.set(target, key, value);
        //触发依赖
        trigger(target, key);
        return res;
    };
}
var mutableHandles = {
    get: get,
    set: set
};
var readonlHandlers = {
    get: readonlyGet,
    set: function (target, key, value) {
        console.warn("key :\"".concat(String(key), "\" set \u5931\u8D25\uFF0C\u56E0\u4E3A target \u662F readonly \u7C7B\u578B"), target);
        return true;
    }
};
var shallowReadonlHandlers = extend({}, readonlHandlers, {
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
        console.warn("target ".concat(raw, " \u5FC5\u987B\u662F\u4E00\u4E2A\u5BF9\u8C61"));
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
var RefImpl = /** @class */ (function () {
    function RefImpl(value) {
        this._value = '';
        this.dep = new Set();
        this.__v_isRef = true;
        this.rawValue = value;
        this._value = convert(value);
    }
    Object.defineProperty(RefImpl.prototype, "value", {
        get: function () {
            trackRefValue(this);
            return this._value;
        },
        set: function (newValue) {
            if (hasChanged(this.rawValue, newValue)) {
                console.log('count值改变');
                this.rawValue = newValue;
                this._value = convert(newValue);
                triggerEffects(this.dep);
            }
        },
        enumerable: false,
        configurable: true
    });
    return RefImpl;
}());
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
        get: function (target, key) {
            return unRef(Reflect.get(target, key));
        },
        set: function (target, key, value) {
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
function emit(instance, event) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    console.log('emit', event);
    var props = instance.props;
    var handlerName = toHandlerKey(camelize(event));
    var handler = props[handlerName];
    handler && handler.apply(void 0, args);
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
var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; },
    $slots: function (i) { return i.slots; }
};
var PublicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        var setupState = instance.setupState, props = instance.props;
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
        var publicGetter = publicPropertiesMap[key];
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
    var vnode = instance.vnode;
    if (vnode.shapeFlag & 16 /* ShapeFlags.SLOT_CHILDREN */) {
        normalizeObjectSlots(children, instance.slots);
    }
    else {
        instance.slots = {};
    }
}
function normalizeObjectSlots(children, slots) {
    var _loop_1 = function (key) {
        slots[key] = function (props) { return normalizeSlotValue(children[key](props)); };
    };
    for (var key in children) {
        _loop_1(key);
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
var currentInstance = null;
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
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        provides: parent ? parent.provides : {},
        parent: parent,
        isMounted: false,
        subTree: {},
        emit: function () { }
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
    var Component = instance.type;
    //在设置组件状态的时候设置一个 proxy,在 render 的时候去使用
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    var setup = Component.setup;
    if (setup) {
        setCurrentInstance(instance);
        //存在 setup 的情况下调用拿到一个结果，返回的可能是一个函数，那就是
        //render 函数，如果是一个对象，将这个对象注入到组件的上下文中
        //在调用 setUp的时候传入 prop的值
        //我们的 props 是不能改的
        var setupResult = setup(shallowReadonly(instance.props), {
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
    var Component = instance.type;
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
    var currentInstance = getCurrentInstance();
    if (currentInstance) {
        var provides = currentInstance.provides;
        //先获取到父级的 provides
        var parentProvides = currentInstance.parent.provides;
        //只需要去指向一次，所有我们判断下在初始化的时候因为会判断 parent 有值，那就拿到父级的 provides保存到自己身上，所以相等会进入判断
        if (provides === parentProvides) {
            provides = currentInstance.provides = Object.create(parentProvides); //相等的情况下，我们让父级的原型链指向子级
        }
        provides[key] = value;
    }
}
function inject(key, defaultValue) {
    //取值
    var currentInstance = getCurrentInstance();
    if (currentInstance) {
        var parentProvides = currentInstance.parent.provides;
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
            mount: function (rootContainer) {
                //先 vnode
                //component->vnode
                //所有的逻辑操作都会基于 vnode 操作
                var vnode = createVNode(rootComponent);
                render(vnode, rootContainer);
            }
        };
    };
}

//此方法可以创建一个渲染器 ,这个 options 就是传入的相关平台元素的操作方法
function createRenderer(options) {
    var hostCreateElement = options.createElement, hostPatchProp = options.patchProp, hostInsert = options.insert;
    //调用 render 的过程就是一个拆箱的过程
    function render(vnode, container, parentComponent) {
        //render内部是调用 patch 方法
        patch(null, vnode, container, parentComponent);
    }
    function patch(n1, n2, container, parentComponent) {
        //如果是组件的话 vnode 上的 type 是一个对象，如果是元素的话 type 是 string(div)
        //我们先处理组件 processComponent
        var type = n2.type, shapeFlag = n2.shapeFlag;
        switch (type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent);
                break;
            case Text:
                processText(n1, n2, container);
                break;
            default:
                debugger;
                if (shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
                    processElement(n1, n2, container, parentComponent);
                }
                else if (shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
                    processComponent(n1, n2, container, parentComponent);
                }
        }
    }
    function processText(n1, n2, container) {
        var children = n2.children;
        var textNode = (n2.el) = document.createTextNode(children);
        container.append(textNode);
    }
    function processFragment(n1, n2, container, parentComponent) {
        mountChildren(n2, container, parentComponent);
    }
    function processComponent(n1, n2, container, parentComponent) {
        mountComponent(n2, container, parentComponent);
    }
    function mountComponent(initialVnode, container, parentComponent) {
        var instance = createComponentInstance(initialVnode, parentComponent);
        setupComponent(instance); //上面这些都是把组件的信息收集起来
        //下面的这个是开箱得到虚拟节点树
        setupRenderEffect(instance, initialVnode, container);
    }
    function setupRenderEffect(instance, initalVNode, container) {
        //这个 subTree 其实是一个虚拟节点树，
        /**
        * @description 描述
         相当于我们写的那个 render(){
            return h('div', 'hi,' +this.msg)
         }
        */
        effect(function () {
            if (!instance.isMounted) {
                var proxy = instance.proxy;
                //在执行 render 的时候使用 call指向这个 proxy
                // console.log(proxy,'proxy',instance);
                var subTree = instance.subTree = instance.render && instance.render.call(proxy);
                // vnode -> patch
                //vnode -> element -> mountElement
                patch(null, subTree, container, instance);
                //在这之后就是所有的 element 都处理好了，patch在传入 subTree 后，
                //内部也会执行到 mountElement里面会在subTree上挂载 el，el是真实节点
                //patch 是从上往下执行的，执行完后 subTree 身上的 el 就是一个完整的了得到
                initalVNode.el = subTree.el;
                instance.isMounted = true;
            }
            else {
                console.log('update');
                var proxy = instance.proxy;
                //在执行 render 的时候使用 call指向这个 proxy
                // console.log(proxy,'proxy',instance);
                var subTree = instance.render && instance.render.call(proxy);
                var prevSubTree = instance.subTree;
                instance.subTree = subTree;
                //接下来在 patch 中加入更新的流程，之前都是初始化
                patch(prevSubTree, subTree, container, instance);
            }
        });
    }
    function processElement(n1, n2, container, parentComponent) {
        //如果是元素节点那就初始化元素 mountElement(vnode, container)
        if (!n1) {
            mountElement(n2, container, parentComponent);
        }
    }
    function mountElement(vnode, container, parentComponent) {
        console.log(vnode, container, '元素类型');
        //创建挂载元素
        //将创建的真实元素存储到虚拟节点的 el上
        var el = (vnode.el = hostCreateElement(vnode.type));
        var children = vnode.children, shapeFlag = vnode.shapeFlag;
        if (shapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
            el.textContent = children;
        }
        else if (shapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
            mountChildren(vnode, el, parentComponent);
        }
        var props = vnode.props;
        for (var key in props) {
            console.log(key);
            var val = props[key];
            hostPatchProp(el, key, val);
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
    function mountChildren(vnode, container, parentComponent) {
        vnode.children.forEach(function (v) {
            patch(null, v, container, parentComponent);
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
 * @LastEditTime: 2022-11-12 17:47:36
 * @FilePath: /mini-vue-study/src/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function createElement(type) {
    return document.createElement(type);
}
function patchProp(el, key, val) {
    var isOn = function (key) { return /^on[A-Z]/.test(key); };
    if (isOn(key)) {
        var event_1 = key.slice(2).toLowerCase();
        el.addEventListener(event_1, val);
    }
    else {
        el.setAttribute(key, val);
    }
}
function insert(el, parent) {
    parent.append(el);
}
var renderer = createRenderer({
    createElement: createElement,
    patchProp: patchProp,
    insert: insert,
});
function createApp() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return renderer.createApp.apply(renderer, args);
}

exports.createApp = createApp;
exports.createRenderer = createRenderer;
exports.createTextVNode = createTextVNode;
exports.getCurrentInstance = getCurrentInstance;
exports.h = h;
exports.inject = inject;
exports.provide = provide;
exports.proxyRefs = proxyRefs;
exports.ref = ref;
exports.renderSlots = renderSlots;
