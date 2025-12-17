<script setup>
useHead({
    link: [
        {
            rel: "stylesheet",
            href: "/wp-blocks/style.min.css",
        },
    ],
});

const props = defineProps({
    page: {
        type: Object,
        required: true,
    },
});
let post = computed(() => {
    return props.page.content;
});
</script>

<template>
    <article v-if="post">
        <PostHeaderWithImage
            v-if="post.featuredImage?.node.sourceUrl"
            :post="post"
        />
        <PostHeader v-else :post="post" />
        <ContentContainer>
            <div class="post-content">
                <PostRender v-if="post.content" :html="post.content" />
            </div>
        </ContentContainer>
    </article>
    <ContentContainer>
        <CommentList :post-id="props.page.id" />
    </ContentContainer>
</template>

<style scoped></style>
