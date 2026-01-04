<script setup>
let isPanelShow = ref(false);
let darkmode = useDarkmodeStore();
let scroll = useScrollStore();
const config = useThemeConfig();
const themeStore = useThemeConfigStore();

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
    switchFont();
});
function scrollToTop() {
    scrollTo(0, 0);
}

let fontStyleEl = null;
function switchFont(font = themeStore?.font ?? "") {
    if (!font) return;

    if (!fontStyleEl) {
        fontStyleEl = document.createElement('style');
        fontStyleEl.id = 'theme-font-style';
        document.head.appendChild(fontStyleEl);
    }

    fontStyleEl.textContent = `
        html {
            font-family: ${font} !important;
        }
    `;
    themeStore.font = font
}
</script>

<template>
    <div class="site-widget">
        <div
            class="control"
            :class="{
                hide: scroll.progress == 0,
            }"
        >
            <button id="goToTop" title="回到顶部" @click="scrollToTop">
                <Icon class="icon" name="fluent:caret-up-20-filled" />
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
                    <button
                        class="darkmode-toggle"
                        aria-label="切换主题深色模式状态"
                        :title="`切换主题深色模式状态`"
                        @click="darkmode.toggleMode"
                    >
                        <Icon class="icon" :name="darkmodeToggleIcon" />
                    </button>
                </div>

                <div
                    v-if="
                        config?.toolbarFontsChoice?.length &&
                        config.toolbarFontsChoice.length > 0
                    "
                    class="font-controls group"
                >
                    <button
                        v-for="(font, index) in config?.toolbarFontsChoice ??
                        []"
                        :key="index"
                        type="button"
                        class="control-btn-serif selected"
                        :aria-label="`切换到字体 ${font?.name}`"
                        :title="`切换到字体 ${font?.name}`"
                        data-name="serif"
                        @click="switchFont(font?.name)"
                    >
                        {{ font?.name ?? "字" }}
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

    * {
        transition: all 0.5s cubic-bezier(0.07, 0.53, 0.65, 0.95);
    }

    .control {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        &.hide {
            button {
                transform: scale(0);
            }
        }

        button {
            font-size: 1.1rem;
            background-color: var(--widget-background-color);
            border-radius: 0.5rem;
            border: var(--border-shine);
            cursor: pointer;

            &:hover {
                color: var(--word-color-first-reverse);
                box-shadow: var(--widget-shadow-shine);

                .icon {
                    background-color: var(--active-color);
                }
            }
        }

        #goToTop {
            padding: 0.2rem 0.8rem;

            .icon {
                width: 1.3rem;
                height: 1.3rem;
                transform: translateY(15%);
            }
        }

        #widgetToggle {
            padding: 0.6rem 0.8rem;

            .icon {
                animation: rotateY 3s linear infinite;
                transform-style: preserve-3d;
                width: 1.5rem;
                height: 1.5rem;
            }
        }

        .icon {
            background-color: #7d7d7d;
        }
    }

    .panel {
        position: absolute;
        right: 4rem;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);

        &.hide {
            transform: translateY(200%);
        }

        .widget-groups {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            gap: 0.4rem;
            align-items: stretch;

            .group {
                display: flex;
                justify-content: space-between;
                flex-direction: row;
                text-align: center;
                padding: 0.3rem;
                flex-grow: 1;
                background-color: var(--widget-background-color);
                border-radius: 0.5rem;
                max-width: 8rem;

                button {
                    margin: 0.15rem;
                    width: 3.125rem;
                    height: 3.125rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: var(--widget-background-color);
                    box-shadow: var(--widget-shadow-shine);
                    border-radius: 0.5rem;
                    border: var(--border-color-shine);
                    color: var(--word-color-first);
                    flex-grow: 1;
                    cursor: pointer;

                    .icon {
                        width: 1.5rem;
                        height: 1.5rem;
                    }

                    &:hover {
                        color: var(--word-color-first-reverse);
                        box-shadow: var(--widget-shadow-shine);
                        background-color: var(--active-color);
                    }
                }
                .darkmode-toggle {
                    height: 100%;
                }
            }
            .font-controls {
                flex-wrap: wrap;
                width: 8rem;
            }
        }
    }
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
