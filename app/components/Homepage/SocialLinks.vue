<script setup>
let config = useThemeConfig();
const socials = config.value?.socialLinks || [];

let group = ref(8);
let pagerRef = null;
let currentPage = ref([]);
const canPagination = computed(() => socials.length > group.value); // 当总数不足以分组时不提供翻页

onMounted(() => {
    group.value = getPageSizeByWidth(window.innerWidth);
    pagerRef = new Pager(socials.length, group.value);
    currentPage.value = pagerRef.currentPage.value;

    window.addEventListener("resize", () => {
        // 重新初始化翻页对象
        group.value = getPageSizeByWidth(window.innerWidth);
        pagerRef = new Pager(socials.length, group.value);
        currentPage.value = pagerRef.currentPage.value;
    });
});

const state = ref("next");
function prev() {
    pagerRef.prev();
    state.value = "prev";
    currentPage.value = pagerRef.currentPage.value;
}
function next() {
    pagerRef.next();
    state.value = "next";
    currentPage.value = pagerRef.currentPage.value;
}
</script>

<script>
function getPageSizeByWidth(width) {
    if (width < 310) return 1;
    if (width < 360) return 2;
    if (width < 410) return 3;
    if (width < 460) return 4;
    if (width < 510) return 5;
    if (width < 560) return 6;
    if (width < 610) return 7;
    return 8;
}
class Pager {
    constructor(total, pageSize) {
        this.total = total;
        this.pageSize = pageSize;
        this.pages = [];
        this.currentIndex = 0;
        this.currentPage = ref([]);
        this._build();
    }

    _build() {
        this.pages = [];
        for (let i = 0; i < this.total; i += this.pageSize) {
            const arr = [];
            for (let j = i; j < Math.min(i + this.pageSize, this.total); j++) {
                arr.push(j);
            }
            this.pages.push(arr);
        }

        this.currentIndex = 0;
        this.currentPage.value = this.pages[0] || [];
    }

    init(total, pageSize) {
        this.total = total;
        this.pageSize = pageSize;
        this._build();
    }

    prev() {
        const n = this.pages.length;
        this.currentIndex = (this.currentIndex - 1 + n) % n;
        this.currentPage.value = this.pages[this.currentIndex];
    }

    next() {
        const n = this.pages.length;
        this.currentIndex = (this.currentIndex + 1) % n;
        this.currentPage.value = this.pages[this.currentIndex];
    }
}
</script>

<template>
    <div class="social-links">
        <button v-if="canPagination" class="pagination" @click="prev()">
            <Icon :name="'fa7-solid:angle-left'" class="icon"/>
        </button>
        <div class="page-container">
            <div
                v-for="(item, index) in socials"
                :key="index"
                class="social-item"
                :class="{
                    show: currentPage?.includes(index),
                    prev: state == 'prev',
                    next: state == 'next',
                }"
            >
                <a :href="item?.linkUrl || '/'" target='_blank'>
                    <NuxtPicture :src="item?.iconUrl" class="social-img nuxtpic" />
                </a>
            </div>
        </div>
        <button v-if="canPagination" class="pagination" @click="next()">
            <Icon :name="'fa7-solid:angle-right'" class="icon" />
        </button>
    </div>
</template>

<style scoped>
.social-links {
    margin-top: 0.5rem;
}
.social-links,
.social-item,
.social-item a {
    display: flex;
    justify-content: center;
    align-items: center;
}
.social-links {
    height: 2.5rem;
    width: 100%;
    display: flex;
    justify-content: center;
}

.pagination {
    background:none;
    border: none;
}
.pagination .icon {
    height: 100%;
    height: 2.5rem;
    width: 2.5rem;
    background-color: var(--active-color);
}

.page-container {
    width: 100%;
    display: flex;
    justify-content: center;
    overflow: hidden;
}

.social-item {
    width: 0;
    height: 2.2rem;
    overflow: hidden;
    transition: all 0.5s linear;
}
.social-item.next {
    transform: translateX(-100vw);
    margin: 0;
}
.social-item.prev {
    transform: translateX(100vw);
    margin: 0;
}
.social-item.show {
    width: 2.2rem;
    margin: 0 0.2rem;
    transform: translateX(0);
}
.social-item.show.next {
    animation: next 0.5s;
}
.social-item.show.prev {
    animation: prev 0.5s;
}
.social-img {
    height: 100%;
    object-fit: cover;
}
@keyframes next {
    0% {
        transform: translateX(100vw);
    }
    100% {
        transform: translateX(0);
    }
}
@keyframes prev {
    0% {
        transform: translateX(-100vw);
    }
    100% {
        transform: translateX(0);
    }
}
</style>