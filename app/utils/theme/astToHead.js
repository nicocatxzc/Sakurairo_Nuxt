/**
 * 将用户输入的头部HTML提取为可供useHead()方法使用的结构对象:\
 * useHead(astToHead(headHtml))
 * @param {String} html 
 */
export default function astToHead(html) {
    const ast = parseHtmlToAst(html);

    const head = {
        meta: [],
        link: [],
        script: [],
        style: [],
    };

    function walk(node) {
        if (node.type !== "tag") return;

        switch (node.name) {
            case "meta":
                head.meta.push(node.attrs);
                break;

            case "link":
                head.link.push(node.attrs);
                break;

            case "script":
                head.script.push({
                    ...node.attrs,
                    innerHTML: node.children?.map((c) => c.text).join("") || "",
                });
                break;

            case "style":
                head.style.push({
                    innerHTML: node.children?.map((c) => c.text).join("") || "",
                });
                break;
        }

        node.children?.forEach(walk);
    }

    ast.forEach(walk);
    return head;
}
