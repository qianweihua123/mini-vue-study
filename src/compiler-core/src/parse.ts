/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-19 22:27:51
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-21 20:31:27
 * @FilePath: /mini-vue-study/src/compiler-core/src/parse.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { NodeTypes } from "./ast";
const enum TagType {
    Start,
    End,
}
export function baseParse(content: string) {
    const context = createParserContext(content);
    return createRoot(parseChildren(context));
}

function parseChildren(context: any) {
    const nodes: any = [];

    let node;

    const s = context.source;
    if (s.startsWith("{{")) {
        node = parseInterpolation(context);
    } else if (s[0] === '<') {
        if (/[a-z]/i.test(s[1])) {
            node = parseElement(context);
        }
    }
    if (!node) {//如果 node 没有值的话，就是 text 节点
        node = parseText(context);
    }

    nodes.push(node);

    return nodes;
}

function parseText(context: any) {
    // 1. 获取content 抽离了parseTextData函数
    const content = parseTextData(context, context.source.length);

    return {
        type: NodeTypes.TEXT,
        content,
    };
}

function parseTextData(context: any, length: any) {
    //获取当前的内容
    const content = context.source.slice(0, length);

    // 2. 推进text 文本的长度
    advanceBy(context, length);
    return content;
}
function parseElement(context: any) {
    const element = parseTag(context, TagType.Start);

    parseTag(context, TagType.End);

    return element;
}

function parseTag(context: any, type: TagType) {
    // <div></div>
    //解析 tag
    //解析完后使用 advanceBy去移动，去除已经完成的代码
    const match: any = /^<\/?([a-z]*)/i.exec(context.source);
    const tag = match[1];
    advanceBy(context, match[0].length);//删除已经处理好的代码
    advanceBy(context, 1);

    if (type === TagType.End) return;

    return {
        type: NodeTypes.ELEMENT,
        tag,
    };
}

function parseInterpolation(context: any) {
    // {{message}}

    const openDelimiter = "{{";
    const closeDelimiter = "}}";

    const closeIndex = context.source.indexOf(
        closeDelimiter,
        openDelimiter.length
    );

    advanceBy(context, openDelimiter.length);

    const rawContentLength = closeIndex - openDelimiter.length;

    const rawContent = parseTextData(context, rawContentLength);
    const content = rawContent.trim()

    advanceBy(context, rawContentLength + closeDelimiter.length);

    return {
        type: NodeTypes.INTERPOLATION,
        content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: content,
        },
    };
}

function advanceBy(context: any, length: number) {
    context.source = context.source.slice(length);
}

function createRoot(children: any) {
    return {
        children,
    };
}

function createParserContext(content: string): any {
    return {
        source: content,
    };
}