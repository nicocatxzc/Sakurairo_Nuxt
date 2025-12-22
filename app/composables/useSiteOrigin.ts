// 获取来源地址
export function useSiteOrigin() {
    if (import.meta.server) {
        const headers = useRequestHeaders(["host", "x-forwarded-proto"]);

        const protocol = headers["x-forwarded-proto"] ?? "https";

        const host = headers.host;

        if (host) {
            return `${protocol}://${host}`;
        }
    }

    if (import.meta.client && typeof window !== "undefined") {
        return window.location.origin;
    }

    const config = useRuntimeConfig();
    return config.public.siteUrl || "";
}
