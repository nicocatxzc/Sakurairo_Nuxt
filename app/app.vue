<script setup>
import "element-plus/theme-chalk/dark/css-vars.css";

const themeConfig = useThemeConfig();
const darkmode = useDarkmodeStore();

// 初始化样式
const extraFontsCss = getExtraFontsCss();
const themeCss = getThemeCss();
const sysConfig = useSysConfig();
if((themeConfig.value?.siteLogo ?? false) != '') {
    const logo = useNuxtImg(themeConfig.value.siteLogo)
    useHead({
        link: [
            {
                rel:"icon",
                href:logo
            }
        ]
    })
}
useHead({
    htmlAttrs: {
        lang: "zh-CN",
        dir: "ltr",
    },
    style: [
        {
            innerHTML: sysConfig.value?.global_style,
        },
        {
            innerHTML: `
        ${extraFontsCss.value}
        ${themeCss.value}`,
        },
    ],
});
useStyleTag(
    computed(
        () => `
        ${extraFontsCss.value}
        ${themeCss.value}
        `
    )
);

// 初始化客户端逻辑
onBeforeMount(() => {
    darkmode.mountCheck();
});

onMounted(() => {
    watchDarkmode();
});
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<style lang="scss">
html {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
        "Microsoft YaHei", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif;
    overflow-x: hidden;
    box-sizing: border-box;
    font-size: var(--global-font-size, 16px);
    scroll-behavior: smooth;
}

@layer rest {
    *:not(.post-content article *),
    *:not(.post-content article *)::before,
    *:not(.post-content article *)::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :after,
    :before {
        box-sizing: inherit;
    }

    ::-webkit-scrollbar {
        height: 6px;
        width: 6px;
    }
    ::-webkit-scrollbar-track {
        background-color: #eee;
    }
    ::-webkit-scrollbar-thumb {
        background-color: var(--word-color-first);
        border-radius: 25px;
    }

    body {
        height: 100dvh;
        width: 100dvw;
        margin: 0;
        text-shadow: 0 0 0.06rem rgba(0, 0, 0, 0.1);
        color: var(--word-color-first, #505050);
        line-height: 1.5;
        font-size: 0.95rem;
        background-attachment: fixed;
        background-position: center;
        scrollbar-width: 6px;
        font-weight: var(--global-font-weight);
    }

    a {
        background-color: transparent;
        text-decoration: none;
        color: var(--word-color-first, #505050);
        outline: 0;
        transition: all 0.2s ease-in-out;
        word-break: break-word;
    }

    a:hover,
    a:active,
    a:focus {
        transition: all 0.2s ease-in-out;
    }
    a:hover {
        color: var(--active-color);
    }

    p {
        color: var(--word-color-second);
        margin: 0;
        padding: 0;
    }

    button,
    input {
        font-size: 1rem;

        padding: 0.25rem 0.5rem;

        color: var(--word-color-first);
        background-color: var(--widget-background-color);
        border: var(--border-shine);
        border-radius: 0.5rem;
    }
    button {
        cursor: pointer;
    }

    li,
    ul,
    ol {
        padding-inline-start: unset;
        list-style-position: inside;
        margin: 0;
    }

    dialog {
        height: 100vh;
        width: 100vw;
        margin: 0;
        border: none;
        max-width: none;
        max-height: none;
        background: transparent;
    }

    img {
        border: 0;
        height: auto;
        max-width: 100%;
    }
    .nuxtpic {
        display: block;
        img {
            display: block;
            height: 100%;
            width: 100%;
            object-fit: cover;
        }
    }
    .flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
