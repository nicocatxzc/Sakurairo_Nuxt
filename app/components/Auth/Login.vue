<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const loginModel = computed(() => auth.loginFormState);

let username = ref("");
let password = ref("");
let loginForm = useTemplateRef("loginForm");
onMounted(() => {
    onClickOutside(loginForm.value, () => {
        auth.loginFormState = false;
    });
});
async function submitLogin() {
    let info = await useEncrypt(
        JSON.stringify({
            username: username.value,
            password: password.value,
        })
    );

    try {
        let user = await $fetch("/api/auth/login", {
            method: "POST",
            body: info,
        });
        auth.updateUser(user);
        auth.loginFormState = false;
        ElMessage.success("登录成功");
    } catch (error) {
        ElMessage.error(`登录失败,${error.data?.message ?? '请检查用户名或密码是否正确'}`)
    }
}
</script>

<template>
    <form
        ref="loginForm"
        class="login-form flex-center"
        :class="{
            show: loginModel,
        }"
        @submit.prevent="submitLogin"
    >
        <p class="form-title">注册或登录</p>
        <el-input
            v-model="username"
            type="text"
            class="input input-username"
            placeholder="用户名"
            required
        >
            <template #prepend>
                <Icon class="icon" :name="'fa7-solid:circle-user'" />
            </template>
        </el-input>
        <el-input
            v-model="password"
            class="input input-password"
            type="password"
            placeholder="密码"
            show-password
        >
            <template #prepend>
                <Icon class="icon" :name="'fa7-solid:lock'" />
            </template>
        </el-input>
        <AuthCaptcha v-if="loginModel" class="captcha" />
        <button type="submit" class="submit" :disabled="auth.needCaptcha">
            登录
        </button>
    </form>
</template>

<style lang="scss" scoped>
.login-form {
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    z-index: 10;

    position: fixed;
    top: 50dvh;
    left: 50dvw;

    flex-direction: column;

    padding: 2rem;
    gap: 0.5rem;
    border-radius: 1.5rem;
    border: var(--border-sketch);

    transform: translate(-50%, -50%) scale(0.9);
    opacity: 0;
    visibility: hidden;
    background-color: var(--widget-background-color);
    backdrop-filter: saturate(180%) blur(10px);
    box-shadow: var(--widget-shadow-shadow);

    &.show {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
        visibility: visible;
    }

    .form-title {
        font-size: 1.5rem;
        font-weight: 500;
    }

    .input {
        &-username,
        &-password {
            width: 20rem;
            height: 2.75rem;

            color: var(--word-color-first);
            background-color: var(--widget-background-color);
            backdrop-filter: saturate(180%) blur(10px);

            border-radius: 0.5rem;
            border: var(--border-sketch);
            outline: none;
            font-size: 1rem;
        }

        * {
            box-shadow: none;
            border-radius: 0.5rem;
            --el-fill-color-light: transparent;
        }

        :deep(.el-input__wrapper) {
            background-color: transparent;
            box-shadow: none;
        }

        :deep(.el-input-group__prepend) {
            padding: 0;
            transform: translateX(40%);
        }
    }

    .captcha {
        width: 20rem;
    }

    .submit {
        width: 100%;
        padding: 0.5rem;
        border: var(--border-sketch);
    }
}
</style>
