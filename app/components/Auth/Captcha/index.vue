<script lang="ts" setup>
const config = useThemeConfig();
const auth = useAuth();
const captchaSelect = config.value?.captchaSelect ?? "builtIn";
</script>

<template>
    <div v-if="auth.needCaptcha" class="captcha-container">
        <AuthCaptchaTurnstile v-if="captchaSelect == 'cloudflare'" />
        <AuthCaptchaBuiltIn v-if="captchaSelect == 'builtIn'" />
    </div>
</template>

<style scoped></style>
