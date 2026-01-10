<script setup>
import { VueTurnstile } from "vue-cloudflare-turnstile";

const config = useThemeConfig();
const captcha = useCaptcha();
async function verify(token) {
    const res = await captcha.verify({ token });
    console.log(res);
}
</script>

<template>
    <VueTurnstile :site-key="config.turnstileSiteKey ?? ''" @success="verify" />
</template>

<style></style>
