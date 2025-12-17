import crypto from "crypto";
import jwt from "jsonwebtoken";

export function getDailySecret(masterSecret: string, date = new Date()) {
    // YYYY-MM-DD 格式派生
    const day = date.toISOString().slice(0, 10);
    return crypto.createHmac("sha256", masterSecret).update(day).digest("hex");
}

// 创建 jwt
export function createVerifyToken(
    masterSecret: string,
    dailySecret: string,
    expiresIn = "24h"
) {
    return jwt.sign({ dailySecret }, masterSecret, {
        expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
    });
}

// 验签jwt
export function verifyVerifyToken(masterSecret: string, token: string) {
    try {
        const payload = jwt.verify(token, masterSecret) as {
            dailySecret: string;
            iat?: number;
            exp?: number;
        };
        if (
            !payload ||
            typeof payload !== "object" ||
            !("dailySecret" in payload)
        ) {
            throw new Error("invalid token payload");
        }
        return payload as { dailySecret: string; iat?: number; exp?: number };
    } catch (e) {
        return null;
    }
}

// 生成密钥对
const config = useRuntimeConfig();
export function getVerifyPair() {
    // 生成当天的 daily secret
    const daily = getDailySecret(config.commSecret);

    // 生成签名令牌
    const verify = createVerifyToken(config.commSecret, daily, "24h");

    return {
        daily,
        verify,
    };
}
