<script setup>
const route = useRoute();
const themeConfig = useThemeConfig();

const { data, promise, error } = await useCachedFetch(
    route.path,
    "/api/page-content",
    {
        promise: true,
        fetchOptions: {
            query: {
                path: route.path,
            },
        },
    }
);
await promise;
if (error.value) {
    throw createError({
        statusCode: 404,
        statusMessage: "Not found",
    });
}

let page = computed(() => {
    if (data.value?.type == "404") {
        showError({ statusCode: 404, statusMessage: "页面不存在" });
    }
    let canonical;
    if (data.value?.canonical) {
        canonical = useSiteOrigin() + data.value.canonical;
    } else {
        canonical = useSiteOrigin() + route.path;
    }
    return { ...data.value, canonical };
});

// 准备SEO信息和头部样式
useHead({
    meta: [
        { property: "og:url", content: page.value.canonical },
        {
            property: "og:site_name",
            content: themeConfig.value?.siteName || "未命名",
        },
    ],
    link: [
        {
            rel: "canonical",
            href: page.value.canonical,
        },
        ...(page.value?.styles?.link ?? []),
    ],
    style: [...(page.value?.styles?.style ?? [])],
});
</script>

<template>
    <section v-if="page != null && page?.type != '404'" class="main-container">
        <PagePost
            v-if="page.type === 'single' || page.type === 'page'"
            :page="page"
        />
        <PageTaxonomy
            v-if="page.type === 'category' || page.type === 'tag'"
            :page="page"
        />
        <PageAuthor v-if="page.type === 'author'" :page="page" />
    </section>
</template>

<style scoped>
section.main-container {
    min-height: 85dvh;
}
</style>
