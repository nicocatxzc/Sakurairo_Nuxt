<script setup>
const api = {
    key: "post-list-homepage",
    url: "/api/posts",
    option: {
        promise: true,
    },
};
const { data, promise } = useCachedFetch(api.key, api.url, api.option);
await promise;
const posts = computed(() => (data.value?.posts ? data.value.posts : {}));
</script>

<template>
    <HomepageCover />
    <ContentContainer>
        <PostList :post-list="posts" :api="api"/>
    </ContentContainer>
</template>

<style scoped></style>
