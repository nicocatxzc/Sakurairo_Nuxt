/**
 * 从头像字面量/字符串以及主题丢失头像配置中返回一个合适的头像url地址字符串
 * @param {string | object} avatar 
 * @returns {string}
 */
export function getUserAvatar(avatar) {
    const themeConfig = useThemeConfig();

    // 如果目标是字符串
    if (typeof avatar === "string") {
        return avatar;
    }

    // 如果目标是对象
    if (avatar && typeof avatar === "object") {
        if (avatar.url_96) return avatar.url_96;
        if (avatar.url_150) return avatar.url_150;
        if (avatar.url_300) return avatar.url_300;

        for (const key in avatar) {
            if (
                typeof avatar[key] === "string" &&
                avatar[key].startsWith("http")
            ) {
                return avatar[key];
            }
        }
    }

    // 返回占位符
    return themeConfig.value?.missingAvatarPlaceholder || "";
}
