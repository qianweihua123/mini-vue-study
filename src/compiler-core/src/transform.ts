import { NodeTypes } from "./ast";
import { TO_DISPLAY_STRING } from "./runtimeHelpers";
export function transform(root: any, options: any) {
    //这里传入的 options 就是在外部定义了如何转换
    // transform(ast, {
    //     nodeTransforms: [plugin],
    // });
    //然后调用下面这个方法返回一个对象，里面有根树和转换的方法
    const context = createTransformContext(root, options);
    //遍历 ast 语法树
    traverseNode(root, context);

    root.helpers = [...context.helpers.keys()];
}

function createRootCodegen(root: any) {
    const child = root.children[0];
    if (child.type === NodeTypes.ELEMENT) {
        root.codegenNode = child.codegenNode;
    } else {
        root.codegenNode = root.children[0];
    }
}
function createTransformContext(root: any, options: any): any {
    const context = {
        root,
        nodeTransforms: options.nodeTransforms || [],
        helpers: new Map(),
        helper(key: any) {
            context.helpers.set(key, 1);
        },
    };

    return context;
}

function traverseNode(node: any, context: any) {
    const nodeTransforms = context.nodeTransforms;
    const exitFns: any = [];
    for (let i = 0; i < nodeTransforms.length; i++) {
        //取出外部传入的转换方法，传入的是一个数组，然后每项都可以去转换节点
        const transform = nodeTransforms[i];
        //拿到转换方法，传入节点去转换
        const onExit = transform(node, context);
        if (onExit) exitFns.push(onExit);
    }
    switch (node.type) {
        case NodeTypes.INTERPOLATION:
            context.helper(TO_DISPLAY_STRING);
            break;
        case NodeTypes.ROOT:
        case NodeTypes.ELEMENT:
            traverseChildren(node, context);
            break;

        default:
            break;
    }
    let i = exitFns.length;
    while (i--) {
        exitFns[i]();
    }

    //如果有子节点，那就继续去调用traverseNode。这里面就会递归调用
    // traverseChildren(node, context);
}
function traverseChildren(node: any, context: any) {
    const children = node.children;

    // if (children) {
    for (let i = 0; i < children.length; i++) {
        const node = children[i];
        traverseNode(node, context);
    }
    // }
}