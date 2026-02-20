<script lang="ts" setup>
const { dataInfo } = defineProps({
    dataInfo: {
        type: String,
        required: true,
    },
});
const videos = computed(() => {
    try {
        return JSON.parse(dataInfo);
    } catch (error) {
        return {
            av: [],
            bv: [],
        };
    }
});
</script>

<template>
    <div class="block-bvideo">
        <iframe
            class="bvideo"
            scrolling="no"
            sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"
            allowfullscreen
            v-for="video in videos.av"
            :src="`https://player.bilibili.com/player.html?avid=${video}&page=1&autoplay=0&danmaku=0`"
            frameborder="0"
            :key="video"
        ></iframe>
        <iframe
            class="bvideo"
            scrolling="no"
            sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"
            allowfullscreen
            v-for="video in videos.bv"
            :src="`https://player.bilibili.com/player.html?bvid=${video}&page=1&autoplay=0&danmaku=0`"
            frameborder="0"
            :key="video"
        ></iframe>
    </div>
</template>

<style lang="scss" scoped>
.block-bvideo {
    position: relative;
    padding: 30% 45%;
    .bvideo {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
    }
}
</style>
