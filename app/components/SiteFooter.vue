<script lang="ts" setup>
let config = useThemeConfig();
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
    <footer class="site-footer">
        <div class="site-info" v-html="config.footerHTML" />
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

<style scoped>
.site-footer {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    margin-left: auto;
    margin-right: auto;
}
.site-footer,
.theme-info a {
    color: var(--word-color-third);
}
</style>
