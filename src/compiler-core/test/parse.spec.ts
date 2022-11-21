/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-19 22:27:28
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-21 20:23:31
 * @FilePath: /mini-vue-study/src/compiler-core/test/parse.spec.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { NodeTypes } from "../src/ast";
import { baseParse } from "../src/parse";
describe("Parse", () => {
    describe("interpolation", () => {
        test("simple interpolation", () => {
            const ast = baseParse("{{ message }}");

            expect(ast.children[0]).toStrictEqual({
                type: NodeTypes.INTERPOLATION,
                content: {
                    type: NodeTypes.SIMPLE_EXPRESSION,
                    content: "message",
                },
            });
        });
    });


    describe("element", () => {
        it("simple element div", () => {
            const ast = baseParse("<div></div>");

            expect(ast.children[0]).toStrictEqual({
                type: NodeTypes.ELEMENT,
                tag: "div",
            });
        });
    });

    describe("text", () => {
        it("simple text", () => {
            const ast = baseParse("some text");

            expect(ast.children[0]).toStrictEqual({
                type: NodeTypes.TEXT,
                content: "some text"
            });
        });
    });
});