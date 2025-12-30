export default defineEventHandler(async (event) => {
    try {
        let res = await useWP.get("/wp-json/hachimi/v1/navigation");
        res = replaceWP(res.data)
        return res;
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: error?.toString() || "请求出错",
        });
    }
});
