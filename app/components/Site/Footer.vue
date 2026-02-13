<script lang="ts" setup>
let config = useThemeConfig();
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
    <footer
        class="site-footer flex-center"
        :style="{ fontFamily: config?.footerFont || '' }"
    >
        <div
            v-if="config?.footerSakura || true"
            class="sakura-icon flex-center"
        >
            <Icon name="local:sakura" mode="svg"></Icon>
        </div>
        <div class="site-info" v-html="config?.footerHTML || ''" />
        <div class="theme-info">
            <a
                href="https://github.com/mirai-mamori/Sakurairo"
                rel="noopener"
                target="_blank"
            >
                Theme Sakurairo
            </a>
            <a href="https://docs.fuukei.org/" rel="noopener" target="_blank">
                by Fuukei
            </a>
        </div>
    </footer>
</template>

<style lang="scss" scoped>
.site-footer {
    width: 100%;
    flex-direction: column;
    padding: 2rem;
    margin-left: auto;
    margin-right: auto;
}
.site-footer,
.theme-info a {
    color: var(--word-color-third);
}
.sakura-icon {
    height: 2rem;
    width: 2rem;
    :deep(svg) {
        height: 100%;
        width: 100%;
        animation: slow-rotate 10s linear infinite;
    }
}

@keyframes slow-rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
