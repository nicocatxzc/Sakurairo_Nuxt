<script setup>
const route = useRoute();

const status = ref("authing"); // authing | success | failed
const message = ref("正在认证，请稍候...");
const redirectDelay = 2000; // 成功后延迟2秒跳转

// 认证逻辑
onMounted(async () => {
    const code = route?.query?.code ?? "";
    if (!code) {
        status.value = "failed";
        message.value = "未获取到认证信息";
        return;
    }

    try {
        const res = await $fetch("/api/auth/sso", {
            method: "GET",
            query: { code },
        });

        if (res?.expire) {
            status.value = "success";
            message.value = "认证成功，正在跳转首页...";
            await validateUserInfo();
            startAuthGuard();
            setTimeout(() => {
                navigateTo("/")
            }, redirectDelay);
        } else {
            status.value = "failed";
            message.value = "认证失败";
        }
    } catch (err) {
        status.value = "failed";
        message.value = `认证失败,错误详情:${err?.message}`;
    }
});
</script>

<template>
    <div class="sso-page flex-center">
        <div class="sso-box">
            <div v-if="status === 'authing'" class="status authing">
                <span class="dot"></span>
                <span>{{ message }}</span>
            </div>
            <div v-else-if="status === 'success'" class="status success">
                ✅ {{ message }}
            </div>
            <div v-else-if="status === 'failed'" class="status failed">
                ❌ {{ message }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.sso-page {
  height: 100vh;
}

.sso-box {
  padding: 2rem 3rem;
  border-radius: 1rem;
  background-color: var(--widget-background-color);
  box-shadow: var(--widget-shadow-shine);
  text-align: center;
  min-width: 300px;
}

.status {
  font-size: 1.2rem;
}

.status.authing .dot {
  display: inline-block;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background-color: var(--active-color);
  margin-right: 0.5rem;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
}

.status.success {
  color: var(--active-color);
}

.status.failed {
  color: red;
}
</style>
