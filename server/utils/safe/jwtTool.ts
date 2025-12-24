import crypto from "crypto";
import { SignJWT, jwtVerify, CompactEncrypt, compactDecrypt } from "jose";

export function getDailySecret(masterSecret: string, date = new Date()) {
    // YYYY-MM-DD 格式派生
    const day = date.toISOString().slice(0, 10);
    return crypto.createHmac("sha256", masterSecret).update(day).digest("hex");
}

// 创建 jwt
export async function createVerifyToken(
    masterSecretHex: string,
    dailySecret: string,
    expiresIn = "24h"
) {
    const key = Buffer.from(masterSecretHex, "hex"); // KeyLike for HS256
    const jwt = await new SignJWT({ dailySecret })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(expiresIn)
        .sign(key);
    return jwt;
}

// 验签jwt
export async function verifyVerifyToken(
    masterSecretHex: string,
    token: string
) {
    try {
        const key = Buffer.from(masterSecretHex, "hex");
        const { payload } = await jwtVerify(token, key);
        if (
            !payload ||
            typeof payload !== "object" ||
            !("dailySecret" in payload)
        )
            return null;
        return payload as { dailySecret: string; iat?: number; exp?: number };
    } catch (e) {
        return null;
    }
}

// 派生 32 字节 buffer key
export function deriveKeyNode(dailySecret: string, totp: string): Uint8Array {
    const hash = crypto
        .createHash("sha256")
        .update(`${dailySecret}:${totp}`)
        .digest(); // 32 bytes
    return new Uint8Array(hash);
}

// 使用派生key 进行 jwe加密
export async function encryptWithTotp(
    dailySecret: string,
    totp: string,
    payloadStr: string
) {
    const key = deriveKeyNode(dailySecret, totp); // Uint8Array(32)
    const encoder = new TextEncoder();
    const plaintext = encoder.encode(payloadStr);

    // JWE header: direct encryption (dir) + A256GCM
    const jwe = await new CompactEncrypt(plaintext)
        .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
        .encrypt(key);

    return jwe; // base64url compact serialization
}

// 解密jwe为明文
export async function decryptWithTotp(
    dailySecret: string,
    totp: string,
    jweCompact: string
) {
    const key = deriveKeyNode(dailySecret, totp);
    const { plaintext } = await compactDecrypt(jweCompact, key);
    const decoder = new TextDecoder();
    return decoder.decode(plaintext); // 原始字符串
}

// 生成密钥对
const config = useRuntimeConfig();
export async function getVerifyPair() {
    // 生成当天的 daily secret
    const daily = getDailySecret(config.commSecret);

    // 生成签名令牌
    const verify = await createVerifyToken(config.commSecret, daily, "24h");

    return {
        daily,
        verify,
    };
}
