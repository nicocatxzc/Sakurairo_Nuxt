<script setup>
const api = {
    key: "post-list-homepage",
    url: "/api/posts",
    option: {
        promise: true,
    },
};
const themeConfig = useThemeConfig();
const { data, promise } = await useCachedFetch(api.key, api.url, api.option);
await promise;
const posts = computed(() => (data.value?.posts ? data.value.posts : {}));

const title = themeConfig.value?.siteName || "未命名";
const desc =
    themeConfig.value?.siteSeoDesc ||
    themeConfig.value?.siteDesc ||
    "这家伙很懒,什么都没有写";
const icon =
    themeConfig.value?.siteLogo ||
    themeConfig.value?.navLogo ||
    `${useSiteOrigin()}/favicon.ico`;
useHead({
    title: title,
    meta: [
        { name: "description", content: desc },
        { name: "keywords", content: themeConfig.value?.siteSeoKeyword },
        { property: "og:locale", content: "zh_CN" },
        { property: "og:title", content: title },
        { property: "og:image", content: icon },
        { property: "og:url", content: `${useSiteOrigin()}/` },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: title },
    ],
    link: [
        {
            rel: "canonical",
            href: useSiteOrigin() + "/",
        },
    ],
});
</script>

<template>
    <ContentContainer
        :style="{
            '--block-title-font': themeConfig?.blockTitleFont || '',
            '--block-title-position': themeConfig?.blockTitlePosition || 'center'
        }"
    >
        <template
            v-for="(block, index) in themeConfig?.homepageBlock || [
                'show',
                'postlist',
                'custom',
            ]"
            :key="index"
        >
            <template v-if="block == 'show'">
                <h2 class="block-title flex-center">
                    {{ themeConfig?.showBlockTitle || "展栏" }}
                </h2>
                <HomepageShow />
            </template>
            <template v-if="block == 'postlist'">
                <h2 class="block-title flex-center">
                    {{ themeConfig?.postListBlockTitle || "文章" }}
                </h2>
                <PostList :post-list="posts" :api="api" />
            </template>
        </template>
    </ContentContainer>
</template>

<style scoped>
.block-title {
    font-size: 1.2rem;
    width: 100%;
    margin-top: 2rem;
    padding-bottom: 0.6rem;

    justify-content: var(--block-title-position);
}
</style>
