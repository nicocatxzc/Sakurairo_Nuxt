<script lang="ts" setup>
let { post } = defineProps({
    post: {
        type: Object,
        required: true,
    },
});
const config = useThemeConfig();
const localeTime = getLocalTime(post.modifiedGmt).format("LL");
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
    <article class="post-card">
        <NuxtLink :to="post.uri">
            <h3 class="post-title">
                <span v-if="post?.isSticky == true" class="sticky">&#x2B06;&#xFE0E;</span>
                <span v-html="post.title"></span>
            </h3>
        </NuxtLink>
        <NuxtLink :to="post.uri">
            <span class="post-excerpt" v-html="post.excerpt" />
        </NuxtLink>
        <div class="post-metas">
            <div class="post-meta-date">
                <Icon :name="'fa7-solid:calendar'" class="icon" />
                <time :datetime="post.modifiedGmt">
                    更新于:{{ localeTime }}
                </time>
            </div>
            <div
                v-if="post.categories?.nodes.length != 0"
                class="post-meta-categories"
            >
                <Icon :name="'fa7-solid:folder-open'" />
                <NuxtLink
                    v-for="(category, index) in post.categories?.nodes"
                    :key="index"
                    :to="category.uri"
                    class="category"
                >
                    {{ category.name }}
                </NuxtLink>
            </div>
            <div v-if="post?.tags.nodes.length != 0" class="post-meta-tags">
                <Icon :name="'fa7-solid:tags'" class="icon" />
                <NuxtLink
                    v-for="(tag, index) in post?.tags?.nodes"
                    :key="index"
                    :to="tag.uri"
                    class="tag"
                >
                    #{{ tag.name }}
                </NuxtLink>
            </div>
            <template
                v-for="meta in config?.postCardMetas ?? ['category', 'views']"
                :key="meta"
            >
                <span v-if="meta == 'author'">
                    <Icon :name="'fa7-solid:feather-pointed'"></Icon>
                    {{ post.author.node.nicename ?? "" }}
                </span>
                <span v-if="meta == 'commentCounts'">
                    <Icon :name="'fa7-solid:comment'"></Icon>
                    {{ post.commentCounts ?? 0 }}
                </span>
                <span v-if="meta == 'views'">
                    <Icon :name="'fa7-solid:eye'"></Icon>
                    {{ post.views ?? 0 }}
                </span>
            </template>
        </div>
    </article>
</template>

<style lang="scss" scoped>
.post-card {
    --meta-background: #33333360;

    animation: loading-animation 0.5s;
    width: 100%;
    margin: 1rem 0;
    padding: 1.3rem;
    position: relative;

    display: flex;
    flex-direction: column;
    gap: 0.3rem;

    background-color: var(--widget-background-color);
    box-shadow: var(--widget-shadow-shine);
    border-radius: var(--post-card-border-radius, 0.62rem);
    overflow: hidden;

    transition: all 0.4s cubic-bezier(0.07, 0.53, 0.65, 0.95);

    &:hover {
        box-shadow: var(--widget-shadow-shining);
        transform: translateY(-0.35rem);
    }
}

.post-title {
    font-size: 1.4rem;
    line-height: 1.4;
}

.post-excerpt {
    color: var(--word-color-first);
    overflow: hidden;
    text-overflow: ellipsis;
}

.post-metas {
    font-size: 0.9rem;
    gap: 1rem;
    margin-top: 0.2rem;

    display: flex;

    color: var(--word-color-first);

    overflow: hidden;
    text-overflow: ellipsis;

    > div,
    > span {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        white-space: nowrap;
    }
}

.category,
.tag {
    margin-left: 0.3rem;
}

@keyframes loading-animation {
    from {
        opacity: 0;
        transform: translateY(5rem);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
