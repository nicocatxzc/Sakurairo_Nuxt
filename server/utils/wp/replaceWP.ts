export default function replaceDomain(input: string | object) {
    const nuxtconfig = useRuntimeConfig();
    const wpUrl = nuxtconfig.wordpressURL.replace(/\/+$/, "");

    // 内部处理函数
    const processString = (str: string): string => {
        let result = str;
        result = result.replaceAll(`${wpUrl}/wp-includes`, "/includes");
        result = result.replaceAll(`${wpUrl}/wp-content`, "/content");
        result = result.replaceAll(`${wpUrl}/sitemap`, "/sitemap");
        result = result.replaceAll(`${wpUrl}/`,"/");
        return result;
    };

    // 如果是对象
    if (typeof input === "object" && input !== null) {
        const jsonString = JSON.stringify(input);
        const processedString = processString(jsonString);
        try {
            return JSON.parse(processedString);
        } catch {
            return processedString;
        }
    }

    // 如果是字符串
    if (typeof input === "string") {
        return processString(input);
    }

    return input;
}
