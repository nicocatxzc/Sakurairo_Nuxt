<script setup>
import Typed from "typed.js";

let config = useThemeConfig();

const coverPc = useNuxtImg(
    config.value?.randomPicUrlPc || config.value?.randomPicUrlMb || ""
);
const coverMb = useNuxtImg(
    config.value?.randomPicUrlMb || config.value?.randomPicUrlPc || ""
);

const typedRef = useTemplateRef("typedRef");
onMounted(() => {
    let typed;
    try {
        if(config.value?.coverTypedjs) {
            typed = new Typed(typedRef.value, JSON.parse(config.value?.coverTypedjsConfig));
        }
    } catch (e) {
        ElMessage.error(`typedjs初始化失败,错误详情${e}`);
    }

    onUnmounted(() => {
        if(typed?.destroy()) {
            typed.destroy();
        }
    });
});
</script>

<template>
    <div class="homepage-cover">
        <figure
            class="cover"
            :class="{
                transparent:config?.coverAsBackground || false
            }"
            :style="{
                '--background-img-pc': `url(${coverPc})`,
                '--background-img-mb': `url(${coverMb})`,
            }"
        >
            <div class="cover-info">
                <div class="center">
                    <h1
                        class="cover-title"
                        :style="{
                            fontFamily: config?.coverTitleFont,
                            fontSize: `${config?.coverTitleFontSize}rem`,
                        }"
                    >
                        {{ config?.coverTitle }}
                    </h1>
                    <div class="socials">
                        <div v-if="config?.coverTypedjs ?? false" class="typed-container">
                            <Icon :name="'fa7-solid:quote-left'" />
                            <span ref="typedRef" class="typed" />
                            <Icon :name="'fa7-solid:quote-right'" />
                        </div>
                        <div class="signature">
                            <p>
                                {{ config?.coverSignature }}
                            </p>
                        </div>
                        <HomepageSocialLinks />
                    </div>
                </div>
            </div>
        </figure>
    </div>
</template>

<style lang="scss" scoped>
.homepage-cover,
.cover,
.cover-info {
    height: 100dvh;
    width: 100dvw;
    overflow-anchor: none;
}
.cover {
    background: var(--background-img-pc);
    background-size: cover;
}
@media (max-width: 860px) {
    .cover {
        background: var(--background-img-mb);
        background-size: cover;
    }
}
.cover.transparent {
    background: transparent;
}
.cover-info {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
}
.cover-info .center {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 50rem;
}
.cover-title {
    color: #fff;
    mix-blend-mode: lighten;
}
</style>

<style scoped>
.cover-info .socials {
    width: 65%;
    padding: 1rem;
    margin-top: 1.5rem;
    line-height: 2rem;

    display: flex;
    flex-direction: column;
    justify-content: center;

    color: var(--word-color-first);
    background-color: rgb(var(--widget-background), 0.6);
    border: var(--border);
    backdrop-filter: saturate(180%) blur(10px);

    border-radius: 1rem;
    white-space: normal;
}
.typed-container,
.signature {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
