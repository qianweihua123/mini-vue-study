import { isString } from "../../reactivity/shared";
import { NodeTypes } from "./ast";
import {
    CREATE_ELEMENT_VNODE,
    helperMapName,
    TO_DISPLAY_STRING,
} from "./runtimeHelpers";
export function generate(ast: any) {
    // createCodegenContext返回一个对象，里面有个 push 方法去拼接
    // const context = {
    //     code: "",
    //     push(source: any) {
    //         context.code += source;
    //     },
    // };
    const context = createCodegenContext();
    const { push } = context;
    //将生成函数前面部分抽离到这个方法里面
    genFunctionPreamble(ast, context);

    const functionName = "render";//一个 函数名
    const args = ["_ctx", "_cache"]; //参数
    const signature = args.join(", ");//将参数数组转成一个 string

    //然后开始拼接
    push(`function ${functionName}(${signature}){`);
    push("return ");
    //推入节点内容
    genNode(ast.codegenNode, context);
    push("}");

    return {
        code: context.code,
    };
}

function genFunctionPreamble(ast: any, context: any) {
    const { push } = context;
    const VueBinging = "Vue";
    const aliasHelper = (s: any) => `${helperMapName[s]}:_${helperMapName[s]}`;
    if (ast.helpers.length > 0) {
        push(
            `const { ${ast.helpers.map(aliasHelper).join(", ")} } = ${VueBinging}`
        );
    }
    push("\n");
    push("return ");
}

function createCodegenContext(): any {
    const context = {
        code: "",
        push(source: any) {
            context.code += source;
        },
    };

    return context
}

function genNode(node: any, context: any) {
    // const { push } = context;
    // push(`'${node.content}'`);
    switch (node.type) {
        case NodeTypes.TEXT:
            genText(node, context);
            break;
        case NodeTypes.INTERPOLATION:
            genInterpolation(node, context);
            break;
        case NodeTypes.SIMPLE_EXPRESSION:
            genExpression(node, context);
            break;
        case NodeTypes.ELEMENT:
            genElement(node, context);
            break;
        case NodeTypes.COMPOUND_EXPRESSION:
            genCompoundExpression(node, context);
            break;
        default:
            break;
    }
}
function genCompoundExpression(node: any, context: any) {
    const { push } = context;
    const children = node.children;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (isString(child)) {
            push(child);
        } else {
            genNode(child, context);
        }
    }
}
function genElement(node: any, context: any) {
    const { push, helper } = context;
    const { tag, children, props } = node;
    push(`${helper(CREATE_ELEMENT_VNODE)}(`);
    genNodeList(genNullable([tag, props, children]), context);
    push(")");
}
function genNodeList(nodes: any, context: any) {
    const { push } = context;

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (isString(node)) {
            push(node);
        } else {
            genNode(node, context);
        }

        if (i < nodes.length - 1) {
            push(", ")
        }
    }
}

function genNullable(args: any) {
    return args.map((arg: any) => arg || "null");
}

function genExpression(node: any, context: any) {
    const { push } = context;
    push(`${node.content}`);
}

function genInterpolation(node: any, context: any) {
    const { push, helper } = context;
    push(`${helper(TO_DISPLAY_STRING)}(`);
    genNode(node.content, context);
    push(")");
}

function genText(node: any, context: any) {
    const { push } = context;
    push(`'${node.content}'`);
}