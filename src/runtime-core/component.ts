import { shallowReadonly } from "../reactivity/reactive"
import { initProps } from "./componentProps"
import { PublicInstanceProxyHandlers } from "./componentPublicInstance"

/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-03 10:33:09
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-07 16:32:12
 * @FilePath: /mini-vue-study/src/runtime-core/component.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export function createComponentInstance(vnode: any) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props:{}
    }
    return component
}

export function setupComponent(instance: any) {
    initProps(instance, instance.vnode.props)
    //initSolts()
    setupStatefulComponent(instance)
}
//调用 setup 拿到对应的返回值
function setupStatefulComponent(instance: any) {
    const Component = instance.type
    //在设置组件状态的时候设置一个 proxy,在 render 的时候去使用
    instance.proxy = new Proxy({ _: instance },
        PublicInstanceProxyHandlers
    )
    const { setup } = Component
    if (setup) {
        //存在 setup 的情况下调用拿到一个结果，返回的可能是一个函数，那就是
        //render 函数，如果是一个对象，将这个对象注入到组件的上下文中
        //在调用 setUp的时候传入 prop的值
        //我们的 props 是不能改的
        const setupResult = setup(shallowReadonly(instance.props))
        handleSetupResult(instance, setupResult)
    }
}
function handleSetupResult(instance: any, setupResult: any) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult
    }
    //保证存在 render
    finishComponentSetup(instance)
}


function finishComponentSetup(instance: any) {
    const Component = instance.type
    // if(Component.render){
    instance.render = Component.render
    // }
}
