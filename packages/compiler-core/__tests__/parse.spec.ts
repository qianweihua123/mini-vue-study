/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-19 22:27:28
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-22 12:16:27
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
                children: []
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

    test("hello world", () => {
        const ast = baseParse("<div>hi,{{message}}</div>");

        expect(ast.children[0]).toStrictEqual({
            type: NodeTypes.ELEMENT,
            tag: "div",
            children: [
                {
                    type: NodeTypes.TEXT,
                    content: "hi,",
                },
                {
                    type: NodeTypes.INTERPOLATION,
                    content: {
                        type: NodeTypes.SIMPLE_EXPRESSION,
                        content: "message",
                    },
                },
            ],
        });
    });

    test("Nested element ", () => {
        const ast = baseParse("<div><p>hi</p>{{message}}</div>");

        expect(ast.children[0]).toStrictEqual({
            type: NodeTypes.ELEMENT,
            tag: "div",
            children: [
                {
                    type: NodeTypes.ELEMENT,
                    tag: "p",
                    children: [
                        {
                            type: NodeTypes.TEXT,
                            content: "hi",
                        },
                    ],
                },
                {
                    type: NodeTypes.INTERPOLATION,
                    content: {
                        type: NodeTypes.SIMPLE_EXPRESSION,
                        content: "message",
                    },
                },
            ],
        });
    });

    test("should throw error when lack end tag", () => {
        expect(() => {
            baseParse("<div><span></div>");
        }).toThrow(`缺少结束标签:span`);
    });
});