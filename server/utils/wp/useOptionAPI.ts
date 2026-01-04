import type { H3Event, EventHandlerRequest } from "h3";

export default function useOptionAPI() {
    return {
        async get(key: string) {
            try {
                let config;
                config = await useWP.get("/wp-json/hachimi/v1/option", {
                    params: {
                        key,
                    },
                });

                let siteConfig = await useWPsettings();
                config = replaceWP(config.data.value);
                return {
                    ...config,
                    siteName: siteConfig?.site_name,
                    siteDesc: siteConfig?.site_description,
                };
            } catch (error) {
                throw createError({
                    statusCode: 500,
                    statusMessage: "Internal Server Error",
                    message: error?.toString() || "请求出错",
                });
            }
        },
        async set(key: string, event: H3Event<EventHandlerRequest>) {
            try {
                const auth = await useValidate(event);
                if (!auth?.roles.includes("administrator")) {
                    throw new Error("非管理员禁止操作");
                }

                let put = await readBody(event);

                let req = await useDecrypt(put.verify, put.token, put.payload);

                const config = JSON.parse(req);

                if (
                    !config ||
                    typeof config !== "object" ||
                    Array.isArray(config)
                ) {
                    throw new Error("非法的配置结构");
                }

                let res = await useWP.put("/wp-json/hachimi/v1/option", {
                    key,
                    value: config,
                });

                return res.data;
            } catch (error) {
                throw createError({
                    statusCode: 400,
                    statusMessage: "Bad Request",
                    message: String(error) || "数据结构非法",
                });
            }
        },
    };
}
