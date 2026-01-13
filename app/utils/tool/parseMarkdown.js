import MarkdownIt from "markdown-it";
import texmath from "markdown-it-texmath";
import katex from "katex";

/**
 * 将Markdown字符串渲染为HTML字符串
 * 
 * @function
 * @param {string} text - 需要渲染的Markdown格式字符串
 * @returns {string} 渲染后的HTML字符串
 * 
 * @description
 * 该函数将Markdown文本转换为HTML，
 * 
 * @warning
 * **注意安全**：
 * 此函数不执行任何HTML清理，直接输出渲染结果
 * 应确保输入的Markdown文本来源可信
 * 如果处理不可信的用户输入，必须在后端(BFF)层使用后端的`parseMarkdown`进行预处理，
 * 那个流水线包含iso-dompurify清洗
 * 
 */
export default function parseMarkdown(text) {
    const md = new MarkdownIt({ html: true }).use(texmath, {
        engine: katex,
        delimiters: "dollars", // $...$ 和 $$...$$
        katexOptions: { throwOnError: false },
    });

    const html = md.render(text);
    return html;
}
