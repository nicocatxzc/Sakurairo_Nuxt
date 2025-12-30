export default defineEventHandler(async (event) => {
    const query = /* GraphQL */ `
        query index {
            posts(first: 200) {
                nodes {
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
                    uri
                }
            }
        }
    `;

    try {
        const res = await useWPGraphql(query);
        return res.data;
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: String(error),
        });
    }
});
