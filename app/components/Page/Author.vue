<script setup>
const props = defineProps({
    page: {
        type: Object,
        required: true,
    },
});
let author = computed(() => {
    let { name,author_id, description, slug, avatar, post_count } = props.page;
    return { name,author_id, description, slug, avatar, post_count };
});
const api = computed(() => {
    return {
        key: `author-${author.value?.slug}`,
        url: "/api/posts",
        option: {
            promise: true,
            fetchOptions: {
                query:{
                    authorId:author.value?.author_id
                }
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
                <ElAvatar class="author-avatar" :style="{'--post-count':`'${author.post_count}'`}">
                    <NuxtImg
                        :src="author.avatar?.url_150"
                        :alt="`avatar of ${author.name}`"
                    />
                </ElAvatar>
                <div class="author-desc">
                    <h3 class="name">{{ author.name }}</h3>
                    <div class="description">
                        {{ author.description }}12345678
                    </div>
                </div>
            </div>
        </div>
        <PostList :post-list="postList" :api="api"/>
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

    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 1rem;
}
.author-avatar {
    --el-avatar-size: 4.6rem;
    position: absolute;
    top: -2.3rem;
    overflow: visible;
}
.author-avatar img {
    border-radius: 50%;
}
.author-avatar::after {
        content: var(--post-count) " \f044";
        font-family: 'FontAwesome';
        position: absolute;
        right: -0.5rem;
        bottom: 0;
        background-color: #fff;
        padding: 5px;
        border-radius: 5px;
        font-size: 12px;
        color: var(--theme-skin-matching, #505050);
        box-shadow: 0 1px 30px -4px #e8e8e8;
        background: rgba(255, 255, 255, 0.7);
        padding: 0.12rem 0.5rem;
        border-radius: 1rem;
        border: 1px solid #FFFFFF;
		backdrop-filter: saturate(180%) blur(10px);
    }
</style>
