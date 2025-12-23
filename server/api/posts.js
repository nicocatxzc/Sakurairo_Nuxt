function usePostQuery(settings, query = {}) {
    let queryPart = "";
    if (query?.after || query?.search) {
        queryPart = `
        (
            ${query?.after ? `$after: String` : ""}
            ${query?.search ? `$search: String` : ""}
        )
        `;
    }
    const GetPosts = /* GraphQL */ `
        query Posts
            ${queryPart}
         {
            posts(
                first: ${query?.first ? Number(query.first) : 10}
                ${query?.after ? `after: $after` : ""}
                where: {
                    orderby: { field: DATE, order: DESC }
                    ${query?.search ? `search: $search` : ""}
                    ${
                        query?.sticky
                            ? `in: [${settings.sticky_post_ids.join(",")}]`
                            : ""
                    }
                    ${
                        !query?.sticky
                            ? `notIn: [${settings.sticky_post_ids.join(",")}]`
                            : ""
                    }
                    ${query?.tagId ? `tagId:"` + Number(query.tagId) + `"` : ``}
                    ${
                        query?.categoryId
                            ? "categoryId:" + Number(query.categoryId)
                            : ""
                    }
                    ${query?.authorId ? "author:" + Number(query.authorId) : ""}
                }
            ) {
                nodes {
                    title(format: RENDERED)
                    slug
                    excerpt
                    featuredImage {
                        node {
                            sourceUrl(size: MEDIUM_LARGE)
                            altText
                        }
                    }
                    isSticky
                    author {
                        node {
                            nicename
                            slug
                        }
                    }
                    modifiedGmt
                    hasPassword
                    uri
                    categories {
                        nodes {
                            name
                            uri
                        }
                    }
                    tags {
                        nodes {
                            name
                            uri
                        }
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    `;
    let queryVar = {};
    if (query?.after) {
        queryVar.after = query.after;
    }
    if (query?.search) {
        queryVar.search = query.search;
    }
    return useWPGraphql(GetPosts, queryVar);
}

export default defineEventHandler(async (event) => {
    try {
        const settings = await useWPsettings();
        const query = getQuery(event);

        // 每页文章数
        const defaultPerPage = settings.posts_per_page || 10;
        const per_page = Number(query.per_page) || defaultPerPage;

        // 读取查询参数
        const after = query?.after || null;

        const fetchSticky = (first, after = null) =>
            usePostQuery(settings, {
                ...query,
                sticky: true,
                first,
                after,
            });

        const fetchNormal = (first, after = null) =>
            usePostQuery(settings, {
                ...query,
                sticky: false,
                first,
                after,
            });
        const page = query?.page ?? 1;
        const stickyleft =
            settings.sticky_post_ids.length - per_page * (page - 1);
        // 没有分页查询第一页
        if (!after) {
            // 置顶数量够
            if (stickyleft >= per_page) {
                const stickyRes = await fetchSticky(per_page);
                const stickyPosts = stickyRes.data?.posts?.nodes ?? [];
                return {
                    posts: {
                        nodes: stickyPosts,
                        pageInfo: {
                            hasNextPage: true,
                            endCursor: stickyRes.data.posts.pageInfo.endCursor,
                        },
                    },
                };
            }
            // 置顶数量不足
            if (stickyleft > 0 && stickyleft < per_page) {
                const stickyRes = await fetchSticky(stickyleft);
                const stickyPosts = stickyRes.data?.posts?.nodes ?? [];
                const normalRes = await fetchNormal(per_page - stickyleft);
                const normalPosts = normalRes.data?.posts?.nodes ?? [];
                return {
                    posts: {
                        nodes: [...stickyPosts, ...normalPosts],
                        pageInfo: normalRes.data.posts.pageInfo,
                    },
                };
            }

            // 根本就没有置顶文章
            if (stickyleft <= 0) {
                const normalRes = await fetchNormal(per_page);
                const normalPosts = normalRes.data?.posts?.nodes ?? [];
                return {
                    posts: {
                        nodes: [...normalPosts],
                        pageInfo: normalRes.data.posts.pageInfo,
                    },
                };
            }
        } else {
            // 有分页

            // 置顶文章正好发完，上页游标对这页无效
            if (stickyleft === 0) {
                const normalRes = await fetchNormal(per_page);
                const normalPosts = normalRes.data?.posts?.nodes ?? [];
                return {
                    posts: {
                        nodes: [...normalPosts],
                        pageInfo: normalRes.data.posts.pageInfo,
                    },
                };
            }

            // 没有置顶文章了，这时候应该有上一页的普通文章游标
            if (stickyleft < 0) {
                const normalRes = await fetchNormal(per_page, after);
                const normalPosts = normalRes.data?.posts?.nodes ?? [];
                return {
                    posts: {
                        nodes: [...normalPosts],
                        pageInfo: normalRes.data.posts.pageInfo,
                    },
                };
            }

            // 置顶文章数量有余
            if (stickyleft >= per_page) {
                const stickyRes = await fetchSticky(per_page, after);
                const stickyPosts = stickyRes.data?.posts?.nodes ?? [];
                return {
                    posts: {
                        nodes: stickyPosts,
                        pageInfo: {
                            hasNextPage: true,
                            endCursor: stickyRes.data.posts.pageInfo.endCursor,
                        },
                    },
                };
            }

            // 置顶文章数量不足
            if (stickyleft < per_page) {
                const stickyRes = await fetchSticky(
                    settings.sticky_post_ids.length - per_page,
                    after
                );
                const stickyPosts = stickyRes.data?.posts?.nodes ?? [];
                // 上一页的游标来自置顶文章，这边不用，获取置顶文章缺失的数量
                const normalRes = await fetchNormal(per_page - stickyleft);
                const normalPosts = normalRes.data?.posts?.nodes ?? [];
                return {
                    posts: {
                        nodes: [...stickyPosts, ...normalPosts],
                        pageInfo: normalRes.data.posts.pageInfo,
                    },
                };
            }
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: error?.message,
        });
    }
});
