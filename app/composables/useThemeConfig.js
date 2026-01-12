import { useThemeConfigStore } from "#imports";

/**
 * 获取响应式的主题配置对象，在预览模式下会自动切换为临时配置
 */
export const useThemeConfig = () => {
    const store = useThemeConfigStore();
    let previewMode = ref(false);
    const previewData = ref({});

    if (import.meta.client) {
        window.addEventListener("message", (e) => {
            if (e.data?.type === "previewData") {
                previewMode.value = true;
                previewData.value = {...e.data.data};
            }
        });
    }
    return computed(() => previewMode.value ? previewData.value : store.config);
};
