<script setup>
import mediumZoom from "medium-zoom";
const themeConfig = useThemeConfig();
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

// 准备SEO信息
function generateDescription(content, length = 125) {
    return content
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, length);
}

function getDesc() {
    const seoSource = themeConfig.value?.siteSeoSource ?? ["excerpt"];
    // 摘要
    if (post.value?.excerpt && post.value.excerpt.trim() !== "" && seoSource.includes("excerpt")) {
        return post.value.excerpt.replace(/<[^>]*>/g, '');
    }
    
    // 正文截取
    if (post.value?.content && post.value.content.trim() !== "" && seoSource.includes("postContent")) {
        return generateDescription(post.value.content);
    }
    
    // 站点配置描述
    if (themeConfig.value?.siteSeoDesc && themeConfig.value.siteSeoDesc.trim() !== "" && seoSource.includes("siteSeoDesc")) {
        return themeConfig.value.siteSeoDesc;
    }
    
    // 站点原始描述
    if (themeConfig.value?.siteDesc && themeConfig.value.siteDesc.trim() !== "" && seoSource.includes("siteDesc")) {
        return themeConfig.value.siteDesc;
    }
    
    return "这家伙很懒,什么都没有写";
}

const $img = useImage();
const title = post.value?.title || themeConfig.value?.siteName || "未命名";
const icon =
    themeConfig.value?.siteLogo ||
    themeConfig.value?.navLogo ||
    `${useSiteOrigin()}/favicon.ico`;

let ogImageUrl;
if (post.value?.featuredImage?.node?.sourceUrl) {
    const nuxtImg = $img(post.value.featuredImage?.node?.sourceUrl, {
        width: 1200,
        height: 630,
        fit: "cover",
        format: "jpg",
        quality: 85,
    });
    ogImageUrl = `${useSiteOrigin()}${nuxtImg}`;
}

useHead({
    title: title,
    meta: [
        { name: "description", content: getDesc() },
        { property: "og:title", content: title },
        { property: "og:image", content: ogImageUrl || icon },
        { property: "og:url", content: props.page.canonical },
        { property: "og:type", content: "article" },
    ],
});
let zoom;
onMounted(() => {
    zoom = mediumZoom("[data-zoomable]", {
        background: "#0000001a",
    });
    onBeforeUnmount(() => {
        zoom.detach();
    });
});
</script>

<template>
    <article v-if="post" class="post">
        <PostHeaderWithImage
            v-if="post.featuredImage?.node.sourceUrl"
            :post="post"
        />
        <PostHeader v-else :post="post" />
        <ContentContainer>
            <div class="post-content">
                <PostRender v-if="post.content" :html="post.content" />
            </div>
            <ClientOnly>
                <PostToc
                    v-if="
                        (themeConfig?.postTableOfContent &&
                            props.page.type == 'single') ||
                        (themeConfig?.pageTableOfContent &&
                            props.page.type == 'page')
                    "
                    class="toc"
                />
            </ClientOnly>
        </ContentContainer>
    </article>
    <ContentContainer>
        <CommentList
            :post-id="props.page.id"
            :comments-count="post?.commentCount ?? 0"
            :could-comment="post.commentStatus"
        />
    </ContentContainer>
</template>

<style lang="scss" scoped>
article.post {
    width: 100%;
}
.post-content {
    width: 100%;
    margin-top: 1rem;
}
.toc {
    flex-shrink: 0;
}
</style>
<style>
.medium-zoom-image {
    z-index: 999;
}
</style>
