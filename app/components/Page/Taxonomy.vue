<script setup>
const props = defineProps({
    page: {
        type: Object,
        required: true,
    },
});
const api = computed(() => {
    let query = {};
    if (props.page?.type == "category") {
        query.categoryId = props.page.id;
    }
    if (props.page?.type == "tag") {
        query.tagId = props.page.id;
    }
    return {
        key: `taxonomy-${props.page?.title}`,
        url: "/api/posts",
        option: {
            promise: true,
            fetchOptions: {
                query,
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
    <div class="page-taxonomy">
        <ContentContainer>
            <header class="taxonomy-header">
                <h1>{{ props.page?.title }}</h1>
                <p>{{ props.page?.description }}</p>
            </header>
            <PostList :post-list="postList" :api="api" />
        </ContentContainer>
    </div>
</template>

<style scoped>
.page-taxonomy {
    position: relative;
    overflow: hidden;
    padding-top: 8rem;
}
.taxonomy-header {
    position: relative;
    text-align: center;
    margin-bottom: 6.5%;
}
</style>
