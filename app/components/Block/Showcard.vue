<script lang="ts" setup>
const { dataInfo } = defineProps({
    dataInfo: {
        type: String,
        required: true,
    },
});
const card = computed(() => {
    try {
        return JSON.parse(dataInfo);
    } catch (error) {
        return {};
    }
});
</script>

<template>
    <div class="block-showcard">
        <div class="img">
            <NuxtPicture
                :src="card?.img"
                class="nuxtpic"
                :alt="card?.title"
            ></NuxtPicture>
            <NuxtLink
                :to="card?.link"
                target="_blank"
                rel="noopener noreferrer"
            >
                <button class="showcard-button" style="color:">
                    <Icon :name="'fa7-solid:angle-right'" />
                </button>
            </NuxtLink>
        </div>

        <div class="icon-title">
            <!-- <Icon :name="card?.icon"></Icon> -->
             <Icon class="icon" :name="'fa7-solid:angle-right'"></Icon>
            <span class="title" v-html="card?.title"></span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.block-showcard,
.block-showcard * {
    box-sizing: border-box;
    transition: all 0.5s ease;
}
.block-showcard {
    position: relative;
    width: 15rem;
    height: auto;
    margin: 1rem 0;
    padding: 0.5rem;
    border-radius: 0.8rem;
    box-shadow: var(--widget-shadow-shine);
    background: rgba(var(--widget-background), 0.5);
    border: var(--border-shine);

    .img {
        position: relative; /* 使按钮相对于图片定位 */
        height: 12.5rem;
        width: 12.5rem;
        margin: 0.5rem auto 0;
        border-radius: 0.8rem;
        box-shadow: var(--widget-shadow-shine);
        opacity: 1;
        overflow: hidden;

        &:hover {
            transform: scale(0.8);
            box-shadow: var(--widget-shadow-shining);
            opacity: 0.9;
        }
    }

    .icon-title {
        left: 5%;
        position: relative;
        display: inline-flex;
        overflow: hidden;
        max-width: 90%;
        width: fit-content;
        gap: 10px;
        align-items: center;
        font-size: 12px;
    }

    .showcard-button {
        position: absolute;
        margin: 0.5rem;
        top: 0;
        left: calc(100% - 0.5rem - 2rem - 0.3rem);
        width: 2rem;
        height: 2rem;
        padding: 0.3rem;
        background: rgba(var(--widget-background), 0.5);
        border: none;
        border-radius: 100%;
        backdrop-filter: saturate(180%) blur(10px);
        box-shadow: var(--widget-shadow-shine);
        transition: all 0.5s ease;
    }

    .img:hover .showcard-button {
        margin: 0;
        font-size: 2rem;
        width: 4rem;
        height: 4rem;
        top: 50%;
        left: 50%;
        right: 50%;
        transform: translate(-50%, -50%);
        box-shadow: var(--widget-shadow-shining);
        background: rgba(var(--widget-background), 0.8);
    }
}
</style>
