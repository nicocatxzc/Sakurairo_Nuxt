export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        const path = query?.path;

        let res = await useWP.get("/wp-json/hachimi/v1/route", {
            params: {
                path: path,
            },
        });
        let page = res.data;

        let content;
        switch (page.type) {
            case "home":
                // 首页默认渲染
                return page;

            case "search":
                // 获取搜索结果
                return page;

            case "author":
                // 获取作者文章列表
                content = await $fetch("/api/posts", {
                    query: {
                        author: page.author_id,
                    },
                });
                return {
                    ...page,
                    content: content.posts,
                };

            case "category":
                // 获取分类文章列表
                content = await $fetch("/api/posts", {
                    query: {
                        categoryId: page.id,
                    },
                });
                return {
                    ...page,
                    content: content.posts,
                };

            case "tag":
                // 获取标签文章列表
                content = await $fetch("/api/posts", {
                    query: {
                        tagId: page.id,
                    },
                });
                return {
                    ...page,
                    content: content.posts,
                };

            case "taxonomy":
                // 获取大类文章列表 ?
                // content =  await $fetch("/api/posts",{
                //     query: {
                //         author:page.author_id
                //     }
                // })
                // return {
                //     ...page,
                //     content:content.data.posts
                // }
                break;
            case "single": {
                // 获取文章内容
                content = await $fetch("/api/content/post", {
                    query: {
                        id: page.id,
                    },
                });

                const styles = await useWPPageStyles(path);

                return {
                    ...page,
                    content: content.post,
                    styles,
                };
            }

            case "page": {
                // 获取页面内容
                content = await $fetch("/api/content/page", {
                    query: {
                        id: page.id,
                    },
                });

                const styles = await useWPPageStyles(path);

                return {
                    ...page,
                    content: content.page,
                    styles,
                };
            }

            case "static": {
                // 静态文件
                return {
                    ...page,
                };
            }

            case "404":
                // 404无信息
                return page;

            default:
                return {
                    type: "404",
                };
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: error?.toString() || "请求出错",
        });
    }
});
