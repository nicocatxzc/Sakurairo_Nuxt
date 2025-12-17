import useWPGraphql from "../utils/useWPGraphql";

const GetPost = /* GraphQL */ `
    query GetPost($postId: ID!) {
        post(id: $postId, idType: DATABASE_ID) {
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
            title(format: RENDERED)
            excerpt(format: RENDERED)
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
    }
`;

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        if (query.id) {
            let content = await useWPGraphql(GetPost, { postId: query.id });
            return content.data;
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "耄耋死了",
            message: error?.toString() || "请求出错",
        });
    }
});
