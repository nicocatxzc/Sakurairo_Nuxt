export default defineEventHandler(async (event) => {
    deleteCookie(event, "auth_token");
    return { message: "注销成功" };
});
