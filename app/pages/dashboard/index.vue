<script setup>
import formSchema from "@/formkit/config";
import { useThemeConfigStore } from "#imports";
definePageMeta({
    layout: "dashboard",
});
const isNotPreview = computed(() => {
    if (import.meta.server) return true;
    return window.__hachimiPreview__ !== true;
});

const themeConfig = useThemeConfigStore();
const formData = ref(themeConfig.tempConfig); // 表单数据
const groups = formSchema;
let current = ref("basicSettings");
let title = ref("");
let expand = ref(true);

let preview = useTemplateRef("preview");
const postPreviewConfig = useDebounceFn(() => {
    preview.value?.contentWindow?.postMessage(
        {
            type: "previewData",
            data: JSON.parse(JSON.stringify(toRaw(formData.value))),
        },
        "*"
    );
}, 10);

const initDone = ref(false);
onMounted(async () => {
    if (!isNotPreview.value) {
        ElMessage.error("请不要重复开启设置页！");
        navigateBack();
    }
    try {
        Object.assign(
            themeConfig.tempConfig,
            JSON.parse(JSON.stringify(toRaw(themeConfig.config)))
        );
        const sysConfig = await $fetch("/api/theme/sys");
        Object.assign(themeConfig.tempConfig, sysConfig);

        initDone.value = true;
    } catch (e) {
        ElMessage.error(`配置初始化失败，请刷新重试！`);
        console.error(e);
    }

    const stopwatch = watch(
        () => themeConfig.tempConfig,
        () => postPreviewConfig(),
        { deep: true }
    );
    onUnmounted(() => {
        stopwatch();
    });
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
    if (title.value != "") {
        title.value = "";
    } else {
        navigateTo("/");
    }
    if (expand.value == true) {
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
                        <ElButton class="button" @click="expand = !expand">{{
                            expand ? "<<<" : ">>>"
                        }}</ElButton>
                    </div>
                </div>
                <div class="settings-form">
                    <aside
                        class="settings-menu"
                        :class="{
                            show: title == '' || expand == true,
                        }"
                    >
                        <ElMenu
                            class="navigate"
                            :default-active="current"
                            unique-opened
                            @select="
                                (key) => {
                                    showForm = true;
                                    current = key;
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
                            show: title != '' || expand == true,
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

    transition: transform 0.5s ease, width 0.5s ease;
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
    flex: 1;
    height: 100%;
    width: 0;

    border: none;
    transition: width 0.5s ease;

    &.show {
        width: auto;
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
