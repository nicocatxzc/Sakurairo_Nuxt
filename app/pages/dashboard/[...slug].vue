<script setup>
import formSchema from "@/formkit/config";
import { useThemeConfigStore } from "#imports";
import _ from "lodash-es";
definePageMeta({
    layout: "dashboard",
});
const route = useRoute();
const router = useRouter();
const current = computed(() => {
    const h = route.hash?.replace("#", "");
    return h || "basicSettings";
});

const isNotPreview = computed(() => {
    if (import.meta.server) return true;
    return window.__hachimiPreview__ !== true;
});

const themeConfig = useThemeConfigStore();
const formData = ref(themeConfig.tempConfig); // 表单数据
const groups = formSchema;
let title = ref("基础设置");
let expand = ref(true);
const showMode = ref("wide");

let preview = useTemplateRef("preview");
const postPreviewConfig = useDebounceFn(() => {
    preview.value?.contentWindow?.postMessage(
        {
            type: "previewData",
            data: JSON.parse(JSON.stringify(toRaw(formData.value))),
        },
        "*",
    );
}, 10);

const initDone = ref(false);
onMounted(async () => {
    if (!isNotPreview.value) {
        ElMessage.error("请不要重复开启设置页！");
        navigateBack();
    }
    // 回填设置项
    try {
        Object.assign(
            themeConfig.tempConfig,
            JSON.parse(JSON.stringify(toRaw(themeConfig.config))),
        );
        const sysConfig = await $fetch("/api/theme/sys");
        Object.assign(themeConfig.tempConfig, sysConfig);

        initDone.value = true;
    } catch (e) {
        ElMessage.error(`配置初始化失败，请刷新重试！`);
        console.error(e);
    }

    // 更新预览
    watch(
        () => themeConfig.tempConfig,
        () => postPreviewConfig(),
        { deep: true },
    );

    // 显示模式
    const updateShowMode = () => {
        const el = preview.value;
        if (!el) return;

        showMode.value =
            getComputedStyle(el).getPropertyValue("--hachimi-preview-mode") ||
            "wide";
    };

    const throttledUpdate = _.throttle(updateShowMode, 100);

    updateShowMode();

    useEventListener(window, "resize", throttledUpdate);
});

async function saveSettings() {
    if (!initDone.value) {
        ElMessage.error("配置尚未初始化完成，禁止保存");
        return;
    }
    try {
        const rawData = JSON.parse(JSON.stringify(toRaw(formData.value)));
        const { sysConfig, normalConfig } = splitSysConfig(rawData);
        const encryptedTheme = await useEncrypt(JSON.stringify(normalConfig));

        const themeRes = await $fetch("/api/theme/themeConfig", {
            method: "PUT",
            body: encryptedTheme,
        });

        const encryptedSys = await useEncrypt(JSON.stringify(sysConfig));

        const sysRes = await $fetch("/api/theme/sys", {
            method: "PUT",
            body: encryptedSys,
        });

        if (themeRes.success && sysRes.success) {
            ElMessage.success("配置已成功保存");

            themeConfig.config = rawData;
        }
    } catch (error) {
        ElMessage.error(`保存失败,错误详情${error}`);
    }
}

function splitSysConfig(source) {
    const sysConfig = {};
    const normalConfig = {};

    for (const [key, value] of Object.entries(source)) {
        if (key.startsWith("sys")) {
            sysConfig[key] = value;
        } else {
            normalConfig[key] = value;
        }
    }

    return { sysConfig, normalConfig };
}

function navigateBack() {
    if (expand.value == true && showMode.value == "wide") {
        navigateTo("/");
    }
    if (title.value != "") {
        title.value = "";
    } else {
        navigateTo("/");
    }
}
</script>

<template>
    <ClientOnly>
        <div class="dashboard">
            <div
                class="settings"
                :class="{
                    expand: expand == true,
                }"
            >
                <div class="settings-info">
                    <ElButton class="back" @click="navigateBack">
                        <Icon class="icon" :name="'fa7-solid:angle-left'" />
                    </ElButton>
                    <span class="info">
                        正在编辑:<br />
                        <h2>{{ title || "主题" }}</h2>
                    </span>
                    <div class="controls">
                        <ElButton
                            class="button"
                            :disabled="!initDone"
                            @click="saveSettings"
                        >
                            保存
                        </ElButton>
                        <ElButton class="button" @click="expand = !expand">
                            {{ expand ? "<<<" : ">>>" }}
                        </ElButton>
                    </div>
                </div>
                <div class="settings-form">
                    <aside
                        class="settings-menu"
                        :class="{
                            show:
                                title == '' ||
                                (expand === true && showMode == 'wide'),
                        }"
                    >
                        <ElMenu
                            class="navigate"
                            :default-active="current"
                            unique-opened
                            @select="
                                (key) => {
                                    navigateTo({
                                        path: '/dashboard',
                                        hash: `#${key}`,
                                    });
                                }
                            "
                        >
                            <template v-for="group in groups" :key="group.key">
                                <!-- 有子分组 -->
                                <ElSubMenu
                                    v-if="group.subGroup"
                                    :index="group.key"
                                >
                                    <template #title>
                                        {{ group.title }}
                                    </template>

                                    <ElMenuItem
                                        v-for="sub in group.subGroup"
                                        :key="sub.key"
                                        :index="sub.key"
                                        @click="title = sub.title"
                                    >
                                        {{ sub.title }}
                                    </ElMenuItem>
                                </ElSubMenu>

                                <!-- 无子分组 -->
                                <ElMenuItem
                                    v-else
                                    :index="group.key"
                                    @click="title = group.title"
                                >
                                    {{ group.title }}
                                </ElMenuItem>
                            </template>
                        </ElMenu>
                    </aside>
                    <div
                        class="settings-area"
                        :class="{
                            show:
                                title != '' ||
                                (expand === true && showMode == 'wide'),
                        }"
                    >
                        <FormKit
                            v-model="formData"
                            type="form"
                            :actions="false"
                        >
                            <template v-for="group in groups" :key="group.key">
                                <!-- 顶层 -->
                                <div
                                    v-if="group.schema"
                                    v-show="current === group.key"
                                >
                                    <FormKitSchema :schema="group.schema" />
                                </div>

                                <!-- 子分组 -->
                                <template v-if="group.subGroup">
                                    <div
                                        v-for="sub in group.subGroup"
                                        v-show="current === sub.key"
                                        :key="sub.key"
                                    >
                                        <FormKitSchema :schema="sub.schema" />
                                    </div>
                                </template>
                            </template>
                            <PageAbout v-show="current === 'about'" />
                            <PageBackup
                                v-show="current === 'backup'"
                                v-model="formData"
                                @submit="saveSettings"
                            />
                        </FormKit>
                    </div>
                </div>
            </div>
            <iframe
                ref="preview"
                class="preview"
                src="/?preview=true"
                frameborder="0"
                :class="{
                    show: expand !== true,
                }"
            />
        </div>
    </ClientOnly>
</template>

<style lang="scss" scoped>
@media (min-aspect-ratio: 4/3) {
    .dashboard {
        display: flex;
        width: 100dvw;
        height: 100dvh;
        overflow: hidden;
    }
    .settings {
        position: relative;
        display: flex;
        flex-direction: column;

        width: 20dvw;
        height: 100%;

        background: whitesmoke;
        transition: width 0.5s ease;

        &.expand {
            width: 100dvw;
        }
    }
    .settings-info {
        position: sticky;
        top: 0;
        z-index: 10;

        display: flex;
        align-items: stretch;

        height: 4.5rem;
        background: inherit;
    }
    .back {
        width: 3rem;
        min-width: 3rem;
        height: 100%;

        .icon {
            transform: scale(1.5);
        }
    }
    .info {
        flex: 1;
        padding: 0.5rem 1rem;

        h2 {
            margin: 0;
            font-size: 1.1rem;
        }
    }
    .controls {
        width: 5rem;
        display: flex;
        flex-direction: column;

        .button {
            width: 100%;
            margin: 0;
        }
    }
    .settings-form {
        position: relative;
        flex: 1;
        overflow: hidden;
    }
    .settings-menu,
    .settings-area {
        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        overflow: auto;
        background: whitesmoke;

        transition:
            transform 0.5s ease,
            width 0.5s ease;
    }
    .settings-menu {
        transform: translateX(-100%);

        &.show {
            transform: translateX(0);
        }
    }
    .settings-area {
        transform: translateX(100%);
        padding: 0;

        &.show {
            transform: translateX(0);
            padding: 3%;
        }
    }
    .settings.expand {
        .settings-menu.show {
            width: 20dvw;
            transform: translateX(0);
        }

        .settings-area.show {
            width: 80dvw;
            transform: translateX(20dvw);
        }
    }
    .preview {
        --hachimi-preview-mode: wide;
        flex: 1;
        height: 100%;
        width: 0;

        border: none;
        transition: width 0.5s ease;

        &.show {
            width: auto;
        }
    }
}
:deep(.el-collapse-item__content) {
    padding: 0;
}
:deep(.formkit-help) {
    font-size: 0.8rem;
    color: grey;
}
</style>
<style lang="scss" scoped>
@media (max-aspect-ratio: 4/3) {
    .dashboard {
        width: 100dvw;
        height: 100dvh;

        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .settings {
        width: 100%;
        height: 4.5rem;

        display: flex;
        flex-direction: column;
        flex-shrink: 0;

        background: whitesmoke;

        transition: height 0.35s ease;

        overflow: hidden;
        &.expand {
            height: 100dvh;
            overflow: auto;
        }
    }

    .settings-info {
        position: relative;
        top: 0;
        z-index: 20;

        display: flex;
        align-items: center;

        height: 4.5rem;
        background: whitesmoke;
        border-bottom: 1px solid #e5e5e5;
    }

    .back {
        width: 3rem;
        min-width: 3rem;
        height: 100%;

        .icon {
            transform: scale(1.5);
        }
    }
    .info {
        flex: 1;
        padding: 0.5rem 1rem;

        h2 {
            margin: 0;
            font-size: 1.1rem;
        }
    }
    .controls {
        display: flex;
        flex-direction: row;
        gap: 0.4rem;
        width: auto;
        padding-right: 0.5rem;

        .button {
            width: auto;
            margin: 0;
        }
    }

    .settings-form {
        flex: 1;
        overflow: hidden;
        height: calc(100dvh - 4.5rem);
        transform: translateY(-100%);
        transition: transform 0.35s ease;
    }
    .settings.expand {
        .settings-form {
            transform: translateY(0);
        }
    }

    .settings-menu,
    .settings-area {
        position: absolute;
        inset: 0;

        width: 100%;
        height: 100%;

        overflow: auto;
        background: whitesmoke;

        transition: transform 0.25s ease;
    }
    .settings-menu {
        transform: translateX(-100%);

        &.show {
            transform: translateX(0);
        }
    }
    .settings-area {
        transform: translateX(100%);
        padding: 0;

        &.show {
            transform: translateX(0);
            padding: 3%;
        }
    }

    .settings-area {
        transform: translateX(100%);
        padding: 0;

        &.show {
            transform: translateX(0);
            padding: 3%;
        }
    }

    .preview {
        --hachimi-preview-mode: narrow;
        width: 100%;
        height: calc(100dvh - 4.5rem);
        margin-top: 4.5rem;
        position: fixed;

        border: none;

        z-index: -1;
    }
}
</style>
