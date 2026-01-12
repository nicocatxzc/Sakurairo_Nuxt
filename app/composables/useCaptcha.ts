export const useCaptcha = () => {
    const auth = useAuthStore();
    async function get() {
        const res = await $fetch("/api/auth/captcha");
        return res;
    }
    async function verify(payload: object) {
        try {
            const res = await $fetch("/api/auth/captcha", {
                method: "POST",
                body: {
                    ...payload,
                },
            });
            auth.setSecret(res.commSecret, res.verifyToken);
            ElMessage.success("验证通过");
            return true;
        } catch (error) {
            ElMessage.error(`回答错误或验证码已过期,错误详情${error}`);
            console.log(error.data?.message)
            return false;
        }
    }
    return {
        get,
        verify,
    };
};
