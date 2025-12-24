export default defineEventHandler(async (event) => {
    const method = event.method;
    const config = useRuntimeConfig();

    if (method == "GET") {
        return generateCaptcha(config.captchaSecret);
    }

    if (method == "POST") {
        const body = await readBody(event);

        const ok = await verifyCaptcha(
            config.captchaSecret,
            body.token,
            body.hash,
            body.answer
        );

        if (!ok) {
            throw createError({
                statusCode: 403,
                statusMessage: "Incorrect answer",
                message: "回答错误",
            });
        }

        const pair = await getVerifyPair();

        return {
            commSecret: pair.daily,
            verifyToken: pair.verify,
        };
    }
});
