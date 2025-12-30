import getSitemap from "../utils/sitemap/getSitemap";

export default defineEventHandler(async (event) => {
    const url = getRequestURL(event);
    const pathname = url.pathname;

    const nuxtconfig = useRuntimeConfig();

    const username = nuxtconfig.wordpressUserName;
    const token = nuxtconfig.wordpressAuthToken;

    const credentials = Buffer.from(`${username}:${token}`).toString("base64");

    // 代理wp-includes
    if (pathname.startsWith("/includes/")) {
        const target =
            nuxtconfig.wordpressURL +
            pathname.replace("/includes", "/wp-includes") +
            url.search;

        return proxyRequest(event, target, {
            headers: {
                Authorization: "Basic " + credentials,
            },
        });
    }

    // 代理wp-content
    if (pathname.startsWith("/content/")) {
        const target =
            nuxtconfig.wordpressURL +
            pathname.replace("/content", "/wp-content") +
            url.search;

        return proxyRequest(event, target, {
            headers: {
                Authorization: "Basic " + credentials,
            },
        });
    }

    // 代理静态文件
    if (pathname.startsWith("/static/")) {
        // 屏蔽危险路径
        const blacklist = ["/wp-json", "/graphql", "/wp-admin"];
        if (blacklist.some((p) => pathname.startsWith(p))) return;

        // 只代理带后缀名的文件
        if (!/\.[a-zA-Z0-9]+$/.test(pathname) || pathname.endsWith(".php")) {
            return;
        }

        // 代理到 WordPress 根目录
        const target =
            nuxtconfig.wordpressURL +
            "/" +
            pathname.replace(/^\/static\//, "") +
            url.search;
        return proxyRequest(event, target);
    }

    // sitemap
    if (pathname.startsWith("/sitemap")) {
        // const wpUrl = pathname + url.search;
        // const res = await useWP.get(wpUrl);
        const sitemap = await getSitemap(pathname, event);
        setHeader(event, "Content-Type", "application/xml");
        return sitemap;
    }
});
