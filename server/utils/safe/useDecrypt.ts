export default async function useDecrypt(
    verifyToken: string,
    token: string,
    encryptedPayload: string
) {
    if (!verifyToken) {
        throw createError({ statusCode: 401, message: "没有jwt" });
    }

    const config = useRuntimeConfig();

    // 验签jwt获取短有效密码
    const payload = await verifyVerifyToken(config.commSecret, verifyToken);
    if (!payload) {
        throw createError({ statusCode: 401, message: "无效或过期的密文" });
    }
    const dailySecret = payload.dailySecret as string;

    // 使用短有效密码验签totp
    const totp = createTotp(dailySecret);
    const valid = verifyTotp(totp, token, 1);
    if (!valid) {
        throw createError({
            statusCode: 418,
            statusMessage: valid.toString(),
            message: "密钥验证不通过",
        });
    }

    // 使用 token 作为动态密钥解密
    const raw = await decryptWithTotp(dailySecret, token,encryptedPayload);

    return raw;
}
