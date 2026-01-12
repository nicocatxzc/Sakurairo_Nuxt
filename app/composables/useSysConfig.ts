import { useSysConfigStore } from "#imports";

/**
 * 获取响应式的主题系统配置对象
 */
export const useSysConfig = () => {
    const store = useSysConfigStore();

    return computed(() => store?.config ?? {});
};
