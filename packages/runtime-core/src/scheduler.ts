/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-18 14:59:49
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-18 15:08:36
 * @FilePath: /mini-vue-study/src/runtime-core/scheduler.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const queue: any[] = [];

const p = Promise.resolve();
let isFlushPending = false;

export function nextTick(fn: any) {
    return fn ? p.then(fn) : p;
}

export function queueJobs(job: any) {
    if (!queue.includes(job)) {
        queue.push(job);
    }

    queueFlush();
}
function queueFlush() {
    //当正在执行的时候就 return 调用，避免每次都创建 promise
    if (isFlushPending) return;
    isFlushPending = true;

    nextTick(flushJobs);
}

function flushJobs() {
    //执行微任务的时候关闭开关先
    isFlushPending = false;
    let job;
    while ((job = queue.shift())) {
        job && job();
    }
}