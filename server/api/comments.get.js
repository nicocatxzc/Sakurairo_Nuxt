import useWPGraphql from "../utils/useWPGraphql";
import useWPsettings from "../utils/useWPsettings";

function useCommentQuery(query = {}) {
    let queryPart = "";
    if (query?.after || query?.search) {
        queryPart = `
        (
            ${query?.after ? `$after: String` : ""}
            ${query?.search ? `$search: String` : ""}
        )
        `;
    }

    const GetComments = /* GraphQL */ `
        query Comments
        ${queryPart}
        {
            comments(
                first: ${query?.first ? Number(query.first) : 10}
                ${query?.after ? `after: $after` : ""}
                where: {
                    ${
                        query?.postId
                            ? `contentId: ${Number(query.postId)}
                                contentType: POST`
                            : ""
                    }
                    orderby: COMMENT_DATE
                    order: DESC
                    ${query?.search ? `search: $search` : ""}
                }
            ) {
                nodes {
                    id
                    databaseId
                    parentId
                    date
                    content
                    author {
                        node {
                            id
                            name
                            url
                            avatar {
                                url
                            }
                        }
                    }
                    parent {
                        node {
                            author {
                                name
                            }
                            databaseId
                        }
                }
                    uri
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    `;

    const queryVar = {};
    if (query?.after) queryVar.after = query.after;
    if (query?.search) queryVar.search = query.search;

    return useWPGraphql(GetComments, queryVar);
}

export default defineEventHandler(async (event) => {
    try {
        const settings = await useWPsettings();
        const query = getQuery(event);

        const postId = Number(query.postId);
        const hasPostId = !!postId;
        const hasSearch = !!query?.search;

        if (hasPostId === hasSearch) {
            throw createError({
                statusCode: 400,
                statusMessage: "Either postId or search must be provided",
            });
        }

        const defaultPerPage = settings?.comments_per_page || 10;
        const per_page = Number(query.per_page) || defaultPerPage;
        const after = query?.after || null;

        const res = await useCommentQuery({
            postId,
            first: per_page,
            after,
            search: query?.search,
        });

        return {
            comments: {
                nodes: res.data?.comments?.nodes ?? [],
                pageInfo: res.data?.comments?.pageInfo ?? {
                    hasNextPage: false,
                    endCursor: null,
                },
            },
        };
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Comments query failed",
            message: error?.message,
        });
    }
});
