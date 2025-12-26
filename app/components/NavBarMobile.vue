<script setup>
import { useAnimate } from "motion-v";
import { onClickOutside } from "#imports";
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

// 转换为相对链接
const convertWpUrl = (wpUrl) => {
    try {
        const url = new URL(wpUrl);
        return url.pathname;
    } catch {
        return wpUrl;
    }
};

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
    if(scroll.direction=="down") {
        collpase()
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
});

const [menuScope, menuAnimate] = useAnimate();
const [userScope, userAnimate] = useAnimate();

function animateOpen(name) {
    const animate = name === "menu" ? menuAnimate : userAnimate;
    animate(
        name === "menu" ? menuScope.value : userScope.value,
        { maxHeight: ["0", "30dvh"] },
        { duration: 0.4 }
    );
}

function animateClose(name) {
    const animate = name === "menu" ? menuAnimate : userAnimate;
    return animate(
        name === "menu" ? menuScope.value : userScope.value,
        { maxHeight: ["30dvh", "0"] },
        { duration: 0.3 }
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
        class="site-header"
        :class="{
            bg: headerBg,
            hide: headerHide,
        }"
    >
        <div class="menu-toggle" @click="toggleMenu('menu')">
            <Icon class="icon" :name="'ic:round-menu'"></Icon>
        </div>

        <div class="site-branding">
            <NuxtImg
                :src="`https://nicocat.cc/wp-content/uploads/2025/11/avatar.png`"
                alt="site logo"
            />
            <NuxtLink :to="'/'">
                <span class="site-title">{{ themeConfig?.navTitle }}</span>
            </NuxtLink>
        </div>

        <div class="user-toggle" @click="toggleMenu('user')">
            <Icon class="icon" :name="'fluent:bookmark-16-regular'"></Icon>
        </div>

        <nav ref="menuScope" class="menu-wrapper">
            <ul class="menu">
                <li
                    v-for="(item, index) in menuItems"
                    :key="index"
                    class="item"
                >
                    <div class="item-head">
                        <NuxtLink class="link" :to="convertWpUrl(item.url)">
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
                                <NuxtLink :to="convertWpUrl(child.url)">
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
                    <div class="user-menu">
                        <ElAvatar size="default" class="avatar">
                            <NuxtImg
                                :src="getUserAvatar(user?.avatar)"
                                alt="navbar avatar"
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
                            >管理后台</a
                        >
                        <NuxtLink
                            v-if="user?.role == 'administrator'"
                            :to="'/dashboard'"
                            >主题设置</NuxtLink
                        >
                        <a
                            v-if="user?.management?.newpost"
                            :href="user?.management?.newpost"
                            target="_blank"
                            >撰写文章</a
                        >
                        <a target="_top" @click="authStore.clearAuth()"
                            >退出登录</a
                        >
                    </div>
                    <div v-else class="visitor-option">
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
    display: flex;
    align-items: center;
    justify-content: center;

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
    overflow: hidden;
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
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .user-option {
        display: grid;
        justify-content: center;
        gap: 0.5rem;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
    }
    .visitor-option {
        display: flex;
        align-items: center;
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
    display: flex;
    align-items: center;
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

    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    img {
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
