<script lang="ts" setup>
import { useAuth } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { useScrollLock } from "@vueuse/core";

const { loginFormState } = storeToRefs(useAuth());
const showBackground = computed(() => {
    return loginFormState.value;
});

const docScrollLock = useScrollLock(document.documentElement);
onMounted(() => {
    const stopwatch = watch(
        () => showBackground.value,
        () => {
            docScrollLock.value = showBackground.value;
        }
    );
    onUnmounted(() => {
        docScrollLock.value = false;
        stopwatch();
    });
});
</script>

<template>
    <div
        class="model-background"
        :class="{
            show: showBackground,
        }"
    />
    <AuthLogin />
</template>

<style scoped>
.model-background {
    position: fixed;
    top: 0;
    left: 0;
    height: 100dvh;
    width: 100dvw;
    visibility: hidden;
    backdrop-filter: blur(0);
    transition: all 0.5s ease;
}
.model-background.show {
    visibility: visible;
    backdrop-filter: blur(0.5rem);
}
</style>
