import useWP from "../utils/useWP";

export default defineEventHandler(async (event) => {
    try {
        let res = await useWP.get("/wp-json/wp-api-menus/v2/menus/182");
        return res.data;
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "耄耋死了",
            message: error?.toString() || "请求出错",
        });
    }
});
