export default defineEventHandler(async (event) => {
    let post: any = {};

    if (event.method == "POST") {
        post = await readBody(event);
        let res:any = await useDecrypt(post?.verify,post?.token, post?.payload);
        try {
            res = JSON.parse(res);
        } catch (e) {
            throw createError({
                statusCode: 500,
                statusMessage: "Unexpected Data",
                message: "这不是预期的结构",
            });
        }
        let auth;
        try {
            auth = await useWP.post("/wp-json/hachimi/v1/auth/login", {
                username: res?.username,
                password: res?.password,
            });
        } catch (e) {
            throw createError({
                statusCode: 401,
                statusMessage: "Login Failed",
                message: "用户名或密码错误",
            });
        }
        auth = auth.data
        setCookie(event, "auth_token", auth.token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
        });
        return auth.user;
    } else {
        throw createError({
            statusCode: 405,
            statusMessage: "Only POST allowed",
            message: "已有哈根,必须达斯",
        });
    }
});
