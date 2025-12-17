import { useWP } from "#imports";
import { getVerifyPair } from "../../utils/jwtTool";

export default defineEventHandler(async (event) => {
    let auth;
    try {
        const token = getCookie(event, "auth_token");
        if (!token) {
            return;
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
    const pair = getVerifyPair();
    return {
        ...auth.data,
        token: pair.daily,
        verify: pair.verify,
    };
});
