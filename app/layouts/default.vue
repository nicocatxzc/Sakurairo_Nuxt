<script setup>
const route = useRoute();
const config = useThemeConfig();

const headerKey = ref(0); // 在父级使用key重建容易水合失败的组件，防止失联
onMounted(() => {
    headerKey.value = 1;
});

const headHtml = config.value?.customHeader ?? "";
if (headHtml != "") {
    useHead(astToHead(headHtml));
}

const extraFontsCss = getExtraFontsCss();
const themeCss = getThemeCss();
const sysConfig = useSysConfig();
useHead({
    htmlAttrs: {
        lang: "zh-CN",
        dir: "ltr",
    },
    style: [
        {
            id:"global-styles-inline-css",
            innerHTML: sysConfig.value?.global_style,
        },
        {
            id:"hachimi-theme-defination-inline-css",
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
</script>

<!-- eslint-disable vue/no-v-html -->
<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
    <div class="background">
        <!-- 导航区域 -->
        <ClientOnly>
            <ProgressBar class="progress-bar" />
        </ClientOnly>
        <NavBar :key="headerKey" class="nav-bar" />
        <NavBarMobile :key="headerKey" class="nav-bar-mobile" />

        <!-- 主页封面 -->
        <HomepageCover v-if="route.path == '/'" />

        <!-- 内容区域 -->
        <div class="layout-slot">
            <div class="background-filter" />
            <slot />
            <SiteFooter class="site-footer" hydrate-on-idle/>
            <Particle class="particle" />
        </div>

        <!-- 小组件 -->
        <ClientOnly>
            <SiteWidget class="site-widget" />
            <SiteModels />
        </ClientOnly>
    </div>
</template>
<style lang="scss">
:root.dark {
    img,
    video {
        filter: brightness(var(--image-bright));
    }
}
</style>

<style lang="scss" scoped>
.background {
    .progress-bar {
        z-index: 11;
    }
    .nav-bar {
        z-index: 10;
    }
    .nav-bar-mobile {
        display: none;
        z-index: 10;
    }
    @media screen and (max-width: 860px) {
        .nav-bar {
            display: none;
        }
        .nav-bar-mobile {
            display: flex;
        }
    }
    .layout-slot {
        position: relative;
        z-index: 1;
        .background-filter {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 100dvw;
            background-color: var(--page-background-color);
            backdrop-filter: saturate(120%) blur(8px);

            z-index: -2;
        }

        .site-footer {
            z-index: 1;
        }
        .particle {
            pointer-events: none;
            z-index: -1;
        }
    }
    .site-widget {
        z-index: 10;
    }
    .login-form {
        z-index: 12;
    }
}
</style>
