import axios from "axios";
export default defineEventHandler(async (event) => {
    const method = event.method;
    const config = useRuntimeConfig();
    const themeConfig = await getThemeConfig();

    if (method == "GET") {
        switch (themeConfig.captchaSelect ?? "builtIn") {
            case "cloudflare":
                return {
                    type: "cloudflare",
                };
            default:
                const quest = await generateCaptcha(config.captchaSecret);
                return {
                    type: "builtIn",
                    ...quest,
                };
        }
    }

    if (method == "POST") {
        const themeConfig = await getThemeConfig();
        const sysConfig = await getThemeSysConfig();

        const body = await readBody(event);

        let ok;
        switch (themeConfig.captchaSelect ?? "builtIn") {
            case "cloudflare":
                /**
                 * {
                    "action": "",
                    "cdata": "",
                    "challenge_ts": "2026-01-10T11:43:29.000Z",
                    "error-codes": [],
                    "hostname": "localhost",
                    "metadata": {
                        "interactive": false
                    },
                    "success": true
                }
                 */
                const ip = getRequestIP(event);
                const verify = await axios.post(
                    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
                    {
                        secret: sysConfig.sysTurnstileSecretKey,
                        response: body.token,
                        // remoteip: ip,
                    }
                );
                if (verify.data.success == true) {
                    ok = true;
                } else {
                    throw createError({
                        statusCode: 403,
                        statusMessage: "Verify Failed",
                        message: "验证校验失败",
                    });
                }
                break;

            default:
                ok = await verifyCaptcha(
                    config.captchaSecret,
                    body.token,
                    body.hash,
                    body.answer
                );
                if (!ok) {
                    throw createError({
                        statusCode: 403,
                        statusMessage: "Incorrect answer",
                        message: "回答错误或验证码已过期",
                    });
                }
                break;
        }

        const pair = await getVerifyPair();

        return {
            commSecret: pair.daily,
            verifyToken: pair.verify,
        };
    }
    return {};
});
