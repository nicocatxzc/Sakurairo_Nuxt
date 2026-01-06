<script setup>
const config = useThemeConfig();
const res = await useCachedFetch("friend-link", "/api/content/links");
let linksData = ref(res.data.value ?? {});
onMounted(async()=>{
    if(!linksData.value?.categories) {
        const {data,promise} = await useCachedFetch("friend-link", "/api/content/links",{
            promise:true
        });
        await promise;
        linksData.value = data.value;
    }
})

const categories = computed(() => {
    if (!linksData.value?.categories || !linksData.value?.links) return [];

    // 构建分类映射表
    const categoryMap = {};
    linksData.value.categories.forEach((cat) => {
        categoryMap[cat.id] = { ...cat, links: [] };
    });

    // 将链接快速分配到对应分类
    linksData.value.links.forEach((link) => {
        link.category_ids.forEach((catId) => {
            if (categoryMap[catId]) {
                categoryMap[catId].links.push(link);
            }
        });
    });

    // 过滤空分类 & 排序
    let categories = Object.values(categoryMap)
        .filter((cat) => cat.links.length > 0)
        .map((cat) => {
            // 分类内链接按 priority 排序
            cat.links.sort((a, b) => b.priority - a.priority);
            return cat;
        });

    // 分类按首字母排序
    categories.sort((a, b) => a.name.localeCompare(b.name));

    return categories;
});
</script>

<template>
    <div class="links">
        <ol class="categories">
            <template
                v-for="(category, index) in categories"
                :key="category?.id ?? index"
            >
                <h3 :id="category?.name" class="category-title">
                    {{ category?.name }}
                </h3>
                <div
                    v-if="category.links.length"
                    :key="category.id"
                    class="category"
                >
                    <div
                        v-for="link in category.links"
                        :key="link.id"
                        class="link"
                    >
                        <a
                            :href="link.url"
                            target="_blank"
                            rel="noopener"
                            class="link-content flex-center"
                        >
                            <ElAvatar class="avatar">
                                <NuxtImg
                                    v-if="link.image"
                                    :placeholder="config?.missingAvatarPlaceholder ?? ''"
                                    :src="link.image"
                                    alt=""
                                />
                            </ElAvatar>

                            <p class="name">{{ link.name }}</p>
                            <p class="desc">{{ link.description }}</p>
                        </a>
                    </div>
                </div>
            </template>
        </ol>
    </div>
</template>

<style lang="scss" scoped>
.links {
    width: 100%;
    .categories {
        display: flex;
        flex-direction: column;
    }
}
.category {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    .link {
        width: 10rem;
        padding: 0.75rem;
        border-radius: 0.5rem;
        border: var(--border-shine);
        background-color: rgba(var(--widget-background), 0.5);
        transition: all 0.5s ease-in-out;
    }
}
.link-content {
    flex-direction: column;
    .avatar {
        width: 6rem;
        height: 6rem;
        box-shadow: var(--widget-shadow-shadow);
        transform: rotate(0);
        transition: transform 0.5s ease-in-out;
    }
    .name {
        font-size: 1.25rem;
        margin-top: 0.5rem;
        display: block;
        max-width: calc(100% - 1rem);
    }
    .desc {
        font-size: 0.8rem;
        max-width: 100%;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
.link:hover {
    box-shadow: var(--widget-shadow-shining);
    .avatar {
        transform: rotate(360deg);
    }
}
</style>
