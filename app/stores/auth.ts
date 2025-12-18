import { defineStore } from "pinia";

export const useAuth = defineStore(
    "auth",
    () => {
        const secret = ref(""); // 交换令牌，仅用于人机验证
        const verify = ref(""); // 令牌的有效凭证
        const loginFormState = ref(false); // 登录窗口状态
        const needCaptcha = ref(true); // 是否需要验证码
        const user = ref<any>({}); // 用户信息
        const expire = ref(0); // php time()秒级时间戳

        function openLoginForm() {
            loginFormState.value = true;
        }

        function setSecret(token: string,verifytoken: string) {
            secret.value = token;
            verify.value = verifytoken;
            needCaptcha.value = false;
        }

        function updateUser(userInfo: any) {
            user.value = {
                name: userInfo?.name,
                avatar: userInfo?.avatar,
                description: userInfo?.description,
                email: userInfo?.email,
                id: userInfo.id,
                role: userInfo.roles[0],
                slug: userInfo.slug,
                management: userInfo?.management,
            };
        }

        async function clearAuth() {
            try {
                await $fetch("/api/auth/logout");
                ElMessage.success("注销成功");
            } catch (error) {
                ElMessage.error(`注销失败,详细信息${error}`);
                return;
            }
            user.value = {};
            expire.value = 0;
            ElMessage.success("登录信息清除成功");
        }

        return {
            secret,
            verify,
            user,
            expire,
            needCaptcha,
            loginFormState,

            updateUser,
            openLoginForm,
            setSecret,
            clearAuth,
        };
    },
    {
        persist: {
            pick: ["secret", "user", "expire","verify"],
            storage: {
                getItem: (key) =>
                    import.meta.client ? localStorage.getItem(key) : null,
                setItem: (key, value) => {
                    if (import.meta.client) {
                        localStorage.setItem(key, value);
                    }
                },
            },
        },
    }
);
