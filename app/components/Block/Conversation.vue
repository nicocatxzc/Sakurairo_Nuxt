<script lang="ts" setup>
const { dataInfo } = defineProps({
    dataInfo: {
        type: String,
        required: true,
    },
});
const config = useThemeConfig();
const talk = computed(() => {
    try {
        console.log(dataInfo)
        return JSON.parse(dataInfo);
    } catch (error) {
        console.log("对话信息丢失:", dataInfo);
        return {
            username: "对话信息丢失，详情参见日志",
            avatar: config.value?.missingAvatarPlaceholder || "",
            direction: "row",
            content: "对话信息解析失败",
        };
    }
});
</script>

<template>
    <div class="block-conversation">
        <div
            class="conversations-code"
            :style="{ flexDirection: talk?.direction || 'row' }"
        >
            <NuxtPicture
                :src="talk?.avatar"
                class="nuxtpic"
                :alt="talk?.username"
            ></NuxtPicture>
            <div class="conversations-code-text" v-html="talk?.content"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.block-conversation * {
    box-sizing: border-box;
    transition: all .3s ease;
}
.conversations-code {
    display: flex;
    padding: 0.5rem;

    .nuxtpic {
        border-radius: 50%;
        width: 2.5rem;
        height: 2.5rem;
    }
}

.conversations-code-text {
    margin: auto 0.5rem;
    padding: 0.5rem 0.9rem;
    color: var(--word-color-first);
    max-width: 80%;
    width: fit-content;
    font-size: 0.9rem;
    box-shadow: var(--widget-shadow-shine);
    background: rgba(var(--widget-background), 0.5);
    border-radius: 0.6rem;
    text-indent: 0;
    border: var(--border-shine);
}

.conversations-code-text:hover {
    box-shadow: var(--widget-shadow-shining);
    background: rgba(var(--widget-background), 0.8);
}
</style>
