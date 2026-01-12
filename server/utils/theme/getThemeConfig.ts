export default async function getThemeConfig() {
    const option = useOptionAPI();
    const themeConfig = await option.get("theme_config");

    return themeConfig;
}
