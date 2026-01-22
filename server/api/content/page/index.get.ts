const GetPage = /* GraphQL */ `
    query GetPage($pageId: ID!) {
        page(id: $pageId, idType: DATABASE_ID) {
            author {
                node {
                    nicename
                    slug
                    avatar {
                        url
                    }
                }
            }
            content(format: RENDERED)
            featuredImage {
                node {
                    sourceUrl
                    altText
                    caption
                    description(format: RENDERED)
                }
            }
            hasPassword
            modifiedGmt
            commentStatus
            commentCount
            title(format: RENDERED)
        }
    }
`;
export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        if (query.id) {
            let content = await useWPGraphql(GetPage, { pageId: query.id });
            return JSON.parse(replaceWP(JSON.stringify(content.data), event));
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: error?.toString() || "请求出错",
        });
    }
});
