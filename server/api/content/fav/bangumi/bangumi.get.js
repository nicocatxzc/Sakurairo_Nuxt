export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        
        const sysConfig = await getThemeSysConfig()
        const userID = sysConfig?.sysBangumiUserID ?? null;

        if(!userID) return;

        const page = parseInt(query.page) || 1;

        const cache = WPCache();
        const cacheKey = `bangumi-${userID}`;
        const perPage = query?.per_page ?? 12;

        // 尝试从缓存获取数据
        let cachedData = await cache.get(cacheKey);
        let collections = [];

        if (cachedData) {
            // 解析缓存数据
            try {
                const parsedData = JSON.parse(cachedData);
                collections = parsedData.data || [];
            } catch {
                // 缓存数据无效，清空缓存
                await cache.remove(cacheKey);
                cachedData = null;
            }
        }

        // 如果缓存中没有数据，从 API 获取
        if (!cachedData) {
            const apiUrl = `https://api.bgm.tv/v0/users/${userID}/collections`;

            try {
                const response = await $fetch(apiUrl, {
                    headers: {
                        "User-Agent":
                            "nicocatxzc/hachimi(https://github.com/nicocatxzc/hachimi):WordPressTheme",
                    },
                });

                const data = response;

                // 过滤符合条件的数据
                if (data?.data && Array.isArray(data.data)) {
                    collections = data.data.filter((item) => {
                        return (
                            [2, 3].includes(item.type) &&
                            item.subject_type === 2
                        );
                    });
                }

                // 将数据存入缓存，设置1小时过期
                await cache.set(
                    cacheKey,
                    JSON.stringify({
                        data: collections,
                        timestamp: Date.now(),
                    }),
                    1800
                );
            } catch (error) {
                console.error("访问Bangumi出错:", error);
                throw new Error(`访问出错: ${error.message}`);
            }
        }

        // 如果没有数据
        if (!collections.length) {
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
        const formattedData = collections.map((item) => {
            const subject = item.subject || {};
            let tags = [];
            subject?.tags.forEach(tag => {
                tags.push(tag.name)
            });
            const progress =
                subject?.eps && subject.eps > 0 && item.ep_status
                    ? (item.ep_status / subject.eps) * 100
                    : 0;
            return {
                name: subject.name || "",
                name_cn: subject.name_cn || "",
                date: subject.date || "",
                summary: subject.short_summary || "",
                url: `https://bgm.tv/subject/${subject.id || ""}`,
                images: subject.images?.large || "",
                eps: subject.eps || 1,
                ep_status: item.ep_status || 0,
                tags,
                progress: progress,
            };
        });

        // 分页处理
        const totalItems = formattedData.length;
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
