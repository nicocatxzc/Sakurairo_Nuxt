export default async function (query: string,variables?:Record<string, any>,data?:Record<string,any>) {
    try {
        let res = await useWP.post("/graphql", {
            query: query,
            variables: variables,
            ...data,
        });
        delete res.data.extensions;
        return JSON.parse(replaceWP(JSON.stringify(res.data)));

    } catch (error) {
        console.error("请求失败",query);
        throw error;
    }
}
