<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { useScrollLock } from "@vueuse/core";

const { loginFormState } = storeToRefs(useAuthStore());

let openCount = ref(0);
const showBackground = computed(() => {
    return loginFormState.value || openCount.value > 0;
});

const event = useEventBus();
event.on("SiteModel:showBackground", (state = false) => {
    openCount.value += state ? 1 : -1;
    openCount.value = Math.max(0, openCount.value);
});

const docScrollLock = useScrollLock(document.documentElement);
onMounted(() => {
    const stopwatch = watch(
        () => showBackground.value,
        () => {
            docScrollLock.value = showBackground.value;
        },
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
    <AuthLogin class="form login-form" />
    <SearchModel class="form search-form" />
    <div id="site-model-slot" class="form flex-center"></div>
</template>

<style lang="scss" scoped>
#site-model-slot,
.model-background {
    position: fixed;
    top: 0;
    left: 0;
    height: 100dvh;
    width: 100dvw;
}
.model-background {
    visibility: hidden;
    backdrop-filter: blur(0);
    transition: all 0.5s ease;
    &.show {
        visibility: visible;
        backdrop-filter: blur(0.5rem);
        z-index: 10;
    }
}
#site-model-slot {
    pointer-events: none;
    * {
        pointer-events: auto;
    }
}

.form {
    z-index: 12;
}
</style>
