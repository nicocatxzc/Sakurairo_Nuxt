export default defineEventHandler(async () => {
    const settings = await useWPsettings();
    return settings;
});
