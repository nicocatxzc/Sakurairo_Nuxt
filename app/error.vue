<script setup>
const props = defineProps({
    error: {
        type: Object,
        default: () => ({}),
    },
});
const sysConfig = useSysConfig();
const themeConfig = useThemeConfig();

// 计算属性
const statusCode = computed(() => props.error.statusCode || 500);
const statusMessage = computed(
    () => props.error.statusMessage || props.error.message
);
const defaultMessage = computed(() =>
    statusCode.value === 404 ? "页面不存在" : "发生错误"
);
const errorDescription = computed(() => {
    if (statusCode.value === 404) {
        return "你要查找的页面可能已被删除、更名或暂时不可用。";
    } else if (statusCode.value === 500) {
        return "服务器内部错误，请稍后重试。";
    } else {
        return props.error.message || "发生了一个意外错误，请稍后重试。";
    }
});

const keyword = ref("");
if (themeConfig.value?.randomPicUrlPc) {
    useStyleTag(/* css */ `
    .page-404 {
        background:none!important;
        background-image:url(${
            themeConfig.value?.randomPicUrlPc ?? ""
        })!important;
    }
    `);
}
</script>

<template>
    <div class="page-404">
        <div class="page-404-container">
            <div class="page-404-header">
                <h1 class="page-404-number">{{ statusCode }}</h1>
            </div>

            <h2 class="page-404-title">
                {{ statusMessage ?? defaultMessage }}
            </h2>

            <p class="page-404-message">
                {{ errorDescription }}
            </p>

            <div class="page-404-actions">
                <a
                    id="golast"
                    href="javascript:history.go(-1);"
                    class="page-404-button"
                >
                    <Icon :name="'fa7-solid:rotate-left'" />
                </a>
                <NuxtLink id="gohome" :to="'/'" class="page-404-button">
                    <Icon name="fa7-solid:house" />
                </NuxtLink>
                <form
                    class="page-404-search-form"
                    role="search"
                    @submit.prevent="
                        () => {
                            navigateTo({
                                path: '/search',
                                query: { keyword },
                            });
                        }
                    "
                >
                    <input
                        v-model="keyword"
                        class="page-404-search-input"
                        type="search"
                        name="keyword"
                        placeholder="搜索..."
                        required
                    />
                </form>
            </div>

            <div class="page-404-footer">{{ sysConfig?.site_name ?? "" }}</div>
        </div>
    </div>
</template>
<style lang="scss">
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
</style>
<style lang="scss" scoped>
$page-radius: 16px;
$control-height: 42px;
$transition: all 0.3s ease;

.page-404 {
    --primary: #00b0f0;
    --text: #303030;
    --bg: #f5f7fa;
    --card: rgba(255, 255, 255, 0.85);
    --shadow: 0 20px 60px rgba(0, 0, 0, 0.08);

    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        Helvetica, Arial, sans-serif;

    &-container {
        width: 100%;
        max-width: 580px;
        padding: 40px;
        text-align: center;
        background: var(--card);
        border-radius: $page-radius;
        box-shadow: var(--shadow);
        backdrop-filter: saturate(180%) blur(10px);
    }

    &-header {
        margin-bottom: 30px;
    }

    &-number {
        font-size: 120px;
        font-weight: 700;
        line-height: 1;
        margin: 0;
        letter-spacing: -5px;
        background: var(--primary);
        background-clip: text;
        color: transparent;
    }

    &-title {
        margin: 0 0 20px;
        font-size: 28px;
        font-weight: 600;
    }

    &-message {
        margin-bottom: 30px;
        font-size: 16px;
        line-height: 1.6;
        color: #666;
    }

    &-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 15px;
        margin-bottom: 35px;
    }

    &-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: $control-height;
        border-radius: 10px;
        border: 1px solid #fff;
        background: rgba(255, 255, 255, 0.6);
        color: #505050;
        box-shadow: 0 1px 30px -4px #e8e8e8;
        transition: $transition;
        text-decoration: none;
        cursor: pointer;

        &:hover,
        &:focus-visible {
            background: var(--primary);
            color: #fff;
            border-color: var(--primary);
        }
    }

    &-search-form {
        display: flex;
        flex: 1;
        min-width: 160px;
    }

    &-search-input {
        width: 100%;
        height: $control-height;
        padding: 0 12px;
        font-size: 14px;
        border-radius: 10px;
        border: 1px solid #fff;
        background: rgba(255, 255, 255, 0.6);
        color: #505050;
        box-shadow: 0 1px 30px -4px #e8e8e8;
        transition: $transition;

        &:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(0, 176, 240, 0.25);
        }
    }

    &-footer {
        margin-top: 30px;
        font-size: 13px;
        color: #999;
    }

    @media (max-width: 580px) {
        &-container {
            padding: 30px 20px;
        }

        &-number {
            font-size: 90px;
        }

        &-title {
            font-size: 24px;
        }
    }
}
</style>
