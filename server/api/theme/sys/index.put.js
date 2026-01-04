export default defineEventHandler(async (event) => {
    const auth = await useValidate(event);
    if (!auth?.roles.includes("administrator") ) {
        throw new Error("非管理员禁止操作");
    }

    const option = useOptionAPI();

    const res = option.set("theme_sys", event);

    return res;
});
