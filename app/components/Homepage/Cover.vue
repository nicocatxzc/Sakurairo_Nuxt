<script setup>
import Typed from "typed.js";

let config = useThemeConfig();

const typedRef = useTemplateRef("typedRef");

onMounted(() => {
    let typed
    try{
        typed = new Typed(typedRef.value, JSON.parse(config.value.typedjs));
    } catch(e) {
        ElMessage.error(`typedjs初始化失败,错误详情${e}`)
    }

    onUnmounted(() => {
        typed.destroy();
    });
});
</script>

<template>
    <div class="homepage-cover">
        <figure class="cover">
            <NuxtImg
                src="https://moeapi.moecat.cc/imgs/pc/img/s22.webp"
                alt="homepage cover"
                class="cover-image"
            />
            <div class="cover-info">
                <div class="center">
                    <h1
                        class="cover-title"
                        :style="{
                            fontSize: `${config?.cover_title_font_size}rem`,
                        }"
                    >
                        {{ config?.cover_title }}
                    </h1>
                    <div class="socials">
                        <div class="typed-container">
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

<style scoped>
.homepage-cover,
.cover,
.cover-image,
.cover-info {
    height: 100dvh;
    width: 100dvw;
}
.cover-image {
    object-fit: cover;
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

<style>
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
