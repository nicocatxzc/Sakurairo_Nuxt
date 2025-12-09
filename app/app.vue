import { ThemeConfig } from './types/themeConfig';
<script setup>
const { data: themeConfig } = await useFetch("/api/theme-config");
useState("themeConfig").value = toRaw(themeConfig.value ?? {});
const darkmode = useDarkmodeStore();
onBeforeMount(() => {
    // 立即初始化
    darkmode.mountCheck();
});
onMounted(() => {
    // 自动更新主题
    watch(
        () => darkmode.state,
        () => {
            document.documentElement.classList.toggle("dark");
        },
        { immediate: true }
    );
});
useHead({
    style: [
        {
            innerHTML: `
            :root {
                --global-font-size:${themeConfig.value.globalFontSize};
                --global-font-weight:${themeConfig.value.globalFontWeight};
            }
            :root {
                --word-color: ${themeConfig.value.wordColor};
                --active-color: ${themeConfig.value.activeColor};
                --widget-transparency: ${themeConfig.value.widgetTransparency};
                --background-transparency: ${themeConfig.value.backgroundTransparency};
            }
            :root.dark {
                --word-color: ${themeConfig.value.wordColorDark};
                --active-color: ${themeConfig.value.activeColorDark};
                --widget-transparency: ${themeConfig.value.widgetTransparencyDark};
                --background-transparency: ${themeConfig.value.backgroundTransparencyDark};
                --image-bright:${themeConfig.value.imgBrightDark};
            }
            `,
            type: "text/css",
        },
    ],
});
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<style>
:root {
    --border-color: rgba(255, 255, 255, 0.8);
    --shadow-color: ;
}

:root.dark {
    --border-color: #7d7d7d30;
    --shadow-color: ;
}

html {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
        "Microsoft YaHei", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif;
    overflow-x: hidden;
    box-sizing: border-box;
    font-size: 16px;
}

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
    width: 6px;
}

::-webkit-scrollbar-track {
    background-color: #eee;
}

::-webkit-scrollbar-thumb {
    background-color: var(--word-color);
    border-radius: 25px;
}

body {
    margin: 0;
    text-shadow: 0 0 0.06rem rgba(0, 0, 0, 0.1);
    color: var(--word-color, #505050);
    line-height: 1.5;
    font-size: 0.95rem;
    background-attachment: fixed;
    background-position: center;
    scrollbar-width: 6px;
    font-weight: var(--global-font-weight);
    background-image: url("https://files.nicocat.cc/wp-content/uploads/2024/10/1729668103-433.webp");
}

a {
    background-color: transparent;
    text-decoration: none;
    color: var(--word-color, #505050);
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

li,
ul,
ol {
    padding-inline-start: unset;
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
</style>
