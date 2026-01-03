<script lang="ts" setup>
onMounted(() => {
    const auth = useAuth();
    if (auth.expire == 0) {
        ElMessage.info("请先登录！");
        auth.loginFormState = true;
    }
    let stopwatch = watch(
        () => auth.loginFormState,
        () => {
            if (auth.loginFormState == false && auth.expire == 0) {
                navigateTo("/");
            }
        }
    );
    onUnmounted(()=>{
        stopwatch()
    })
});
</script>

<template>
    <div id="dashboard">
        <slot />
        <ClientOnly>
            <SiteModels />
        </ClientOnly>
    </div>
</template>

<style scoped></style>
