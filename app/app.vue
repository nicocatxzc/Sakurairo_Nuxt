<script setup>
import "element-plus/theme-chalk/dark/css-vars.css";

const themeConfig = useThemeConfig();

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
            if (darkmode.state) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        },
        { immediate: true }
    );
});
useHead({
    meta: [
        { name: "description", content: themeConfig.value.siteSeoDesc },
        { name: "keywords", content: themeConfig.value.siteSeoKeyword },
        { property: "og:title", content: "" },
        { property: "og:description", content: "" },
    ],
    style: [
        {
            innerHTML: /*css*/ `
            :root {
                --global-font-size:${themeConfig.value.globalFontSize};
                --global-font-weight:${themeConfig.value.globalFontWeight};
            }
            :root {
                --active-color: ${themeConfig.value.activeColor};
                --widget-transparency: ${themeConfig.value.widgetTransparency};
                --background-transparency: ${themeConfig.value.backgroundTransparency};
                --word-color-first: ${themeConfig.value.wordColorFirst};
                --word-color-second: ${themeConfig.value.WordColorSecond};
                --word-color-third: #00000080;
                --word-color-first-reverse:${themeConfig.value.wordColorFirstDark};
                --widget-background: 255, 255, 255;
                --widget-background-color: rgba(var(--widget-background), var(--widget-transparency));
                --widget-shadow-shine: 0 0.1rem 1.8rem -0.25rem rgb(232, 232, 232);
                --widget-shadow-shining: 0 0.1rem 1.8rem 0.7rem rgb(232, 232, 232);
                --widget-shadow-shadow: 0 -0.3rem 1rem rgba(0,0,0,0.1);
                --border-color-sketch: 0, 0, 0 ;
                --border-color-shine: 255, 255, 255;
                --border-sketch: 0.1rem solid rgba(var(--border-color-sketch),0.1);
                --border-shine: 0.1rem solid rgb(var(--border-color-shine));
                --page-background-color: rgba(255,255,255,var(--background-transparency));
                --code-background: #e1e4e8;
                --secondary-word-color:${themeConfig.value.wordColorSecond};
            }
            :root.dark {
                --active-color: ${themeConfig.value.activeColorDark};
                --widget-transparency: ${themeConfig.value.widgetTransparencyDark};
                --background-transparency: ${themeConfig.value.backgroundTransparencyDark};
                --word-color-first: ${themeConfig.value.wordColorFirstDark};
                --word-color-second: ${themeConfig.value.wordColorSecondDark};
                --word-color-third: #7d7d7d;
                --word-color-first-reverse:${themeConfig.value.wordColorFirst};
                --widget-background: 26, 26, 26;
                --widget-background-color: rgba(var(--widget-background), var(--widget-transparency));
                --widget-shadow-shine: 0 0.1rem 1.2rem -0.25rem rgba(26, 26, 26, 0.8);
                --widget-shadow-shining: 0 0.1rem 2rem -0.25rem var(--active-color);
                --widget-shadow-shadow: 0 -0.3rem 1rem rgba(0,0,0,0.2);
                --border-color-sketch: rgba(255,255,255,0.1);
                --border-color-shine: #7d7d7d30;
                --border-sketch: 0.1rem solid var(--border-color-sketch);
                --border-shine: 0.1rem solid var(--border-color-shine);
                --page-background-color: rgba(51, 51, 51, var(--background-transparency));
                --code-background: #24292e;
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
html {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
        "Microsoft YaHei", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif;
    overflow-x: hidden;
    box-sizing: border-box;
    font-size: 16px;
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
        margin: 0;
        text-shadow: 0 0 0.06rem rgba(0, 0, 0, 0.1);
        color: var(--word-color-first, #505050);
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
}
</style>
