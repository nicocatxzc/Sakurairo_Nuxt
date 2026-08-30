import {
    createIPX,
    ipxFSStorage,
    ipxHttpStorage,
    createIPXFetchHandler,
} from "ipx";
import { decode } from "ufo";

const MODIFIER_SEP = /[&,]/g;
const MODIFIER_VAL_SEP = /[:=_]/;

function safeString(input) {
    return JSON.stringify(input)
        .replace(/^"|"$/g, "")
        .replace(/\\+/g, "\\")
        .replace(/\\"/g, '"');
}

function parseIPXPath(pathname) {
    // 去掉开头的斜杠
    const segs = pathname.replace(/^\//, "").split("/");
    const [modifiersString = "", ...idSegments] = segs;
    const id = safeString(decode(idSegments.join("/")));

    const modifiers = Object.create(null);

    if (modifiersString && modifiersString !== "_") {
        for (const p of modifiersString.split(MODIFIER_SEP)) {
            const [key, ...values] = p.split(MODIFIER_VAL_SEP);

            if (!key) continue;

            modifiers[safeString(key)] = values
                .map((v) => safeString(decode(v)))
                .join("_");
        }
    }

    return { modifiers, id };
}

export default defineEventHandler(async (event) => {
    const nuxtconfig = useRuntimeConfig();
    const wp = new URL(nuxtconfig.wordpressURL);

    const ipx = createIPX({
        storage: ipxFSStorage({
            dir: "./public",
        }),

        httpStorage: ipxHttpStorage({
            domains: [wp.host],
        }),

        alias: {
            "/content": `${wp.origin}/wp-content`,
        },
    });

    const ipxHandler = createIPXFetchHandler(ipx);

    const allowedDomains = new Set([wp.host]);

    // 移除 /api/image 或 /static/image 前缀
    const url =
        event.path
            .replace(/^\/api\/image/, "")
            .replace(/^\/static\/image/, "") || "/";

    const { modifiers, id } = parseIPXPath(url);

    const originalSrc = id.replace(/^"|"$/g, "");

    let isAllowed = false;

    try {
        if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(originalSrc)) {
            // 完整 URL，判断 host 是否在白名单
            const parsed = new URL(originalSrc);

            isAllowed = allowedDomains.has(parsed.host);
        } else {
            // 本地 alias
            isAllowed =
                originalSrc.startsWith("content/") ||
                originalSrc.startsWith("/content/");
        }
    } catch {
        isAllowed = false;
    }

    // 其他情况302返回
    if (!isAllowed) {
        let redirectURL;

        try {
            if (/^https?:\/\//.test(originalSrc)) {
                redirectURL = new URL(originalSrc).toString();
            } else {
                redirectURL = new URL(
                    originalSrc.replace(/^\/+/, ""),
                    wp.origin + "/",
                ).toString();
            }
        } catch {
            redirectURL = wp.origin;
        }

        return sendRedirect(event, redirectURL, 302);
    }

    setResponseHeader(event, "Cache-Control", "public, max-age=86400");

    // IPX v4 使用 Fetch handler
    return ipxHandler(
        new Request(new URL(url, getRequestURL(event).origin), {
            method: event.method,
            headers: getRequestHeaders(event),
        }),
    );
});
