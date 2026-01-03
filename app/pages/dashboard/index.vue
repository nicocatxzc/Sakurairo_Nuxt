<script setup>
import formSchema from "@/formkit/config";
import { useThemeConfigStore } from "#imports";
definePageMeta({
    layout: false,
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

onMounted(() => {
    Object.assign(
        themeConfig.tempConfig,
        JSON.parse(JSON.stringify(toRaw(themeConfig.config)))
    );
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
    try {
        let data = await useEncrypt(JSON.stringify(toRaw(formData.value)));
        let res = await $fetch("/api/theme/themeConfig", {
            method: "PUT",
            body: data,
        });
        if (res.success) {
            ElMessage.success("配置已成功保存");
        }
        themeConfig.config = formData.value;
    } catch (error) {
        ElMessage.error(`保存失败,错误详情${error}`);
    }
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
                        <ElButton class="button" @click="saveSettings"
                            >保存</ElButton
                        >
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
                            <PageAbout v-show="current === 'about'"/>
                        </FormKit>
                    </div>
                </div>
            </div>
            <iframe
                ref="preview"
                class="preview"
                src="/"
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
:deep(.formkit-help){
    font-size: .8rem;
    color: grey;
}
</style>
