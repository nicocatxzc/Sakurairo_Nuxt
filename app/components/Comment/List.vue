<script setup>
const props = defineProps({
    postId: {
        type: Number,
        required: true,
    },
    commentsCount: {
        type: Number,
        required: true,
    },
    couldComment: {
        type: String,
        default: "open",
    },
});
const couldComment = computed(() =>
    props.couldComment == "open" ? true : false
);
let comments = ref([]); // 评论列表
let after = ref(null); // 供查询的索引
let page = ref(1); // 当前页
let cursor = ref([null]); // 分页索引
const hasNextPage = ref(false);

let stopwatch = watch(
    () => [page.value],
    async () => {
        let query = {
            postId: props.postId,
        };
        if (after.value) {
            query.after = after.value;
        }
        const { data, promise, error } = await useCachedFetch(
            `comments-${props.postId}-${page.value}`,
            "/api/comments",
            {
                promise: true,
                fetchOptions: {
                    query: {
                        ...query,
                    },
                },
            }
        );
        await promise;
        console.log(data.value);
        if (error.value) {
            ElMessage.error("评论加载出错");
        }
        if (data.value?.comments) {
            comments.value = [...data.value.comments.nodes];
            const pageInfo = data.value.comments.pageInfo;
            hasNextPage.value = pageInfo.hasNextPage;
            if (pageInfo.hasNextPage) {
                after.value = pageInfo.endCursor;
                cursor.value[page.value] = pageInfo.endCursor;
            } else {
                // 已经是末页
                hasNextPage.value = false;

                // 不允许推进
                after.value = null;
            }
        }
    },
    {
        immediate: true,
    }
);
onUnmounted(() => {
    stopwatch();
});

const pageList = computed(() => {
    let loaded;
    if (hasNextPage.value) {
        loaded = cursor.value.length - 1;
    } else {
        loaded = cursor.value.length;
    }

    const lastPage = hasNextPage.value ? loaded + 1 : loaded;
    const start = Math.max(1, lastPage - 4);
    const pages = [];

    for (let i = start; i <= lastPage; i++) {
        pages.push(i);
    }
    return {
        pages,
        lastPage,
    };
});
</script>

<template>
    <template v-if="couldComment">
        <h3 class="comment-list-title">
            Comments
            <span class="comment-count"
                >{{ props.commentsCount || 0 }} 条评论</span
            >
        </h3>
        <ul v-if="Boolean(props.postId)" class="comment-list">
            <CommentCard
                v-for="(comment, index) in comments"
                :key="index"
                :comment="comment"
            />
        </ul>
        <div v-if="pageList.pages.length != 1" class="comment-pagination">
            <!-- 跳到首页 -->
            <span v-if="page !== 1" class="page-item" @click="page = 1">
                {{ "<" }}
            </span>

            <!-- 页码 -->
            <span
                v-for="p in pageList.pages"
                :key="p"
                class="page-item"
                :class="{ active: p === page }"
                @click="page = p"
            >
                {{ p }}
            </span>

            <!-- 跳到末页 -->
            <span
                v-if="page !== pageList.lastPage"
                class="page-item"
                @click="page = pageList.lastPage"
            >
                {{ ">" }}
            </span>
        </div>
        <ClientOnly>
            <CommentForm />
        </ClientOnly>
    </template>
</template>

<style scoped>
.comment-list-title {
    margin: 2rem auto;
    font-size: 1.25rem;
    font-weight: bold;
}
.comment-count {
    font-size: 0.8rem;
    color: #707070;
    margin-left: 0.65rem;
}
.comment-list {
    list-style: none;
}
.comment-pagination {
    width: 100%;
    display: flex;
    justify-content: center;
}
.page-item {
    font-size: 1rem;
    line-height: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: content-box;
    min-width: 1.5rem;
    min-height: 1.5rem;
    padding: 0.5rem;
    cursor: pointer;
    font-weight: bold;
    transform: translateZ(0px);
    border-radius: 48px;
}
.page-item.active,
.page-item:hover {
    background-color: var(--widget-background-color);
}
</style>
