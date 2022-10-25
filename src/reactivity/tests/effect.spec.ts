/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-10-22 21:03:53
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-10-25 14:27:44
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

    it('should return runner when call effect', ()=>{
        //effect（fn） -> 返回function->调用fn ->return 拿到返回值
        let foo = 10
        const runner = effect(() =>{
            foo++
            return 'foo'
        })
        expect(foo).toBe(11);
        const r = runner();
        expect(foo).toBe(12)
        expect(r).toBe('foo')
    })
})