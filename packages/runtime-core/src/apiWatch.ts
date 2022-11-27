import { ReactiveEffect } from "../../reactivity/src/effect";
import { queuePreFlushCb } from "./scheduler";

export function watchEffect(source: any) {
    //默认在组件渲染之前执行
    function job() {
        effect.run();
    }

    let cleanup: any;
    const onCleanup = function (fn: any) {
        cleanup = effect.onStop = () => {
            fn();
        };
    };

    function getter() {
        if (cleanup) {
            cleanup();
        }

        source(onCleanup);
    }

    //创建 effect，第一个参数是传入的 fn，第二个参数相当于是 scheduler
    const effect = new ReactiveEffect(getter, () => {
        queuePreFlushCb(job);
    });

    effect.run();

    return () => {
        effect.stop();
    };
}