<script setup>
import { useAuth } from "@/stores/auth";
import { useTimeout } from "@vueuse/core";
const captcha = useCaptcha();
const auth = useAuth();
let token = ref("");
let hash = ref("");
let image = ref("");
let answer = ref("");
const captchaContainer = useTemplateRef("captchaContainer")
let inputRef = useTemplateRef("captchaInput");

onMounted(async () => {
    if (!auth.needCaptcha) {
        return;
    }
    await getCaptcha();
});

let imageShow = ref(false);
const hideTimer = useTimeout(3000, {
    controls: true,
    callback: () => {
        setImageShow(false);
    },
});

function setImageShow(stat) {
    hideTimer.stop();
    if (stat) {
        inputRef.value.placeholder = "点击图片可以刷新";
    } else {
        inputRef.value.placeholder = "点击显示验证码";
    }
    imageShow.value = stat;
}

async function getCaptcha() {
    hideTimer.stop();
    image.value =
        "data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cstyle%3E.spinner_ajPY%7Btransform-origin%3Acenter%3Banimation%3Aspinner_AtaB%20.75s%20infinite%20linear%7D%40keyframes%20spinner_AtaB%7B100%25%7Btransform%3Arotate(360deg)%7D%7D%3C%2Fstyle%3E%3Cpath%20d%3D%22M12%2C1A11%2C11%2C0%2C1%2C0%2C23%2C12%2C11%2C11%2C0%2C0%2C0%2C12%2C1Zm0%2C19a8%2C8%2C0%2C1%2C1%2C8-8A8%2C8%2C0%2C0%2C1%2C12%2C20Z%22%20opacity%3D%22.25%22%2F%3E%3Cpath%20d%3D%22M10.14%2C1.16a11%2C11%2C0%2C0%2C0-9%2C8.92A1.59%2C1.59%2C0%2C0%2C0%2C2.46%2C12%2C1.52%2C1.52%2C0%2C0%2C0%2C4.11%2C10.7a8%2C8%2C0%2C0%2C1%2C6.66-6.61A1.42%2C1.42%2C0%2C0%2C0%2C12%2C2.69h0A1.57%2C1.57%2C0%2C0%2C0%2C10.14%2C1.16Z%22%20class%3D%22spinner_ajPY%22%2F%3E%3C%2Fsvg%3E";
    answer.value = "";
    let res = await captcha.get();
    image.value = res.image;
    hash.value = res.hash;
    token.value = res.token;
}
async function verifyCaptcha(answer) {
    let res = await captcha.verify(answer, token.value, hash.value);
    if (res?.commSecret) {
        ElMessage.success("验证通过");
        auth.setSecret(res.commSecret,res.verifyToken);
        return true;
    } else {
        ElMessage.error("回答错误或验证码已过期");
        getCaptcha();
        return false;
    }
}
</script>

<template>
    <div v-show="auth.needCaptcha" ref="captchaContainer" class="captcha-container">
        <div class="image-button">
            <Icon
                :name="'fa7-solid:circle-info'"
                class="icon"
                @click="setImageShow(!imageShow)"
            />
            <img
                :src="image"
                class="image"
                :class="{
                    show: imageShow,
                }"
                alt="验证码"
                title="点击刷新"
                @click="getCaptcha"
            />
        </div>
        <input
            ref="captchaInput"
            v-model="answer"
            type="text"
            class="input"
            placeholder="点击显示验证码"
            autocomplete="false"
            @focus="setImageShow(true)"
            @blur="hideTimer.start()"
        />
        <button class="button" type="button" @click="verifyCaptcha(answer)">点击验证</button>
    </div>
</template>

<style scoped>
.captcha-container {
    display: flex;
    gap: 0.3rem;
    align-items: center;
    height: 2.75rem;
    padding: 0.2rem;
    background-color: var(--widget-background-color);
    border: var(--border-sketch);
    border-radius: 0.5rem;
    overflow: hidden;
}
.image-button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2rem;
    width: 2rem;
    border: var(--border-sketch);
    border-radius: 0.5rem;
}
.image {
    position: absolute;
    visibility: hidden;
    height: fit-content;
    width: fit-content;
    object-fit: contain;
    transform: translateY(-70%);
    border-radius: 0.5rem;
}
.image.show {
    visibility: visible;
}

.input {
    margin: auto;
    width: 10rem;
    height: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: var(--border-sketch);
    outline: none;
}
.button {
    height: 100%;
    width: 6rem;
    border: var(--border-sketch);
}
</style>
