/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-10-22 21:03:53
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-10-25 15:23:44
 * @FilePath: /mini-vue-study/src/reactivity/tests/effect.spec.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { reactive } from '../reactive'
import { effect } from '../effect'
describe('effect', () => {
    it('happy path', () => {
        const user = reactive({
            age: 10
        })

        let nextAge;
        effect(() => {
            nextAge = user.age + 1
        })
        expect(nextAge).toBe(11)

        //update
        user.age++
        expect(nextAge).toBe(12)
    })

    it('should return runner when call effect', () => {
        //effect（fn） -> 返回function->调用fn ->return 拿到返回值
        let foo = 10
        const runner = effect(() => {
            foo++
            return 'foo'
        })
        expect(foo).toBe(11);
        const r = runner();
        expect(foo).toBe(12)
        expect(r).toBe('foo')
    })

    it("scheduler", () => {
        //1. 通过 effect 的第二个参数给定的 一个 scheduler 的 fn
        // 2. effect 第一次执行的时候 还会执行 fn
        //3. 当响应式对象 set update 不会执行 fn 而是执行 scheduler
        // 4. 如果说当执行 runner 的时候，会再次的执行 fn
        let dummy;
        let run: any;
        const scheduler = jest.fn(() => {
            run = runner;
        });
        const obj = reactive({ foo: 1 });
        const runner = effect(
            () => {
                dummy = obj.foo;
            },
            { scheduler }
        );
        expect(scheduler).not.toHaveBeenCalled();//scheduler默认没有执行
        expect(dummy).toBe(1);//effect传入的 fn 执行一次
        // should be called on first trigger
        obj.foo++; //响应式变量++
        expect(scheduler).toHaveBeenCalledTimes(1);//scheduler函数默认执行一次
        // // should not run yet
        expect(dummy).toBe(1);//dummy 值没有变
        // // manually run
        run(); //run 是 effect 执行返回的函数
        // // should have run
        expect(dummy).toBe(2); //再次执行后值变成了 2
    });
})