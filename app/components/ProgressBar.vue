<script setup>
import { useScrollStore, useLoadStore } from "~/stores/progress";
import { useDarkmodeStore } from "@/stores/darkmode";
let themeConfig = useThemeConfig();
let darkmode = useDarkmodeStore();
const scroll = useScrollStore();
const load = useLoadStore();
</script>

<template>
    <div class="progress-bars">
        <ClientOnly >
            <ElProgress
                :percentage="scroll.progress"
                :show-text="false"
                :text-inside="true"
                :color="
                    darkmode.state
                        ? themeConfig.activeColorDark
                        : themeConfig.activeColor
                "
                class="scroll-progress progress"
            />
            <ElProgress
                :v-show="
                    load.loadState == 'loading' ||
                    load.loadState == 'success' ||
                    load.loadState == 'error'
                "
                :percentage="load.progress"
                :show-text="false"
                :text-inside="true"
                class="load-progress progress"
            />
        </ClientOnly>
    </div>
</template>

<style scoped>
.progress {
    width: 100vw;
    height: 0.125rem;
    position: fixed;
    z-index: 1000;
    --el-border-color-lighter: transparent;
}
</style>
