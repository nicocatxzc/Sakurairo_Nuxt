<script lang="ts" setup>
let { post } = defineProps({
    post: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <article class="post-card">
        <div class="post-thumb">
            <nuxt-link :to="post.uri">
                <nuxt-img :src="post.featuredImage?.node.sourceUrl" :alt="`featured image for post ${post.title}`" ></nuxt-img>
            </nuxt-link>
        </div>

        <div class="post-date">
            <span>更新于:{{ post.modifiedGmt }}</span>
        </div>

        <div class="post-meta">
            <a v-if="post.categories?.nodes[0]" :href="post.categories?.nodes[0].uri"><span>{{ post.categories?.nodes[0].name }}</span></a>
        </div>

        <div class="post-title">
          <nuxt-link :to="post.uri" :aria-label="`link to post ${post.title}`">
            <h3>{{ post.title }}</h3>
          </nuxt-link>
        </div>
        <div class="post-excerpt">
          <span>{{ post.excerpt }}</span>
        </div>
    </article>
</template>

<style scoped>
.post-card {
    --shadow:0 0.07rem 2rem -0.25rem #e8e8e8;
    --title-background:#ffffffbd;
    --meta-background:#33333360;
    --meta-color:rgba(255,255,255,0.8);
}
:root.dark{
    --title-background:rgba(51,51,51,0.7);
    --shadow:0 0.01rem 2rem -0.5rem rgba(26,26,26,0.7);
}
* {
    transition: all 0.4s cubic-bezier(0.07, 0.53, 0.65, 0.95);
}
.post-card {
    animation: loading-animation .5s;
    width: 100%;
    height: 18.75rem;
    margin: 1rem 0;
    position: relative;
    background-color: rgba(255,255,255,0.95);
    box-shadow: var(--shadow);
    border-radius: 0.62rem;
    overflow: hidden;
}
.post-card:hover {
    transform: translateY(-0.35rem);
}
.post-thumb {
    height: 68%;
    width: 100%;
    position: absolute;
}
.post-thumb * {
    object-fit: cover;
    width: 100%;
    height: 100%;
}
.post-thumb:hover {
    height: 100%;
}
.post-thumb:hover * {
    transform: scale(1.1);
}
.post-date,.post-meta {
    position: absolute;
    font-size: 0.75rem;
    white-space: nowrap;
    padding: 0.32rem 0.62rem;
    color: var(--meta-color);
    background-color: var(--meta-background);
    border: 0.08rem solid #7d7d7d30;
    border-radius: 0.4rem;
    backdrop-filter: saturate(180%) blur(10px);
}
.post-date {
    top: 1rem;
    left: 1rem;
}
.post-meta {
    top: 1rem;
    right: 1rem;
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
}
.post-title {
    position: absolute;
    bottom: 22%;
    left: 2%;
    height: fit-content;
    width: fit-content;
    max-height: 34%;
    max-width: 80%;
    padding: 0.63rem 1rem;
    background-color: var(--title-background);
    border: 0.01rem solid var(--border-color);
    border-radius:0.4rem ;
    backdrop-filter: saturate(180%) blur(0.75px);
}
.post-excerpt {
    position: absolute;
    bottom: 5%;
    left: 2%;
    width: 98%;
    height: fit-content;
    margin-top: 0.3rem;
    padding: 0 0.63rem;
    color: rgba(0,0,0,0.66);
    overflow: hidden;
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
