<script setup>
const props = defineProps({
    postList: {
        type: Object,
        required: true,
    },
    api: {
        type: Object,
        default: () => {},
    },
});

let postList = ref(props.postList);
let page = ref(1);
let api = computed(() => (props?.api?.key ? props.api : null));
let query = ref({});
let haveMore = computed(() => Boolean(postList.value?.pageInfo.hasNextPage));

const pagination = useTemplateRef("pagination");
let observer = null;
onMounted(() => {
    if (api.value == null) return;

    observer = new IntersectionObserver(
        (entires) => {
            if (entires[0]?.isIntersecting) {
                if (!haveMore.value) {
                    observer.disconnect();
                }
                loadMore();
            }
        },
        {
            threshold: 0.1,
            rootMargin: "50px",
        }
    );

    let stopwatch = watch(
        () => pagination.value,
        (newValue) => {
            if (newValue) {
                // 当元素可用时，开始观察
                observer.observe(newValue);
            }
        },
        {
            immediate: true,
        }
    );

    onUnmounted(() => {
        stopwatch();
        observer.disconnect();
    });
});

let timer = null;
let message = ref("加载更多");
function loadMore(inst = false) {
    if (inst == true) { // 清理计划并立即执行
        if (timer) {
            clearTimeout(timer);
            timer = null;
            loadPosts();
            return;
        }
    }
    if (timer) return;
    timer = setTimeout(async () => { // 设置定时计划
        await loadPosts();
        timer = null;
    }, 3000);
    async function loadPosts() {
        page.value += 1; // 页码递增
        query.value = api.value?.option?.fetchOptions?.query ?? {};
        query.value.page = page.value; // 查询附上页码
        query.value.after = postList.value.pageInfo.endCursor; // 查询附上游标

        let { data, promise, error } = useCachedFetch(
            `${api.value?.key}-${page.value}`,
            api.value?.url,
            {
                ...api.value?.option,
                fetchOptions: {
                    query: {
                        ...query.value, // 展开查询参数
                    },
                },
            }
        );
        message.value = "正在加载...";
        await promise;
        message.value = "加载更多";
        if (error.value) {
            ElMessage.error("文章加载出错");
        }
        if (data.value) {
            postList.value = {
                nodes: [...postList.value.nodes, ...data.value.posts.nodes], // 合并内容
                pageInfo: {
                    ...data.value.posts.pageInfo, // 使用最新的页码
                },
            };
        }
    }
}
const posts = computed(() => postList.value?.nodes);
</script>

<template>
    <div class="post-list">
        <template v-for="(post, index) in posts" :key="index">
            <PostCardWithImage v-if="post.featuredImage?.node?.sourceUrl" :post="post"></PostCardWithImage>
            <PostCardSimple v-else :post="post" />
        </template>
        <div v-if="api" ref="pagination" class="pagination">
            <button v-if="haveMore" @click="loadMore(true)">
                <a>{{ message }}</a>
            </button>
            <span v-if="!haveMore">没有更多了</span>
        </div>
    </div>
</template>

<style scoped>
.post-list {
    display: flex;
    flex-direction: column;
}
.pagination {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 1rem 0;
    margin: 2.5rem 0 5rem 0;
}
.pagination button {
    padding: 0.8rem 2rem;
    background-color: var(--widget-background-color);
    box-shadow: var(--widget-shadow-shine);
    border: var(--border-shine);
    border-radius: 3rem;
}
</style>
