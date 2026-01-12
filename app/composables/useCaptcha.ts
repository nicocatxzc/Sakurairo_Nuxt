/**
 * 获取验证码方法
 */
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
            ElMessage.error(`验证校验失败,错误详情${error?.data?.message}`);
            console.error(error)
            return false;
        }
    }
    return {
        get,
        verify,
    };
};
