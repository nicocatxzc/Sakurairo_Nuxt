<script lang="ts" setup>
import tocbot from "tocbot";
onMounted(() => {
    const router = useRouter();

    tocbot.init({
        tocSelector: "#toc",
        contentSelector: ".post-content",
        headingSelector: "h1, h2, h3, h4, h5",

        scrollSmooth: true,
        scrollSmoothDuration: 300,
        headingsOffset: 80,

        throttleTimeout: 100,

        enableUrlHashUpdateOnScroll: false,
    });
    router.afterEach(() => {
        // 修复VUE导航下tocbot在hash锚点下行为异常的问题
        setTimeout(() => {
            history.replaceState(
                null,
                "",
                window.location.pathname + window.location.search
            );
        }, 0);
    });
});
</script>

<template>
    <div class="toc-container">
        <div id="toc"></div>
    </div>
</template>

<style lang="scss">
.toc-container {
    position: absolute;
    top: 20%;
    height: 80%;
    width: 12rem;
    left: calc(100% + 0.5rem);
    #toc {
        position: sticky;
        top: 12%;
        bottom: 0;
        width: fit-content;
        max-height: 80dvh;
        padding: 0.5rem;

        border-radius: 0.5rem;

        background-color: rgba(var(--widget-background), 0.5);
        box-shadow: var(--widget-shadow-shadow);
        border: var(--border-shine);

        overflow-y: auto;
        &:empty {
            display: none;
        }
    }
}
#toc .toc-list {
    list-style: none;
    padding-left: 1rem;
    .is-active-link {
        font-weight: 900;
        &::before {
            content: " ";
            display: inline-block;
            height: inherit;
            left: 2%;
            margin-top: 2px;
            position: absolute;
            width: 3px;
            height: 20px;
            border-radius: 50px;

            background-color: var(--active-color);
        }
    }
    .is-collapsible {
        overflow: hidden;
        &.is-collapsed {
            max-height: 0;
        }
    }
}
@media screen and (min-width: 75rem) {
    .toc-container {
        display: none;
    }
}
</style>
