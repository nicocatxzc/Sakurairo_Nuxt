export default defineNuxtPlugin(async () => {
    let themeConfig = useThemeConfigStore();
    let res = await $fetch("/api/themeConfig", {
        method: "GET",
    });
    themeConfig.config = res
});
