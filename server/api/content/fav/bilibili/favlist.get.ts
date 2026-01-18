import axios from "axios";

const DEFAULT_PAGE_SIZE = 20;

export default defineEventHandler(async (event) => {
    try {
        const sysConfig = await getThemeSysConfig();
        const userID = sysConfig?.sysBilibiliUserId ?? null;

        if (!userID) return;

        const query = getQuery(event);
        const favId = Number(query.favId);
        const page = Number(query.page ?? 1);

        if (!favId || page < 1) {
            throw createError({
                statusCode: 400,
                statusMessage: "Params missing",
                message: "缺少必要参数",
            });
        }

        // 检查收藏夹是否存在
        const favList = await $fetch("/api/content/fav/bilibili/favlist-all");

        const targetFav = favList?.list?.find(
            (item: { id: number }) => item.id === favId
        );

        if (!targetFav) {
            throw createError({
                statusCode: 404,
                statusMessage: "Not found",
                message: "不存在该收藏夹",
            });
        }

        const cacheKey = [
            "bilibili",
            userID,
            "fav",
            favId,
            "page",
            page,
            "ps",
            DEFAULT_PAGE_SIZE,
        ].join("-");

        const cache = WPCache();
        let rawData = await cache.get(cacheKey);

        if (!rawData) {
            const res = await axios.get(
                "https://api.bilibili.com/x/v3/fav/resource/list",
                {
                    headers: {
                        Cookie: sysConfig?.sysBilibiliUserCookie ?? "",
                        "User-Agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
                        Origin: "https://space.bilibili.com",
                        Referer: "https://space.bilibili.com/",
                    },
                    params: {
                        media_id: favId,
                        pn: page,
                        ps: DEFAULT_PAGE_SIZE,
                        platform: "web",
                    },
                }
            );

            rawData = res.data?.data ?? null;

            if (rawData) {
                await cache.set(cacheKey, rawData, 900);
            }
        }

        if (!rawData) {
            return {
                medias: [],
                pagination: emptyPagination(page),
            };
        }

        const totalItems = rawData.info?.media_count ?? 0;
        const totalPages = Math.ceil(totalItems / DEFAULT_PAGE_SIZE);

        return {
            medias: rawData.medias ?? [],
            pagination: {
                current_page: page,
                total_pages: totalPages,
                total_items: totalItems,
                per_page: DEFAULT_PAGE_SIZE,
            },
        };
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: String(error),
        });
    }
});

function emptyPagination(page: number) {
    return {
        current_page: page,
        total_pages: 0,
        total_items: 0,
        per_page: DEFAULT_PAGE_SIZE,
    };
}
