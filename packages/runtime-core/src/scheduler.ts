
const queue: any[] = [];
//此数组收集之前的队列
const activePreFlushCbs: any[] = [];

const p = Promise.resolve();
let isFlushPending = false;

export function nextTick(fn?) {
    return fn ? p.then(fn) : p;
}

export function queueJobs(job: any) {
    if (!queue.includes(job)) {
        queue.push(job);
    }

    queueFlush();
}
export function queuePreFlushCb(job: any) {
    activePreFlushCbs.push(job);

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
    //在执行之前，此处去调用之前的队列，针对 watcheffect 这是针对组件渲染前调用的
    flushPreFlushCbs();
    let job;
    while ((job = queue.shift())) {
        job && job();
    }
}

function flushPreFlushCbs() {
    for (let i = 0; i < activePreFlushCbs.length; i++) {
        activePreFlushCbs[i]();
    }
}