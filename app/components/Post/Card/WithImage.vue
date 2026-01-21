<script setup>
let { post } = defineProps({
    post: {
        type: Object,
        required: true,
    },
});
const config = useThemeConfig();
const localeTime = getLocalTime(post.modifiedGmt).format("LL");
function useRandom(url) {
    if(url=='') return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
const postCover = computed(() => {
    // 如果文章有封面图，直接使用
    if (post.featuredImage?.node.sourceUrl) {
        return post.featuredImage.node.sourceUrl;
    }
    
    let url;
    // 配置要求始终使用封面图且有随机图
    if (
        config.value?.postCardImageOption === "alwaysWithCover" &&
        config.value?.randomPicUrlPc
    ) {
        url= useRandom(config.value.randomPicUrlPc);
    }

    url = url ?? (useRandom(config.value?.postCardImageUrl) || "");

    // 使用默认卡片图片
    return url;
});
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
    <article class="post-card">
        <div class="post-thumb">
            <nuxt-link :to="post.uri">
                <NuxtPicture
                    :src="postCover"
                    :alt="`featured image for post ${post.title}`"
                >
                </NuxtPicture>
            </nuxt-link>
        </div>

        <div class="post-date">
            <time :datetime="post.modifiedGmt"> 更新于:{{ localeTime }} </time>
            <div v-if="post?.isSticky==true" class="sticky">&#x2605;&#xFE0E;置顶</div>
        </div>

        <div class="post-meta">
            <template
                v-for="meta in config?.postCardMetas ?? ['category', 'views']"
                :key="meta"
            >
                <span v-if="meta == 'author'">
                    <Icon :name="'fa7-solid:feather-pointed'"></Icon>
                    {{ post.author.node.nicename ?? "" }}
                </span>
                <span v-if="meta == 'category'">
                    <Icon :name="'fa7-solid:folder-open'"></Icon>
                    <NuxtLink :to="post.categories?.nodes[0].uri">
                        {{ post.categories?.nodes[0].name || "未分类" }}
                    </NuxtLink>
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

        <div class="post-title">
            <nuxt-link
                :to="post.uri"
                :aria-label="`link to post ${post.title}`"
            >
                <h3 v-html="post.title" />
            </nuxt-link>
        </div>
        <div class="post-excerpt">
            <span v-html="post.excerpt" />
        </div>
    </article>
</template>

<style lang="scss" scoped>
.post-card {
    --meta-background: #33333360;
    --meta-color: rgba(255, 255, 255, 0.8);

    animation: loading-animation 0.5s;
    width: 100%;
    height: 18.75rem;
    margin: 1rem 0;
    position: relative;
    overflow: hidden;
    background-color: var(--widget-background-color);
    box-shadow: var(--widget-shadow-shine);
    border-radius: var(--post-card-border-radius, 0.62rem);
    transition: all 0.4s cubic-bezier(0.07, 0.53, 0.65, 0.95);

    &:hover {
        box-shadow: var(--widget-shadow-shining);
        transform: translateY(-0.35rem);

        .post-thumb {
            height: 100%;

            img,
            picture,
            * {
                transform: scale(1.1);
            }
        }
    }
}

.post-thumb {
    position: absolute;
    width: 100%;
    height: 68%;
    transition: inherit;

    img,
    picture,
    * {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: inherit;
    }

    .no-image-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(
            135deg,
            var(--widget-background-color) 0%,
            #888 100%
        );
        color: var(--word-color-first);
        font-size: 1.2rem;
        padding: 1rem;
        text-align: center;
    }
}

.post-date,
.post-meta {
    position: absolute;
    padding: 0.32rem 0.62rem;
    font-size: 0.75rem;
    white-space: nowrap;
    color: var(--meta-color);
    background-color: var(--meta-background);
    border: 0.08rem solid #7d7d7d30;
    border-radius: var(--post-card-meta-border-radius, 0.4rem);
    backdrop-filter: saturate(180%) blur(10px);
}

.post-date {
    top: 1rem;
    left: 1rem;
    .sticky {
        color: gold;
    }
}

.post-meta {
    top: 1rem;
    right: 1rem;
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;

    display: flex;
    gap: 0.5rem;

    span {
        display: flex;
        align-items: center;
    }
    a {
        color: inherit;
        &:hover {
            color: var(--active-color);
        }
    }
}

.post-title {
    position: absolute;
    bottom: 22%;
    left: 2%;
    max-width: 80%;
    max-height: 34%;
    width: fit-content;
    height: fit-content;
    padding: 0.63rem 1rem;
    font-size: var(--post-card-title-font-size, 1.1rem);
    color: var(--word-color-first);
    background-color: rgba(var(--widget-background), 0.7);
    border: 0.01rem solid var(--border-shine);
    border-radius: var(--post-card-title-border-radius, 0.4rem);
    backdrop-filter: saturate(180%) blur(0.75px);
}

.post-excerpt {
    position: absolute;
    bottom: 5%;
    left: 2%;
    width: 98%;
    padding: 0 0.63rem;
    margin-top: 0.3rem;
    color: var(--word-color-first);
    overflow: hidden;

    span {
        display: inline-block;
        max-height: 3rem;
        overflow: hidden;
        text-overflow: ellipsis;
    }
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
