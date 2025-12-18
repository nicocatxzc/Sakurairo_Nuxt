import useWPGraphql from "../utils/useWPGraphql";

const insertComment = /* GraphQL */ `
    mutation InsertComment($input: CreateCommentInput!) {
        createComment(input: $input) {
            comment {
                databaseId
                content(format: RENDERED)
                date
                parent {
                    node {
                        databaseId
                        author {
                            name
                        }
                    }
                }
            }
        }
    }
`;

function buildInput(data) {
    const input = {
        commentOn: data.postId,
        content: data.comment,
        author: data.name,
        authorEmail: data.email,
    };

    if (data.link && data.link.trim() !== "") {
        input.authorUrl = data.link;
    }

    if (typeof data.parent === "number" && data.parent > 0) {
        input.parent = data.parent;
    }

    return input;
}

export default defineEventHandler(async (event) => {
    try {
        let put = await readBody(event);
        let req = await useDecrypt(put.verify, put.token, put.payload);

        const { comment, email, link, name, postId, parent } = JSON.parse(req);
        const token = getCookie(event, "auth_token");

        let vars = {
            input: buildInput({
                comment,
                email,
                link,
                name,
                postId,
                parent,
            }),
        };

        const res = await useWPGraphql(insertComment, vars, {
            token,
        });

        return res.data.createComment;
    } catch {
        throw createError({
            statusCode: 500,
            statusMessage: "Unexpected Data",
            message: "这不是预期的结构",
        });
    }
});
