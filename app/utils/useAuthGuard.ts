import { useAuth } from "@/stores/auth";

let timer: ReturnType<typeof setInterval> | null = null;
let validating = false;

export function startAuthGuard() {
    if (timer) return; // 防止重复启动

    const auth = useAuth();

    const validate = async () => {
        if (validating) return;

        validating = true;

        try {
            const validate = await validateUserInfo();

            if (!validate) return;

            // 登录信息快过期，自动刷新
            const now = Date.now() / 1000;
            const remain = auth.expire - now;

            if (remain > 0 && remain <= 24 * 60 * 60) {
                try {
                    const refreshed: any = await $fetch("/api/auth/refresh", {
                        method: "POST",
                    });
                    if (refreshed?.expire) {
                        auth.expire = refreshed.expire;
                    }
                } catch (err) {
                    console.log("登录续期失败,原因:", err);
                }
            }
        } catch (err: any) {
            // 真正的异常才处理
            if (
                err?.statusCode === 401 ||
                err?.statusMessage?.includes("Validate Failed")
            ) {
                ElMessage.error("登录信息已失效");
                await auth.clearAuth();
                stopAuthGuard();
            } else {
                console.warn("网络异常:", err);
            }
        } finally {
            validating = false;
        }
    };

    // 立即跑一次
    validate();
    console.log("登录信息验证成功");

    timer = setInterval(validate, 54_000);
}

export function stopAuthGuard() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

export async function validateUserInfo() {
    const auth = useAuth();
    const res: any = await $fetch("/api/auth/validate", {
        method: "POST",
    });

    // 无登录信息
    if (!res || !res.id) {
        console.log("没有登录信息");
        return false;
    }
    // 已登录用户,自动更新免验证码
    auth.updateUser(res);
    auth.secret = res.token;
    auth.verify = res.verify;
    auth.needCaptcha = false;

    return true;
}
