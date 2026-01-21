import { JSDOM } from "jsdom";

export default async function useWPPageStyles(path) {
    try {
        const head = await useWP.get(path, {
            params: { headless: true },
        });

        const dom = new JSDOM(head.data);
        const { document } = dom.window;

        // 内联样式
        const style = [...document.querySelectorAll('style[id$="-inline-css"]')]
            .filter(
                (el) =>
                    !el.id.includes("admin-bar") &&
                    !el.id.includes("global-styles-inline-css")
            )
            .map((el) => ({
                id: el.id,
                innerHTML: el.textContent || "",
            }));

        // 样式表
        const link = [...document.querySelectorAll('link[rel="stylesheet"]')]
            .filter((el) => !el?.href.includes("/themes/"))
            .map((el) => {
                const url = new URL(el.href);

                return {
                    id: el.id || undefined,
                    rel: "stylesheet",
                    href:
                        url.pathname.replace("/wp-includes", "/includes") +
                        url.search,
                    media: el.media || "all",
                };
            });

        return {
            link,
            style,
        };
    } catch (error) {
        console.log(`获取页面${path}的样式时遇到问题,错误信息:`)
        console.log(error)
    }
}
