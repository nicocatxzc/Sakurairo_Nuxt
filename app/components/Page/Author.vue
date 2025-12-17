<script setup>
const props = defineProps({
    page: {
        type: Object,
        required: true,
    },
});
let author = computed(() => {
    let { name, author_id, description, slug, avatar, post_count } = props.page;
    return { name, author_id, description, slug, avatar, post_count };
});
const api = computed(() => {
    return {
        key: `author-${author.value?.slug}`,
        url: "/api/posts",
        option: {
            promise: true,
            fetchOptions: {
                query: {
                    authorId: author.value?.author_id,
                },
            },
        },
    };
});
let postList = computed(() => {
    if (props.page?.content?.nodes) {
        return props.page.content;
    } else {
        return { nodes: [] };
    }
});
</script>

<template>
    <ContentContainer>
        <div class="author-info-container">
            <div class="author-info">
                <ElAvatar
                    class="author-avatar"
                    :style="{ '--post-count': `'${author.post_count}'` }"
                >
                    <NuxtImg
                        :src="author.avatar?.url_150"
                        :alt="`avatar of ${author.name}`"
                    />
                </ElAvatar>
                <div class="author-desc">
                    <h3 class="name">{{ author.name }}</h3>
                    <div class="description">
                        {{ author.description }}
                    </div>
                </div>
            </div>
        </div>
        <PostList :post-list="postList" :api="api" />
    </ContentContainer>
</template>

<style scoped>
.author-info-container {
    position: relative;
    overflow: hidden;
    padding-top: 8rem;
}
.author-info {
    margin: 5rem auto;
    position: relative;
    height: 6.8rem;
    width: fit-content;
    min-width: 12.5rem;
    max-width: 70%;
    padding: 0.8rem;

    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    background-color: rgba(var(--widget-background), 0.5);
    border: var(--border);
    border-radius: 1rem;
}
.author-avatar {
    --el-avatar-size: 4.6rem;
    position: absolute;
    top: -2.5rem;
    overflow: visible;
}
.author-avatar img {
    border-radius: 50%;
}
.author-avatar::after {
    content: var(--post-count) "🖊";
    position: absolute;
    right: -0.5rem;
    bottom: 0;
    padding: 0.3rem;
    border-radius: 0.3rem;
    font-size: 0.75rem;
    color: var(--active-color);
    box-shadow: var(--widget-shadow-shine);
    background: var(--widget-background-color);
    padding: 0.12rem 0.5rem;
    border-radius: 1rem;
    border: var(--border-color-shine);
    backdrop-filter: saturate(180%) blur(10px);
}
.author-desc {
    margin-top: 1rem;
}
</style>
