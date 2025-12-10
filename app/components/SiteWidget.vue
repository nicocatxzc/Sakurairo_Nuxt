<script lang="ts" setup>
let isPanelShow = ref(false);
let darkmode = useDarkmodeStore();
let scroll = useScrollStore();

const darkmodeToggleIcon = computed(() =>
    darkmode.auto
        ? "mdi:sun-moon-stars"
        : darkmode.state
        ? "line-md:moon-loop"
        : "line-md:sun-rising-loop"
);
onMounted(() => {
    watch(
        () => scroll.progress,
        () => {
            isPanelShow.value = false;
        }
    );
});
console.log(scroll.progress)
</script>

<template>
    <div class="site-widget">
        <div
            class="control"
            :class="{
                hide: scroll.progress==0,
            }"
        >
            <button id="goToTop" title="回到顶部">
                <Icon class="icon" name="fa7-solid:sort-up" />
            </button>
            <button
                id="widgetToggle"
                title="小工具"
                @click="isPanelShow = !isPanelShow"
            >
                <Icon class="icon" name="fa7-solid:drafting-compass" />
            </button>
        </div>
        <div class="panel" :class="{ hide: !isPanelShow }">
            <div class="theme-controls widget-groups">
                <div class="darkmode group">
                    <button class="darkmodeToggle" @click="darkmode.toggleMode">
                        <Icon class="icon" :name="darkmodeToggleIcon" />
                    </button>
                </div>

                <div class="font-controls group">
                    <button
                        type="button"
                        class="control-btn-serif selected"
                        title="切换到字体 A"
                        data-name="serif"
                    >
                        字
                    </button>
                    <button
                        type="button"
                        class="control-btn-sans-serif"
                        title="切换到字体 B"
                        data-name="sans-serif"
                    >
                        字
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.site-widget {
    position: fixed;
    right: 0.5rem;
    bottom: 1rem;

    display: flex;
    flex-flow: row-reverse;
    align-items: flex-end;
    gap: 0.5rem;
}
.site-widget * {
    transition: all 0.5s cubic-bezier(0.07, 0.53, 0.65, 0.95);
}
</style>

<style>
.control {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}
.control button {
    font-size: 1.1rem;
    background-color: var(--widget-background-color);
    border-radius: 0.5rem;
    border: var(--border);
    cursor: pointer;
}
.control.hide button {
    transform: scale(0);
}
#goToTop {
    padding: 0.2rem 0.8rem;
}
#goToTop .icon {
    width: 1.3rem;
    height: 1.3rem;
    transform: translateY(30%);
}
#widgetToggle {
    padding: 0.6rem 0.8rem;
}
#widgetToggle .icon {
    animation: rotateY 3s linear infinite;
    transform-style: preserve-3d;
    width: 1.5rem;
    height: 1.5rem;
}
.icon {
    background-color: var(--secondary-word-color);
}
.control button:hover {
    color: var(--main-word-color-reverse);
    box-shadow: var(--widget-shine);
}
.control button:hover .icon {
    background-color: var(--active-color);
}

@keyframes rotateY {
    from {
        transform: rotateY(0deg);
    }
    to {
        transform: rotateY(360deg);
    }
}
</style>

<style scoped>
.panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    transition: all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.panel.hide {
    transform: translateY(200%);
}
.widget-groups {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 0.4rem;

    /* 让所有 group 共享最大高度 */
    align-items: stretch;
}
.group {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex-direction: row;
    text-align: center;

    padding: 0.3rem;
    flex-grow: 1;

    background-color: var(--widget-background-color);
    border-radius: 0.5rem;
    max-width: 8rem;
}
.group button {
    margin: 0.15rem;
    width: 3.125rem;
    height: 3.125rem;
    line-height: 3.125rem;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: var(--widget-background-color);
    box-shadow: var(--widget-shadow);
    border-radius: 0.5rem;
    border: var(--border);
    color: var(--main-word-color);

    flex-grow: 1;

    cursor: pointer;
}
.group button .icon {
    width: 1.5rem;
    height: 1.5rem;
}
.group button:hover {
    color: var(--main-word-color-reverse);
    box-shadow: var(--widget-shine);
    background-color: var(--active-color);
}
</style>
