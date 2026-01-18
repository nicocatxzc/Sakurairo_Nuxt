<script setup>
const itemList = ref([]);

// 载入分类列表
const favlistAllData = await useCachedFetch(
    "bilibili-favlist-all",
    "/api/content/fav/bilibili/favlist-all",
    {
        promise: true,
    }
);
const favlistAll = computed(() => favlistAllData.data.value.list ?? []);
console.log(favlistAll.value);
// 载入分类
const currentCategory = ref(favlistAll.value[0]?.id);
async function loadCategory(id = currentCategory.value, page = 1) {
    const cateData = await useCachedFetch(
        `bilibili-favlist-${id}-${page}`,
        "/api/content/fav/bilibili/favlist",
        {
            promise: true,
            fetchOptions: {
                query: {
                    favId: id,
                    page,
                },
            },
        }
    );
    itemList.value = cateData.data.value?.medias ?? [];
}
await loadCategory();
console.log(itemList.value);
</script>

<template>
    <div class="page-favlist flex-center">
        <div class="categories flex-center">
            <button
                v-for="(category, index) in favlistAll"
                :key="index"
                class="category"
                @click="() => (currentCategory = category.id)"
            >
                {{ category.title }}
            </button>
        </div>
        <div class="fav-content">
            <div
                v-for="(item, index) in itemList"
                :key="index"
                class="fav-item"
            >
                <div class="cover">
                    <img
                        class="cover-img"
                        :src="item.cover"
                        referrerpolicy="no-referrer"
                        loading="lazy"
                        :alt="item.title"
                    />
                    <div class="cover-title">
                        <h3 class="title" :title="item.title">
                            {{ item.title }}
                        </h3>
                    </div>
                    <div class="cover-upper">
                        <span class="name">UP: {{ item.upper.name }}</span>
                    </div>
                    <div class="cover-play flex-center">
                        <div class="btn flex-center">
                            <svg
                                viewBox="0 0 24 24"
                                width="36"
                                height="36"
                                stroke="currentColor"
                                stroke-width="2"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <polygon
                                    points="10 8 16 12 10 16 10 8"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="fav-desc">
                    <span class="desc" :title="item.intro">
                        {{ item.intro?.length > 3 ? item.intro : "暂无简介" }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.container:has(.page-favlist) {
    max-width: 80rem;
}
</style>
<style lang="scss" scoped>
.page-favlist * {
    box-sizing: border-box;
}
.page-favlist {
    width: 100%;
    flex-direction: column;
    gap: 1rem;
    .categories {
        gap: 1rem;
    }
}
.categories {
    .category {
        padding: 0.5rem 1rem;
        border-radius: 2rem;
    }
}
.fav-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-content: space-evenly;
    gap: 1.5rem;
}
.fav-item {
    height: 18rem;
    width: 24rem;
    position: relative;

    display: flex;
    flex-direction: column;

    background-color: var(--widget-background-color);

    border-radius: 1rem;
    transition: transform 0.5s ease;
    overflow: hidden;

    .cover {
        width: 100%;
        aspect-ratio: calc(672 / 378);
        position: relative;
        .cover-img {
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            position: absolute;
            object-fit: cover;
        }
        .cover-title {
            top: 0;
            left: 0;
            width: 100%;
            padding: 1rem 1rem 0;
            position: absolute;

            background: linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0.6) 0%,
                rgba(0, 0, 0, 0) 100%
            );
            .title {
                margin: 0;

                color: #fff;

                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
        .cover-upper {
            font-size: 0.8rem;
            position: absolute;
            bottom: 0;
            right: 0;
            margin: 0.3rem;
            padding: 0.3rem 0.5rem;

            color: #fff;
            background: linear-gradient(
                to left,
                rgba(0, 0, 0, 0.7) 0%,
                rgba(0, 0, 0, 0.3) 100%,
                transparent
            );

            border-radius: 0.5rem;
        }
        .cover-play {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            color: #fff;

            opacity: 0;
            transition: all 0.5s ease;
            .btn {
                width: 3rem;
                height: 3rem;
                aspect-ratio: 1;
                background-color: rgba(0, 0, 0, 0.5);
                border-radius: 50%;
            }
        }
    }
    .fav-desc {
        display: block;
        padding: 1rem;
        overflow: hidden;
        .desc {
            font-size: 0.9rem;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
    &:hover {
        transform: translateY(-0.5rem);
        .cover-play {
            opacity: 1;
            transform: scale(1.5);
        }
    }
}
</style>
