/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-10-22 21:11:24
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-10-25 15:07:51
 * @FilePath: /mini-vue-study/src/reactivity/tests/reactive.spec.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { reactive } from "../reactive"
describe('reactive', () => {
    it('happy path', () => {
        const original = { foo: 1 }

        const observed = reactive(original)
        observed.foo
        expect(observed).not.toBe(original)
        expect(observed.foo).toBe(1)
    })
})