function xor(data: string, key: string) {
    let out = "";
    for (let i = 0; i < data.length; i++) {
        out += String.fromCharCode(
            data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
    }
    return out;
}

export function encrypt(payload: string, totpCode: string) {
    return Buffer.from(xor(payload, totpCode)).toString("base64");
}

export function decrypt(encoded: string, totpCode: string) {
    const raw = Buffer.from(encoded, "base64").toString();
    return xor(raw, totpCode);
}
