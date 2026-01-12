import MarkdownIt from "markdown-it";
import texmath from "markdown-it-texmath";
import katex from "katex";
import DOMPurify from "isomorphic-dompurify";
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A") {
        node.setAttribute("rel", "nofollow noopener noreferrer");
        node.setAttribute("target", "_blank");
    }
});
const md = new MarkdownIt({ html: true }).use(texmath, {
    engine: katex,
    delimiters: "dollars", // $...$ 和 $$...$$
    katexOptions: { throwOnError: false },
});

export default function parseMarkdownSafe(text) {

    const html = md.render(text);

    const purify = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            "p",
            "br",
            "strong",
            "em",
            "a",
            "img",
            "blockquote",
            "pre",
            "code",
            "cite",
            "del",
            "i",
            "sub",
            "sup",
            "ul",
            "ol",
            "li",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "span",
            "div",
            "table",
            "thead",
            "tbody",
            "tr",
            "td",
            "th",
        ],
        ALLOWED_ATTR: {
            a: ["href", "title", "target", "rel"],
            img: ["src", "alt", "title", "width", "height"],
            "*": ["class"],
        },
        FORBID_TAGS: [
            "script",
            "style",
            "iframe",
            "meta",
            "link",
            "form",
            "input",
            "textarea",
        ],
        FORBID_ATTR: ["onerror", "onclick", "onload"],
    });
    return purify;
}
