<script setup>
import { Search } from "@element-plus/icons-vue";
const config = useThemeConfig()
const modelStore = useModelStore();
const form = useTemplateRef("searchModel");
const keyword = ref("");
let localSearch = null;
const postList = ref([]);
onMounted(() => {
    onClickOutside(form.value, () => {
        modelStore.search = false;
    });
    document.addEventListener("pjax:complete",()=>{
        modelStore.search = false;
    })
    watch([() => keyword.value, () => modelStore.search], () => {
        if (modelStore.search) {
            initData();
        }
        postList.value = localSearch?.search(keyword.value) || [];
    });
});
function gotoSearch() {
    navigateTo(`/search?keyword=${keyword.value}`)
}
let inited = false;
async function initData() {
    if (inited) return;
    if (!config?.liveSearchLocalIndex) return
    localSearch = await useLocalSearch();
    inited = true;
}
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
    <div
        ref="searchModel"
        class="search-model flex-center"
        :class="{
            show: modelStore.search,
        }"
    >
        <div class="search-header flex-center">
            <h3 class="search-title">搜索</h3>
            <div class="close button" @click="modelStore.search=false">
                <Icon :name="'fa7-solid:close'" class="icon"></Icon>
            </div>
            <el-input
                v-model="keyword"
                class="search-input"
                placeholder="想找点什么呢?"
                :prefix-icon="Search"
                @keyup.enter="gotoSearch"
            />
            <!-- <span v-if="keyword?.length > 1" class="tip">#按Enter键继续</span> -->
        </div>
        <div class="search-list flex-center">
            <ul class="post-list">
                <li
                    v-for="(item, index) in postList"
                    :key="index"
                    class="post-item"
                >
                    <NuxtLink :to="item.uri">
                        <header class="item-title" v-html="item.title"></header>
                        <span class="snip" v-html="item.snip"> </span>
                    </NuxtLink>
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.search-model {
    position: fixed;
    visibility: hidden;
    opacity: 0;
    top: 10%;
    left: 50%;
    padding: 1rem;
    width: 37.5rem;
    margin-left: -18.75rem;
    border-radius: 0.5rem;

    flex-direction: column;

    background-color: rgba(var(--widget-background),.9);

    transform: scale(0.9);
    transition: all .3s ease-in-out;
    &.show {
        visibility: visible;
        opacity: 1;

        transform: scale(1);
        display: flex;
    }
    .search-header {
        width: 100%;

        flex-direction: column;
    }
}
.search-header {
    .search-title {
        width: 100%;
    }
    .close.button {
        position: absolute;
        right: 1rem;
        top: 1rem;
        .icon {
            background-color: var(--word-color-first);
            transform: scale(1.5);
            cursor: pointer;
            &:hover {
                background-color: var(--active-color);
            }
        }
    }
    .tip {
        font-weight: 400;
        width: 100%;
        color: var(--word-color-second);
    }
}
.search-list {
    width: 100%;
    margin-top: 1rem;
    .post-list {
        list-style: none;
        max-height: 70dvh;
    }
}
.post-list {
    width: 100%;
    gap: 1rem;
    overflow: auto;
    .post-item {
        width: 100%;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        border: var(--border-sketch);

        background-color: var(--widget-background-color);
    }
}
</style>
