import getSitemap from "../utils/sitemap/getSitemap";

export default defineEventHandler(async (event) => {
    const url = getRequestURL(event);
    const pathname = url.pathname;

    // 代理wp-includes
    if (pathname.startsWith("/includes/")) {
        const wpUrl =
            pathname.replace("/includes", "/wp-includes") + url.search;
        const res = await useWP.get(wpUrl);
        setHeader(event, "Content-Type", "text/css");
        return res.data;
    }

    // 代理wp-content
    if (pathname.startsWith("/content/")) {
        const wpUrl = pathname.replace("/content", "/wp-content") + url.search;
        const res = await useWP.get(wpUrl);
        return res.data;
    }

    // sitemap
    if (pathname.startsWith("/sitemap")) {
        // const wpUrl = pathname + url.search;
        // const res = await useWP.get(wpUrl);
        const sitemap = await getSitemap(pathname,event)
        setHeader(event, "Content-Type", "application/xml");
        return sitemap;
    }
});
