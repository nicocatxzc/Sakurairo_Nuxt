<script setup>
import { useAnimate } from "motion-v";
import { onClickOutside } from "#imports";
import { Search } from "@element-plus/icons-vue";
const authStore = useAuth();
const user = computed(() => authStore.user);
const openLoginForm = authStore.openLoginForm;
const themeConfig = useThemeConfig();
const scroll = useScrollStore();

// 从api获取菜单
const { data: menuData } = await useCachedFetch("navbar", "/api/content/menu");

const menuItems = computed(() =>
    Array.isArray(menuData.value) ? menuData.value : []
);

const searchKeyword = ref("")
function gotoSearch() {
    navigateTo(`/search?keyword=${searchKeyword.value}`);
}

const expandedMenuItem = ref(null);
function toggleMenuItem(id) {
    if (id == expandedMenuItem.value) {
        expandedMenuItem.value = null;
    } else {
        expandedMenuItem.value = id;
    }
}

const currentMenu = ref(""); // 当前展开的菜单
const headerBg = computed(() => {
    return (
        scroll.progress >= 5 || currentMenu.value || scroll.direction == `down`
    );
});
const headerHide = computed(() => {
    if (scroll.direction == "down") {
        collpase();
        return true;
    }
    return false;
});

async function toggleMenu(menu) {
    if (currentMenu.value === "") {
        // 直接展开
        currentMenu.value = menu;
        animateOpen(menu);
        return;
    }

    if (menu === currentMenu.value) {
        // 点击同一个收起
        await animateClose(menu);
        currentMenu.value = "";
        return;
    }

    // 不同的菜单
    const old = currentMenu.value;
    await animateClose(old);

    // 收起再开新的
    currentMenu.value = menu;
    animateOpen(menu);
}

const headRef = useTemplateRef("header");
const menuRef = useTemplateRef("menuScope");
const userRef = useTemplateRef("userScope");

onMounted(() => {
    watch([() => menuRef.value, () => userRef.value], () => {
        if (headRef.value) {
            onClickOutside(headRef.value, async () => {
                collpase();
            });
        }
    });
    document.addEventListener("pjax:complete",()=>{
        collpase();
    })
});

const [menuScope, menuAnimate] = useAnimate();
const [userScope, userAnimate] = useAnimate();

function animateOpen(name) {
    const animate = name === "menu" ? menuAnimate : userAnimate;
    animate(
        name === "menu" ? menuScope.value : userScope.value,
        { maxHeight: ["0", "70dvh"] },
        { duration: 0.5 }
    );
}

function animateClose(name) {
    const animate = name === "menu" ? menuAnimate : userAnimate;
    return animate(
        name === "menu" ? menuScope.value : userScope.value,
        { maxHeight: ["70dvh", "0"] },
        { duration: 0.5 }
    ).finished; // 等待动画完成
}

function collpase() {
    if (currentMenu.value != "") {
        animateClose(currentMenu.value);
        currentMenu.value = "";
    }
}
</script>

<template>
    <header
        ref="header"
        class="site-header flex-center"
        :class="{
            bg: headerBg,
            hide: headerHide,
        }"
    >
        <div class="menu-toggle flex-center" @click="toggleMenu('menu')">
            <Icon class="icon" :name="'ic:round-menu'"></Icon>
        </div>

        <div class="site-branding flex-center">
            <NuxtPicture
                class="nuxtpic flex-center"
                :src="themeConfig?.navLogo || ''"
                alt="site logo"
            />
            <NuxtLink :to="'/'">
                <span
                    class="site-title"
                    :style="{ fontFamily: themeConfig?.navTitleFont || '' }"
                >
                    {{ themeConfig?.navTitle }}
                </span>
            </NuxtLink>
        </div>

        <div class="user-toggle flex-center" @click="toggleMenu('user')">
            <Icon class="icon" :name="'fluent:bookmark-16-regular'"></Icon>
        </div>

        <nav ref="menuScope" class="menu-wrapper">
            <div v-if="themeConfig?.navbarSearch || true" class="search-form">
                <ElInput
                    v-model="searchKeyword"
                    class="search-input"
                    placeholder="想找点什么呢?"
                    :prefix-icon="Search"
                    @keyup.enter="gotoSearch()"
                />
            </div>
            <ul
                class="menu"
                :style="{
                    fontFamily: themeConfig?.navOptionFont || '',
                }"
            >
                <li
                    v-for="(item, index) in menuItems"
                    :key="index"
                    class="item"
                >
                    <div class="item-head">
                        <NuxtLink class="link" :to="item.url">
                            {{ item.title }}
                        </NuxtLink>
                        <Icon
                            v-if="item.children && item.children.length"
                            class="button"
                            :class="{
                                expand: expandedMenuItem == index,
                            }"
                            :name="'fa7-solid:angle-right'"
                            @click="toggleMenuItem(index)"
                        />
                    </div>
                    <template v-if="item.children && item.children.length">
                        <ul
                            class="sub-menu"
                            :class="{
                                expand: expandedMenuItem == index,
                            }"
                        >
                            <li v-for="child in item.children" :key="child.id">
                                <NuxtLink :to="child.url">
                                    {{ child.title }}
                                </NuxtLink>
                            </li>
                        </ul>
                    </template>
                </li>
            </ul>
        </nav>

        <ClientOnly>
            <div ref="userScope" class="user-wrapper">
                <div class="user-menu-container">
                    <div class="user-menu flex-center">
                        <ElAvatar size="default" class="avatar">
                            <NuxtPicture
                                :src="getUserAvatar(user?.avatar)"
                                alt="navbar avatar"
                                class="nuxtpic"
                            />
                        </ElAvatar>
                        <div class="user-info">
                            <span class="name">{{
                                user?.role ? user.name : "游客"
                            }}</span>
                        </div>
                    </div>
                    <div v-if="user?.role" class="user-option">
                        <a
                            v-if="user?.management?.admin"
                            :href="user?.management?.admin"
                            target="_blank"
                        >
                            管理后台
                        </a>
                        <NuxtLink
                            v-if="user?.role == 'administrator'"
                            :to="'/dashboard'"
                        >
                            主题设置
                        </NuxtLink>
                        <a
                            v-if="user?.management?.newpost"
                            :href="user?.management?.newpost"
                            target="_blank"
                        >
                            撰写文章
                        </a>
                        <a target="_top" @click="authStore.clearAuth()">
                            退出登录
                        </a>
                    </div>
                    <div v-else class="visitor-option flex-center">
                        <a @click="openLoginForm">登录</a>
                    </div>
                </div>
            </div>
        </ClientOnly>
    </header>
</template>

<style lang="scss" scoped>
.button {
    transform: scale(1.5);
    transition: transform 0.5s ease;
    cursor: pointer;
    &.expand {
        transform: rotate(90deg) scale(1.5);
    }
}
.item .item-head {
    display: flex;
    align-items: center;
    .link {
        flex: 1;
    }
}
.sub-menu {
    max-height: 0;
    transition: all 0.5s ease;
    overflow: hidden;
    &.expand {
        max-height: 30dvh;
        overflow: auto;
    }
}
</style>

<style lang="scss" scoped>
.menu-toggle,
.user-toggle {
    height: 2.4rem;
    width: 2.4rem;
    border-radius: 0.5rem;

    .icon {
        transform: scale(1.5);
    }

    &:hover {
        border: var(--border-active);

        .icon {
            background-color: var(--active-color);
        }
    }
}
.menu-wrapper,
.user-wrapper {
    max-height: 0;
    overflow: auto;
    width: 100dvw;
    top: 100%;
    left: 0;
    position: absolute;

    background: rgba(var(--widget-background), 0.9);
    &.show {
        max-height: 90dvh;
    }
}
.menu-wrapper {
    .search-form {
        padding: 0.5rem;
        border-bottom: 0.1rem solid rgba(var(--border-color-sketch), 0.1);
        .search-input {
            font-size: 1rem;
            height: 2.5rem;
            :deep(.el-input__wrapper) {
                border-radius: 0.5rem;
            }
        }
    }
    ul {
        list-style: none;
    }
    li {
        padding: 0.6rem;
        margin: 0 1rem;
        border-bottom: 0.1rem solid rgba(var(--border-color-sketch), 0.1);
    }
}
.user-wrapper {
    .user-menu-container {
        display: flex;
        gap: 1rem;
        justify-content: space-evenly;
        margin: 1rem 3rem;
    }
    .user-menu {
        flex-direction: column;
    }
    .user-option {
        display: grid;
        justify-content: center;
        gap: 0.5rem;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
    }
}
</style>

<style lang="scss" scoped>
.site-header {
    position: fixed;
    top: 0;
    left: 0;
    gap: 0.15rem;
    width: 100%;
    height: 3rem;
    padding: 0 1.25rem;
    background: transparent;
    border-bottom: 0.1rem solid transparent;
    transform: translateY(0);
    transition: all 0.6s ease;
    user-select: none;
    &.bg,
    &:hover {
        border-bottom: var(--border-shine);
        background: var(--widget-background-color);
        backdrop-filter: saturate(180%) blur(10px);
        transition: border-bottom 0.5s ease, all 0.5s ease;
    }
    &.hide {
        transform: translateY(-100%);
    }
}

.site-branding {
    background: transparent;
    border: 0;
    height: 100%;
    line-height: 4.7rem;
    position: relative;
    padding-left: 0.3rem;

    flex: 1;
    .nuxtpic {
        max-width: 20vw;
        max-height: 3.2rem;
        height: 90%;
        width: auto;
    }
}

.site-title {
    display: flex;
    white-space: nowrap;
    width: auto;
    color: var(--word-color-first);
    font-weight: 400;
    white-space: nowrap;
    padding: 0.32rem 0.64rem;
    letter-spacing: 1px;
    font-size: 1.2rem;

    &:hover {
        color: var(--active-color);
    }
}
</style>
