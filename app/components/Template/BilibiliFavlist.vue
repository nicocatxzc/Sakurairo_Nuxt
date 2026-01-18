<script setup>
const itemList = ref([]);

// 载入分类列表
const favlistAllData = await useCachedFetch(
    "bilibili-favlist-all",
    "/api/content/fav/bilibili/favlist-all",
    {
        promise: true,
    },
);
const favlistAll = computed(() => favlistAllData.data.value.list ?? []);

// 载入分类
const currentCategory = ref(favlistAll.value[0]?.id);

const currentPage = ref(1);
const pageCount = ref(1);

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
        },
    );
    await cateData.promise;
    itemList.value = cateData.data.value?.medias ?? [];
    pageCount.value = cateData.data.value?.pagination.total_pages;
}
await loadCategory();
const pageLoading = ref(false);
watch([() => currentPage.value, () => currentCategory.value], async () => {
    pageLoading.value = true;
    await loadCategory(currentCategory.value, currentPage.value);
    setTimeout(() => {
        pageLoading.value = false;
    }, 1);
});
</script>

<template>
    <div class="page-favlist flex-center">
        <div class="categories flex-center">
            <button
                v-for="(category, index) in favlistAll"
                :key="index"
                class="category"
                :class="{
                    active: currentCategory == category.id,
                }"
                @click="
                    () => {
                        currentPage = 1;
                        currentCategory = category.id;
                    }
                "
            >
                {{ category.title }}
            </button>
        </div>
        <div class="fav-content">
            <div
                v-for="(item, index) in itemList"
                :key="index"
                class="fav-item"
                :class="{
                    loaded: !pageLoading,
                }"
            >
                <a
                    :href="`https://www.bilibili.com/video/${item.bvid}`"
                    target="_blank"
                    rel="noopener noreferrer"
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
                            {{
                                item.intro?.length > 3 ? item.intro : "暂无简介"
                            }}
                        </span>
                    </div>
                </a>
            </div>
        </div>
        <el-pagination
            v-model:current-page="currentPage"
            class="pagination"
            :page-count="pageCount"
            :disabled="pageLoading"
            layout="prev, pager, next"
        />
    </div>
</template>
<style lang="scss">
.container:has(.page-favlist) {
    max-width: 80rem;
    .el-pagination {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
        gap: 1rem;
        --el-pagination-bg-color: var(--widget-background-color);
        --el-pagination-hover-color: var(--active-color);
        .el-pager {
            gap: 1rem;
        }
        .btn-prev,
        .el-pager .number,
        .btn-next,
        .btn-quicknext,
        .btn-quickprev {
            box-sizing: border-box;
            font-size: 1rem;
            line-height: 1rem;
            width: 3rem;
            height: 3rem;
            padding: 0.5rem;
            aspect-ratio: 1;
            cursor: pointer;
            font-weight: bold;
            transform: translateZ(0px);
            border-radius: 48px;
        }
    }
}
</style>

<style lang="scss" scoped>
.page-favlist,
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
        border: var(--border-shine);
        transition: all .3s ease;
        &.active,&:hover {
            color: #fff;
            background-color: var(--active-color);
            border-color: var(--active-color);
        }
        &:hover {
            box-shadow: var(--widget-shadow-shadow);
            transform: translateY(-0.1rem);
        }
    }
}
.fav-content {
    margin: 0 2rem;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    justify-content: space-evenly;
    gap: 1.5rem;
    @media (min-width: 40rem) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 60rem) {
        grid-template-columns: repeat(3, 1fr);
    }
    @media (min-width: 82.5rem) {
        grid-template-columns: repeat(4, 1fr);
    }
}
.fav-item {
    width: 100%;
    aspect-ratio: 8/6;
    position: relative;

    display: flex;
    flex-direction: column;

    background-color: var(--widget-background-color);

    border-radius: 1rem;
    transition: all 0.5s ease;
    overflow: hidden;

    &.loaded {
        animation: fade-in 0.5s ease;
    }
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
                height: 25%;
                aspect-ratio: 1;
                background-color: rgba(0, 0, 0, 0.5);
                border-radius: 50%;
            }
        }
    }
    .fav-desc {
        display: block;
        padding: 0.5rem;
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
        box-shadow: var(--widget-shadow-shadow);
        transform: translateY(-0.5rem);
        .cover-play {
            opacity: 1;
            transform: scale(1.5);
        }
    }
}
@keyframes fade-in {
    0% {
        opacity: 0;
        transform: translateY(-1rem);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
