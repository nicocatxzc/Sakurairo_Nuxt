<script lang="ts" setup>
const props = defineProps({
    post: {
        type: Object,
        default: () => {},
    },
});
const post = computed(() => props?.post);
</script>

<template>
    <div v-if="post" class="page-header">
        <NuxtImg
            :src="post.featuredImage?.node.sourceUrl"
            class="feature-image"
        />
        <header class="post-header">
            <h1 class="post-title">{{ post?.title }}</h1>
            <div class="post-metas">
                <span class="meta-time">{{ post?.modifiedGmt }}</span>
                <NuxtLink :to="`/author/${post?.author.node.slug}`">
                    <span class="meta-author">
                        <ElAvatar
                            :src="post?.author.node.avatar.url"
                            size="small"
                        />
                        {{ post?.author.node.nicename }}
                    </span>
                </NuxtLink>
            </div>
        </header>
    </div>
</template>

<style lang="scss" scoped>
.page-header {
    height: 25rem;
    position: relative;
    overflow: hidden;
    &::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(#fff0, #00000080);
        backdrop-filter: saturate(150%) blur(1px);
    }
}
.feature-image {
    width: 100vw;
    height: 25rem;
    object-fit: cover;
}
.post-header {
    color: #ffffff;
    position: absolute;
    padding: 0 0.6rem;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    bottom: 1.9rem;
    max-width: 860px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
}
.post-title {
    font-size: 2rem;
    font-weight: var(--global-font-weight);
    width: 100%;
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
    flex-wrap: wrap;
    overflow: hidden;
}
.post-metas span {
    color: #ffffff;
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
</style>
