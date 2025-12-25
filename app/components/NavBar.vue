<script setup>
import { useScrollStore } from "@/stores/progress";
import { useAuth } from "@/stores/auth";

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

const menuRef = useTemplateRef("menu");
const activeSubMenu = ref(null);
onMounted(async () => {
    //防止子菜单量子叠加
    await nextTick();
    const nav = menuRef.value;

    if (!nav) return;

    const items = nav.querySelectorAll("li");

    items.forEach((item) => {
        const subMenu = item.querySelector(".sub-menu");
        if (!subMenu) return;

        const mainMenu = item;
        const MainMenuWidth = mainMenu.getBoundingClientRect().width;
        const subMenuWidth = subMenu.getBoundingClientRect().width;
        const offsetX = (subMenuWidth - MainMenuWidth) / 2;
        const BasicSubMenuStyle = `translateY(-10px) translateX(-${offsetX}px)`;
        subMenu.style.transform = BasicSubMenuStyle;

        // 鼠标事件
        mainMenu.addEventListener("mouseenter", () => {
            if (activeSubMenu.value && activeSubMenu.value !== subMenu) {
                activeSubMenu.value.classList.remove("active");
            }
            subMenu.classList.add("active");
            subMenu.style.transform = `translateY(0) translateX(-${offsetX}px)`;
            activeSubMenu.value = subMenu;
        });
        mainMenu.addEventListener("mouseleave", () => {
            subMenu.style.transform = BasicSubMenuStyle;
        });
    });
});
</script>

<template>
    <header
        class="site-header"
        :class="scroll.progress >= 5 || scroll.direction == `down` ? `bg` : ''"
    >
        <div class="site-branding">
            <NuxtImg
                :src="`https://nicocat.cc/wp-content/uploads/2025/11/avatar.png`"
                alt="site logo"
            />
            <NuxtLink :to="'/'">
                <span class="site-title">{{ themeConfig?.navTitle }}</span>
            </NuxtLink>
        </div>

        <div class="menu-wrapper">
            <nav>
                <ul
                    ref="menu"
                    class="menu"
                    :style="{
                        justifyContent: themeConfig?.navbarDistribution,
                        margin: `0 ${themeConfig?.navbarOptionMargin}px`,
                    }"
                >
                    <template v-for="item in menuItems" :key="item.id">
                        <li
                            v-if="item.children && item.children.length"
                            :index="item.id + ''"
                        >
                            <NuxtLink :to="convertWpUrl(item.url)">
                                {{ item.title }}
                            </NuxtLink>

                            <ul class="sub-menu">
                                <li
                                    v-for="child in item.children"
                                    :key="child.id"
                                    :index="child.id + ''"
                                >
                                    <NuxtLink :to="convertWpUrl(child.url)">
                                        {{ child.title }}
                                    </NuxtLink>
                                </li>
                            </ul>
                        </li>

                        <li v-else :index="item.id + ''">
                            <NuxtLink :to="convertWpUrl(item.url)">
                                {{ item.title }}
                            </NuxtLink>
                        </li>
                    </template>
                </ul>
            </nav>
        </div>

        <ClientOnly>
            <div class="user">
                <ElAvatar size="default" class="avatar">
                    <NuxtImg
                        :src="getUserAvatar(user?.avatar)"
                        alt="navbar avatar"
                    />
                </ElAvatar>
                <div class="user-menu">
                    <div class="user-menu-info">
                        <span class="name">{{
                            user?.role ? user.name : "游客"
                        }}</span>
                    </div>
                    <div v-if="user?.role" class="user-menu-option">
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
                    <div v-else class="user-menu-option">
                        <a @click="openLoginForm">登录</a>
                    </div>
                </div>
            </div>
        </ClientOnly>
    </header>
</template>

<style scoped>
.site-header {
    position: fixed;
    top: 0;
    left: 0;
    gap: 0.15rem;
    width: 100%;
    height: 3.75rem;
    padding: 0 1.25rem;
    display: flex;
    align-items: center;
    background: transparent;
    border-bottom: 0.1rem solid transparent;
    transition: all 0.6s ease;
    user-select: none;
}
.site-header.bg,
.site-header:hover {
    border-bottom: var(--border-shine);
    background: var(--widget-background-color);
    backdrop-filter: saturate(180%) blur(10px);
    transition: border-bottom 0.5s ease, all 0.5s ease;
}

.site-branding {
    background: transparent;
    border: 0;
    height: 100%;
    line-height: 4.7rem;
    position: relative;
    padding-left: 0.3rem;
    display: flex;
    align-items: center;
}
.site-branding img {
    max-width: 20vw;
    max-height: 3.2rem;
    height: 100%;
    width: auto;
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
}
.site-title:hover {
    color: var(--active-color);
}

.menu-wrapper,
.menu-wrapper nav,
.menu-wrapper nav > ul {
    width: 100%;
    display: flex;
}

.menu li,
.user-menu-option a {
    position: relative;
    list-style: none;
    margin: 0 0.9rem;
    padding: 0.6rem 0;
}

nav > ul > li > a:after {
    content: "";
    display: block;
    position: absolute;
    bottom: -0.32rem;
    height: 0.25rem;
    background-color: var(--active-color);
    width: 100%;
    border-radius: 2rem;
    max-width: 0;
    transition: max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
nav > ul > li > a:hover:after {
    max-width: 100%;
}

li .sub-menu,
.user .user-menu {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 110%;
    min-width: 5.62rem;
    white-space: nowrap;
    background-color: var(--widget-background-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-0.63rem);
    border-radius: 0.63rem;
    padding: 0.31rem 0;
    border: var(--boarder);
    transition: all 0.4s ease-in-out;
}

li:hover > .sub-menu,
.user:hover .user-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

li .sub-menu li {
    display: flex;
    justify-content: center;
}

li .sub-menu li:last-child {
    border-bottom: none;
}

li .sub-menu a {
    display: block;
    font-size: 14px;
}

.avatar {
    height: 2.5rem;
    width: 2.5rem;
    min-width: 2.5rem;
    min-height: 2.5rem;
}

.user .user-menu {
    padding: 0.5rem 0.5rem;
    transform: translateY(-0.63rem) translateX(-20%);
}
.user:hover .user-menu {
    transform: translateY(0) translateX(-20%);
}

.user,
.user-menu-info,
.user-menu-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.user-menu-info *,
.user-menu-option * {
    margin: 0 0.3rem;
}
</style>
