export default defineEventHandler(async (event) => {
    const auth = await useValidate(event);
    if (!auth?.roles.includes("administrator") ) {
        return{}
    }
    const config = await getThemeSysConfig();
    return config;
});
