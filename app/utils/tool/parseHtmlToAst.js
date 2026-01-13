import { parseDocument } from "htmlparser2";

function convertNode(rawNode) {
    // 文本
    if (rawNode.type === "text") {
        return {
            type: "text",
            text: rawNode.data,
            raw: rawNode,
        };
    }
    // 注释
    if (rawNode.type === "comment") {
        return {
            type: "comment",
            text: rawNode.data,
            raw: rawNode,
        };
    }
    // 标签
    if (
        rawNode.type === "tag" ||
        rawNode.type === "script" ||
        rawNode.type === "style"
    ) {
        const children = (rawNode.children || []).map(convertNode);
        return {
            type: "tag",
            name: rawNode.name,
            attrs: rawNode.attribs || {},
            children,
            raw: rawNode,
        };
    }

    // 回退
    return { type: rawNode.type || "unknown", raw: rawNode };
}

// 解析并获取AST树
export default function parseHtmlToAst(html) {
    const doc = parseDocument(html, { decodeEntities: true });
    const children = doc.children || [];
    return children.map(convertNode);
}
