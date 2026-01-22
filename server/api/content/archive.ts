export default defineEventHandler(async (event) => {
    const ArchiveQuery = /* GraphQL */ `
        query Comments {
            posts(
                first: 9999
                where: { orderby: { field: DATE, order: DESC } }
            ) {
                nodes {
                    title(format: RENDERED)
                    dateGmt
                    uri
                }
            }
        }
    `;
    const res = await useWPGraphql(ArchiveQuery)
    return res;
});
