export default defineEventHandler(async () => {
    const themeConfig = await getThemeConfig();

    return themeConfig;
});
