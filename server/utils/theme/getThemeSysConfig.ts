export default async function getThemeSysConfig() {
    const option = useOptionAPI();
    const themeConfig = option.get("theme_sys");

    return themeConfig;
}
