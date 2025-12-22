<script setup>
const api = {
    key: "post-list-homepage",
    url: "/api/posts",
    option: {
        promise: true,
    },
};
const themeConfig=useThemeConfig()
const { data, promise } = await useCachedFetch(api.key, api.url, api.option);
await promise;
const posts = computed(() => (data.value?.posts ? data.value.posts : {}));

const title = themeConfig.value?.siteName || "未命名";
const desc = themeConfig.value?.siteSeoDesc || themeConfig.value?.siteDesc || "这家伙很懒,什么都没有写";
const icon = themeConfig.value?.siteLogo || themeConfig.value?.navLogo || `${useSiteOrigin()}/favicon.ico`
useHead({
    title:title,
    meta: [
        { name: "description", content: desc },
        { name: "keywords", content: themeConfig.value?.siteSeoKeyword },
        { property: "og:locale", content: "zh_CN" },
        { property: "og:title", content: title },
        { property: "og:image", content: icon },
        { property: "og:url", content: `${useSiteOrigin()}/` },
        { property: "og:type", content: 'website' },
        { property: "og:site_name", content: title },
    ],
    link:[{
        rel:"canonical",href:useSiteOrigin()+'/'
    }]
});
</script>

<template>
    <div>
        <HomepageCover />
        <ContentContainer>
            <h2 class="block-title">展栏</h2>
            <HomepageShow />
            <h2 class="block-title">破事水</h2>
            <PostList :post-list="posts" :api="api" />
        </ContentContainer>
    </div>
</template>

<style scoped>
.block-title {
    font-size: 1.2rem;
    width: 100%;
    margin-top: 2rem;

    display: flex;
    justify-content: center;
    align-items: center;

    padding-bottom: 0.6rem;
}
</style>
