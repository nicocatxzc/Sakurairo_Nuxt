export default defineNuxtPlugin(async () => {
    const themeConfig = useThemeConfigStore();
    const {data} = await useCachedFetch("themeConfig","/api/themeConfig")
    themeConfig.config = data.value as object
});
