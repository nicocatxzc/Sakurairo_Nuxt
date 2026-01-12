export default function WPCache() {
    return {
        /**
         * 写入缓存
         * @param key 缓存 key
         * @param value 缓存内容
         * @param expire 秒数，默认1小时
         */
        async set(key: string, value: string, expire = 3600) {
            const res = await useWP.put("/wp-json/hachimi/v1/cache", {
                key,
                value,
                expire,
            });
            return res.data;
        },

        /**
         * 获取缓存
         * @param key 缓存 key
         */
        async get(key: string) {
            try {
                const res = await useWP.get("/wp-json/hachimi/v1/cache", {
                    params: { key },
                });
                return res?.data?.value ?? null;
            } catch (error) {
                console.error("缓存获取失败", error);
                return null;
            }
        },

        /**
         * 删除缓存
         * @param key 缓存 key
         */
        async remove(key: string) {
            try {
                // WordPress transient 没有直接 DELETE API，设置过期时间为0
                await useWP.delete("/wp-json/hachimi/v1/cache", {
                    params: { key },
                });
                return true;
            } catch (err) {
                console.error("缓存移除失败", err);
                throw err;
            }
        },
    };
}
