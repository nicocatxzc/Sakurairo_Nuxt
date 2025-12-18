import { useAuth } from "@/stores/auth";

export default defineNuxtPlugin(async (nuxtApp) => {
    if (import.meta.server) return;
    let auth = useAuth();

    // 判断是否有授权
    let authorized = false;
    try {
        let res = await $fetch("/api/auth/validate", {
            method: "POST",
        });
        if (res?.id) {
            auth.updateUser(res);
            console.log("登录信息验证成功");
            auth.secret = res.token;
            auth.needCaptcha = false;
            console.log("令牌更新成功");
            authorized = true;
        } else {
            console.log("没有登录信息");
        }
    } catch (error) {
        ElMessage.error("登录信息已失效");
        auth.clearAuth();
    }

    // 检查登录信息是否快过期
    const now = Date.now() / 1000;
    const timeUntilExpire = auth.expire - now;
    if (timeUntilExpire <= 24 * 60 * 60 && timeUntilExpire > 0) {
        try {
            const res = await $fetch("/api/auth/refresh", {
                method: "POST",
            });
            if (res.expire) {
                auth.expire = res.expire;
            }
            console.log("登录信息续期成功");
        } catch (error) {
            console.log("登录信息续期失败,原因:", error);
        }
    }
});
