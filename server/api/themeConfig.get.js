export default defineEventHandler(async () => {
    try {
        let config = await useWP.get("/wp-json/hachimi/v1/config");
        return config.data;
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "耄耋死了",
            message: error?.toString() || "请求出错",
        });
    }
});
