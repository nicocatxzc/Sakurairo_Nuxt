import axios from "axios";

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);

        const sysConfig = await useThemeSysConfig();
        const userID = sysConfig?.sysBilibiliUserId ?? null;

        if (!userID) return;

        const page = query?.page ?? 1;
        const perPage = query?.per_page ?? 15;

        const cache = useCache();
        const cacheKey = `bilibili-${userID}-${page}-${perPage}`;

        // 尝试从缓存获取数据
        let cachedData = await cache.get(cacheKey);
        let list = {};

        if (cachedData) {
            // 解析缓存数据
            try {
                const parsedData = JSON.parse(cachedData);
                list = parsedData?.data || {};
            } catch {
                // 缓存数据无效，清空缓存
                await cache.remove(cacheKey);
                cachedData = null;
            }
        }

        if (!list?.data?.list) {
            list = await axios.get(
                "https://api.bilibili.com/x/space/bangumi/follow/list",
                {
                    headers: {
                        Cookie: sysConfig?.sysBilibiliUserCookie ?? "",
                        "User-Agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
                        Origin: "https://space.bilibili.com",
                        Referer: "https://space.bilibili.com/",
                    },
                    params: {
                        vmid: sysConfig.sysBilibiliUserId,
                        pn: page,
                        ps: perPage,
                        type: query?.type == "movie" ? 2 : 1,
                    },
                }
            );

            await cache.set(
                cacheKey,
                JSON.stringify({
                    data: list.data,
                    timestamp: Date.now(),
                }),
                1800
            );
            list = list.data
        }

        // 如果没有数据
        if (!list?.data?.list) {
            return {
                success: false,
                message: "没有数据",
                data: [],
                pagination: {
                    current_page: page,
                    total_pages: 0,
                    total_items: 0,
                    per_page: perPage,
                },
            };
        }

        // 处理数据结构
        const formattedData = list.data.list.map((item) => {
            return {
                name: item.title || "",
                name_cn: item.title || "",
                date: item.publish.pub_time || "",
                summary: item.evaluate || "",
                url: item.url,
                images: item.cover || "",
                eps: item.total_count || 1,
                ep_status: item.ep_status || 0,
                progress: item.progress,
                tags: item.styles,
            };
        });

        // 分页处理
        const totalItems = list.data.total;
        const totalPages = Math.ceil(totalItems / perPage);
        const offset = (page - 1) * perPage;
        const paginatedData = formattedData.slice(offset, offset + perPage);

        return {
            success: true,
            data: paginatedData,
            pagination: {
                current_page: page,
                total_pages: totalPages,
                total_items: totalItems,
                per_page: perPage,
                has_next: page < totalPages,
            },
        };
    } catch (error) {
        console.error("Bangumi handler error:", error);

        return {
            success: false,
            message: error.message || "An error occurred",
            data: [],
            pagination: {
                current_page: 1,
                total_pages: 0,
                total_items: 0,
                per_page: 12,
            },
        };
    }
});
