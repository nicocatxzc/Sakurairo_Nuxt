export default defineEventHandler(async (event) => {
    try {
        try {
            const token = getCookie(event, "auth_token");
            if (!token) {
                return;
            }
            await useWP.post("/wp-json/hachimi/v1/auth/validate", {
                token,
            });
        } catch {
            throw createError({
                statusCode: 401,
                statusMessage: "Validate Failed",
                message: `认证失败,令牌无效或已过期`,
            });
        }

        let put = await readBody(event);

        let req = await useDecrypt(put.verify, put.token, put.payload);

        const config = JSON.parse(req)

        if (!config || typeof config !== "object" || Array.isArray(config)) {
            throw new Error("非法的配置结构");
        }

        let res = await useWP.put("/wp-json/hachimi/v1/config", config);

        return res.data;
    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: error?.message || "数据结构非法",
        });
    }
});
