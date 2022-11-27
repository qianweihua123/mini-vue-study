/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-19 22:27:51
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-22 14:07:29
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
    return createRoot(parseChildren(context, []));
}

function parseChildren(context: any, ancestors: any) {
    const nodes: any = [];

    while (!isEnd(context, ancestors)) {
        let node;
        const s = context.source;
        if (s.startsWith("{{")) {
            node = parseInterpolation(context);
        } else if (s[0] === "<") {
            if (/[a-z]/i.test(s[1])) {
                node = parseElement(context, ancestors);
            }
        }

        if (!node) {
            node = parseText(context);
        }

        nodes.push(node);
    }
    return nodes;
}

function isEnd(context: any, ancestors: any) {
    //遇到结束标签
    const s = context.source
    if (s.startsWith("</")) {
        for (let i = ancestors.length - 1; i >= 0; i--) {
            const tag = ancestors[i].tag;
            if (startsWithEndTagOpen(s, tag)) {
                return true;
            }
        }
    }
    return !s //没有值的时候结束
}

function startsWithEndTagOpen(source: any, tag: any) {
    return (
        source.startsWith("</") &&
        source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
    );
}

function parseText(context: any) {
    //处理联合类型的时候如果截取文本的时候遇到{{括号，就停止
    let endIndex = context.source.length;
    let endTokens = ["<", "{{"];

    for (let i = 0; i < endTokens.length; i++) {
        const index = context.source.indexOf(endTokens[i]);
        if (index !== -1 && endIndex > index) {
            //如果找到了{{，那就改变 ednIndex
            endIndex = index;
        }
    }

    const content = parseTextData(context, endIndex);

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

function parseElement(context: any, ancestors: any) {
    const element: any = parseTag(context, TagType.Start);
    ancestors.push(element);
    element.children = parseChildren(context, ancestors);
    ancestors.pop();
    if (startsWithEndTagOpen(context.source, element.tag)) {
        parseTag(context, TagType.End);
    } else {
        throw new Error(`缺少结束标签:${element.tag}`);
    }

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

    const content = rawContent.trim();

    advanceBy(context, closeDelimiter.length);

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
        type: NodeTypes.ROOT
    };
}

function createParserContext(content: string): any {
    return {
        source: content,
    };
}