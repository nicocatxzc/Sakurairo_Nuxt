import * as OTPAuth from "otpauth";

export function createTotp(secret: string, period = 30, digits = 8) {
    return new OTPAuth.TOTP({
        issuer: "hachimi",
        label: "front-totp",
        algorithm: "SHA1",
        digits,
        period,
        secret: OTPAuth.Secret.fromHex(secret),
    });
}

export function verifyTotp(totp: OTPAuth.TOTP, token: string, stepWindow = 1) {
    return (
        totp.validate({
            token,
            window: stepWindow,
        }) !== null
    );
}
