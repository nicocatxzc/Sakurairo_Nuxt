<script setup>
const res = await useCachedFetch("archive-data", "/api/content/archive", {
    promise: true,
});
await res.promise;

const archiveData = computed(() => res.data.value);

const showCount = ref(0);
let stop = null;

watch(
    () => archiveData.value?.data?.posts?.nodes?.length,
    (len) => {
        if (!len || stop) return;

        const { pause } = useInterval(50, {
            callback: () => {
                showCount.value++;
                if (showCount.value >= len) {
                    pause();
                    stop = null;
                }
            },
            controls: true,
        });

        stop = pause;
    },
    { immediate: true },
);
</script>

<template>
    <div class="archive">
        {{ showOrder }}
        <ol class="list">
            <li
                v-for="(item, index) in archiveData.data.posts.nodes"
                :key="item.dateGmt"
                class="item"
                :class="{ show: index < showCount }"
            >
                <NuxtLink :to="item.uri">{{ item.title }}</NuxtLink>
                <time :datetime="item.dateGmt">{{
                    getLocalTime(item.dateGmt).format("LL")
                }}</time>
            </li>
        </ol>
    </div>
</template>

<style lang="scss" scoped>
.list {
    list-style: none;
    .item {
        position: relative;
        display: flex;
        justify-content: space-between;
        opacity: 0;
        &.show {
            animation: fade-in 1s ease forwards;
        }

        &::before {
            content: "";
            position: absolute;
            top: 0;
            left: -0.5rem;
            bottom: 0;
            border-left: 0.1rem solid var(--active-color);
        }
        &:first-child::before {
            top: 50%;
        }
        &:last-child::before {
            top: 0;
            bottom: 50%;
        }
        &::after {
            content: "";
            height: 0.5rem;
            width: 0.5rem;
            position: absolute;
            top: 50%;
            left: -0.7rem;
            background-color: var(--active-color);
            border-radius: 50%;

            transform: translateY(-50%);
        }
    }
}
@keyframes fade-in {
    0% {
        opacity: 0;
        transform: translateY(-20%);
    }
    50% {
        opacity: 0.5;
        transform: translateY(-80%);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
