import useWP from "../utils/useWP";

export default defineEventHandler(async (event) => {
    try {
        let res = await useWP.get("/wp-json/hachimi/v1/navigation");
        return res.data;
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: error?.toString() || "请求出错",
        });
    }
});
