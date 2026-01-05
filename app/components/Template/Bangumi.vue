<script setup>
const config = useThemeConfig();
let apiPath;
const list = ref([]);
let page = 1;
const haveNextPage = ref(false);
if (config.value?.bangumiAPIsource == "bilibili") {
    apiPath = "/api/content/fav/bangumi/bilibili";
}
if (config.value?.bangumiAPIsource == "bangumi") {
    apiPath = "/api/content/fav/bangumi/bangumi";
}
async function requestBangumi() {
    try {
        if (apiPath != "") {
            let res = await useCachedFetch(`bangumi-${page}`, apiPath, {
                fetchOptions: {
                    query: {
                        page,
                    },
                },
                promise: true,
            });
            await res.promise;
            list.value = [...list.value, ...res.data.value.data];
            haveNextPage.value = res.data.value.pagination.has_next
            page = page + 1;
            console.log(page);
        }
    } catch (e) {
        ElMessage.error("加载出错，请重试！");
        console.log(e);
    }
}
await requestBangumi();
async function loadMore() {
    await requestBangumi();
}
</script>

<template>
    <div class="page-bangumi flex-center">
        <ol class="anime-list">
            <li v-for="(item, index) in list" :key="index" class="anime-item">
                <a
                    class="anime-content"
                    href="https://bgm.tv/subject/260772"
                    target="_blank"
                    rel="nofollow"
                >
                    <img
                        class="anime-image"
                        :alt="item?.name_cn"
                        :src="item?.images"
                        referrerpolicy="no-referrer"
                        loading="lazy"
                    />
                    <div class="anime-info">
                        <h3 class="anime-title">
                            {{ item?.name_cn }}
                        </h3>
                        <div class="anime-publish-date">
                            上映日期：{{ item?.date }}
                        </div>
                        <div v-if="item?.progress != ''" class="bangumi-status">
                            <p class="status-desc">观看进度：</p>
                            <el-progress
                                v-if="typeof item.progress == 'number'"
                                :text-inside="true"
                                :stroke-width="20"
                                :percentage="item.progress"
                                status="exception"
                            />
                            <p v-else>{{ item.progress }}</p>
                        </div>
                        <div class="anime-summary">
                            {{ item?.summary }}
                        </div>
                    </div>
                </a>
            </li>
        </ol>
        <div class="pagenation flex-center">
            <button v-if="haveNextPage" @click="loadMore">加载更多</button>
            <p v-else>没有更多了</p>
        </div>
    </div>
</template>

<style>
.container:has(.post-content) {
    max-width: 80rem;
}
</style>

<style lang="scss" scoped>
.page-bangumi * {
    box-sizing: border-box;
}
.page-bangumi {
    flex-direction: column;
}
.anime-list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    list-style: none;

    .anime-item {
        width: clamp(10rem, 25dvw, 18rem);
        aspect-ratio: 3/4;
        margin: 0.5rem 1rem;

        border-radius: 0.7rem;

        overflow: hidden;
        .anime-content {
            height: 100%;
            width: 100%;
            display: block;
        }
    }
}
.anime-content {
    position: relative;
    .anime-image {
        position: absolute;
        height: 100%;
        width: 100%;
        object-fit: cover;
    }
    .anime-info {
        left: 0;
        top: calc(100% - 3rem);
        height: 100%;
        width: 100%;
        padding: 0.6rem;
        position: absolute;

        color: #fff;
        background-color: rgba(0, 0, 0, 0.5);

        transition: top 1s;
    }
    &:hover {
        .anime-info {
            top: 0;
            .anime-title {
                height: fit-content;
                white-space: wrap;
            }
        }
    }
}
.anime-info {
    .anime-title {
        margin: 0;
        height: 1.5rem;
        width: 100%;
        margin-bottom: 1rem;

        display: block;

        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .bangumi-status {
        margin: 0.5rem 0;
        p {
            color: #fff;
        }
    }
    .anime-summary {
        text-overflow: ellipsis;
        overflow: hidden;
    }
}
.pagenation {
    margin-top: 1rem;
    button {
        font-size: 1.5rem;
        padding: .5rem;

        color: var(--word-color-second);
    }
}
</style>
