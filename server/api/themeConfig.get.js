export default defineEventHandler(async () => {
    try {
        let config = await useWP.get("/wp-json/hachimi/v1/config");
        let siteConfig = await useWPsettings();
        return { 
            siteName:siteConfig?.site_name,
            siteDesc:siteConfig?.site_description,
            ...config.data
         };
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: error?.toString() || "请求出错",
        });
    }
});
