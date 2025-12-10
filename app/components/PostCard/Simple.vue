<script lang="ts" setup>
let { post } = defineProps({
    post: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <!-- eslint-disable vue/no-v-html -->
    <article class="post-card">
        <NuxtLink :to="post.uri">
            <h3 class="post-title">
                {{ post.title }}
            </h3>
        </NuxtLink>
        <NuxtLink :to="post.uri">
            <span v-html="post.excerpt" />
        </NuxtLink>
        <div class="post-metas">
            <div class="post-meta-date">
                <Icon :name="'fa7-solid:calendar'" class="icon" />
                <time :datetime="post.modifiedGmt">{{ post.modifiedGmt }}</time>
            </div>
            <div v-if="post.categories?.nodes.length != 0" class="post-meta-categories">
                <Icon :name="'fa7-solid:folder-open'" />
                <NuxtLink
                    v-for="(category, index) in post.categories?.nodes"
                    :key="index"
                    :to="category.uri"
                    class="category"
                    >{{ category.name }}</NuxtLink
                >
            </div>
            <div v-if="post?.tags.nodes.length != 0" class="post-meta-tags">
                <Icon :name="'fa7-solid:tags'" class="icon" />
                <NuxtLink
                    v-for="(tag, index) in post?.tags?.nodes"
                    :key="index"
                    :to="tag.uri"
                    class="tag"
                >
                    {{ tag.name }}
                </NuxtLink>
            </div>
        </div>
    </article>
</template>

<style scoped>
.post-card {
    --meta-background: #33333360;
    --meta-color: rgba(255, 255, 255, 0.8);
}
* {
    transition: all 0.4s cubic-bezier(0.07, 0.53, 0.65, 0.95);
}
.post-card {
    animation: loading-animation 0.5s;
    width: 100%;
    margin: 1rem 0;
    padding: 1.3rem;
    position: relative;

    display: flex;
    flex-direction: column;
    gap: 0.3rem;

    background-color: var(--widget-background-color);
    box-shadow: var(--widget-shadow);
    border-radius: 0.62rem;
    overflow: hidden;
}
.post-card:hover {
    box-shadow: var(--widget-shine);
    transform: translateY(-0.35rem);
}
.post-metas {
    display: flex;
    gap: 1rem;
    margin-top: 0.2rem;
    overflow: hidden;
    text-overflow: ellipsis;
}
.post-title {
    font-size: 1.4rem;
    color: var(--main-word-color);
}
.post-excerpt {
    color: var(--main-word-color);
    overflow: hidden;
    text-overflow: ellipsis;
}

@keyframes loading-animation {
    0% {
        opacity: 0;
        transform: translateY(5rem);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
