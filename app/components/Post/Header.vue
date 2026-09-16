<script lang="ts" setup>
const props = defineProps({
    post: {
        type: Object,
        default: () => { },
    },
});
const post = computed(() => props?.post);
const localeTime = getLocalTime(post.value?.modifiedGmt).format("LLL");
</script>

<template>
    <div v-if="post" class="page-header only-word">
        <ContentContainer>
            <header class="post-header">
                <h1 class="post-title">{{ post?.title }}</h1>
                <div class="post-metas">
                    <span class="meta-time">更新于:{{ localeTime }}</span>
                    <NuxtLink :to="`/author/${post?.author.node.slug}`">
                        <span class="meta-author">
                            <ElAvatar :src="post?.author.node.avatar.url" size="small" />
                            {{ post?.author.node.nicename }}
                        </span>
                    </NuxtLink>
                </div>
            </header>
        </ContentContainer>
    </div>
</template>

<style scoped>
.page-header.only-word {
    position: relative;
    overflow: hidden;
    padding-top: 8rem;

    .post-header {
        text-align: center;
        margin: auto;
        display: flex;
        flex-direction: column;
    }

    .post-title {
        font-size: 1.5rem;
        font-weight: var(--global-font-weight);
    }

    .post-metas {
        gap: 0.13rem 1rem;
        font-size: 0.82rem;
        font-weight: var(--global-font-weight);
        padding: 0.75rem 0 0;
        line-height: 2rem;
        width: 100%;
        max-height: 2.5rem;
        max-width: 98%;
        display: inline-flex;
        justify-content: center;
        flex-wrap: wrap;
        overflow: hidden;
    }

    .post-metas span {
        display: flex;
    }

    .meta-author {
        display: flex;
        gap: 0.3rem;
        align-items: center;
    }

    .meta-author:hover {
        color: var(--active-color);
    }
}
</style>
