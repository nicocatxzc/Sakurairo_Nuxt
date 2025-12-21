import { useThemeConfigStore } from "#imports";

export const useThemeConfig = () => {
    const {config} = storeToRefs(useThemeConfigStore())
    return config
};
