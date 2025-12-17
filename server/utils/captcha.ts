import bcrypt from "bcryptjs";
import { createTotp } from "./totp";
import svgCaptcha from "svg-captcha";

export async function generateCaptcha(secret: string) {
    const totp = createTotp(secret, 60);
    const token = totp.generate();

    const { text, answer } = generateQuestion();

    const image = renderCaptcha(text);
    const hash = await bcrypt.hash(answer, 10);

    return {
        image, // base64 data uri
        token,
        hash,
    };
}

export async function verifyCaptcha(
    secret: string,
    token: string,
    hash: string,
    answer: string
) {
    await new Promise((r) => setTimeout(r, 1000)); // 防暴力破解

    const totp = createTotp(secret, 60);

    if (totp.validate({ token, window: 1 }) === null) {
        return false;
    }

    return bcrypt.compare(answer.trim(), hash);
}

// 生成问题
function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
    // 随机字符
    if (Math.random() < 0.5) {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz";
        let text = "";
        for (let i = 0; i < 4; i++) {
            text += chars[randomInt(0, chars.length - 1)];
        }
        return {
            text,
            answer: text,
        };
    }

    // 随机算式
    const a = randomInt(1, 10);
    const b = randomInt(1, a);
    const isAdd = Math.random() < 0.5;

    if (isAdd) {
        return {
            text: `${a} + ${b} = ?`,
            answer: String(a + b),
        };
    }

    return {
        text: `${a} - ${b} = ?`,
        answer: String(a - b),
    };
}

// 渲染验证码
function renderCaptcha(
    text: string,
    option = { width: 420, height: 120, fontSize: 100, noise: 30 }
) {
    const createCaptcha = svgCaptcha as any;
    const captcha = createCaptcha(text, {
        width: option.width,
        height: option.height,
        fontSize: option.fontSize,
        noise: option.noise,
        color: true,
        background: "#f4f6f8",
        charPreset:
            "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz0123456789+-=",
    });

    return `data:image/svg+xml;base64,${Buffer.from(captcha).toString(
        "base64"
    )}`;
}
