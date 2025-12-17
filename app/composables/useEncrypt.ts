import * as OTPAuth from "otpauth";
import { useAuth } from "#imports";

export function useEncrypt(payload: string) {
    const auth = useAuth();
    const commSecret = auth.secret as string;

    const totp = new OTPAuth.TOTP({
        secret: OTPAuth.Secret.fromHex(commSecret),
        digits: 6,
        period: 30,
    });

    function encrypt(payload: any) {
        const token = totp.generate();
        const json = JSON.stringify(payload);

        const encrypted = btoa(xor(json, token));

        return {
            token,
            verify: auth.verify,
            payload: encrypted,
        };
    }
    const encrypted = encrypt(payload);

    return encrypted;
}

function xor(data: string, key: string) {
    let out = "";
    for (let i = 0; i < data.length; i++) {
        out += String.fromCharCode(
            data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
    }
    return out;
}
