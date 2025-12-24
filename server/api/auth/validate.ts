export default defineEventHandler(async (event) => {
    let auth;
    try {
        const token = getCookie(event, "auth_token");
        if (!token) {
            throw createError({
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "缺少认证令牌",
            });
        }
        auth = await useWP.post("/wp-json/hachimi/v1/auth/validate", {
            token,
        });
    } catch (e) {
        throw createError({
            statusCode: 401,
            statusMessage: "Validate Failed",
            message: "认证失败,令牌无效或已过期",
        });
    }
    const pair = await getVerifyPair();
    return {
        ...auth.data,
        token: pair.daily,
        verify: pair.verify,
    };
});
