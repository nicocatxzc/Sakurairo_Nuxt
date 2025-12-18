import useWPGraphql from "../utils/useWPGraphql";

export default defineEventHandler(async (event) => {
    try {
        let put = await readBody(event);
        let res = useDecrypt(put.verify, put.token, put.payload);

        return res;
    } catch {
        throw createError({
            statusCode: 500,
            statusMessage: "Unexpected Data",
            message: "这不是预期的结构",
        });
    }
});
