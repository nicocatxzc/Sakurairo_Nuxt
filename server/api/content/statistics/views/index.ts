export default defineEventHandler(async (event) => {
    try {
        const postId = Number(getQuery(event)?.post_id);

        if (
            !Number.isInteger(postId) ||
            postId <= 0 ||
            (event.method !== "GET" && event.method !== "POST")
        ) {
            return "非法请求";
        }

        if (event.method == "GET") {
            const res = await useWP.get("/wp-json/hachimi/v1/views", {
                params: {
                    post_id: postId,
                },
            });
            return res.data;
        }

        if (event.method == "POST") {
            const res = await useWP.post("/wp-json/hachimi/v1/views", {
                post_id: postId,
            });
            return res.data;
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: error?.toString() || "请求出错",
        });
    }
});
