<script setup>
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
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, length)
}

function getDesc() {
    let desc;
    if(post.value?.excerpt && post.value?.excerpt !='') desc = post.value?.excerpt
    if(post.value?.content && post.value?.content !='') desc = generateDescription(post.value?.content)
    if(themeConfig.value?.siteSeoDesc && themeConfig.value?.siteSeoDesc !='') desc = themeConfig.value?.siteSeoDesc
    if(themeConfig.value?.siteDesc && themeConfig.value?.siteDesc !='') desc = themeConfig.value?.siteDesc

    if(!desc) desc = "这家伙很懒,什么都没有写"
    return desc
}

const $img = useImage();
const title = post.value?.title || themeConfig.value?.siteName || "未命名";
const icon = themeConfig.value?.siteLogo || themeConfig.value?.navLogo || `${useSiteOrigin()}/favicon.ico`

let ogImageUrl;
if(post.value?.featuredImage?.node?.sourceUrl) {
    const nuxtImg = $img(post.value.featuredImage?.node?.sourceUrl, {
      width: 1200,
      height: 630,
      fit: 'cover',
      format: 'jpg',
      quality: 85
    })
    ogImageUrl = `${useSiteOrigin()}${nuxtImg}`
}

useHead({
    title:title,
    meta: [
        { name: "description", content: getDesc() },
        { property: "og:title", content: title },
        { property: "og:image", content: ogImageUrl || icon },
        { property: "og:url", content: props.page.canonical},
        { property: "og:type", content: 'article' },
    ]
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
        <CommentList :post-id="props.page.id" :comments-count="post?.commentCount ?? 0" :could-comment="post.commentStatus"/>
    </ContentContainer>
</template>

<style scoped></style>
