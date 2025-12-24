export default defineEventHandler(async () => {
    const settings = await useWPsettings();
    if(settings?.global_style) {
        settings.global_style = pureWPcss(settings.global_style)
    }
    return settings;
});
