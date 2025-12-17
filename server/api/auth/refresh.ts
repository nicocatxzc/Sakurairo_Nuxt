import { useWP } from "#imports";

export default defineEventHandler(async (event) => {
    let auth;
    try {
        const token = getCookie(event, "auth_token");
        auth = await useWP.post("/wp-json/hachimi/v1/auth/refresh", {
            token,
        });

        auth = auth.data;
        setCookie(event, "auth_token", auth.token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
        });
        return { expire: auth?.expire };
    } catch (e) {
        throw createError({
            statusCode: 401,
            statusMessage: "Validate",
            message: "认证失败,令牌无效或已过期",
        });
    }
});
