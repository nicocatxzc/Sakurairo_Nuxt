export default async function useLocalSearch() {
    const data = await $fetch("/api/content/search-index");
    const posts = (data?.posts?.nodes || []).map(
        (post: {
            uri: string;
            title: string;
            excerpt: string;
            content: string;
        }) => ({
            uri: post.uri,
            title: htmlToText(post.title || ""),
            excerpt: htmlToText(post.excerpt || ""),
            content: htmlToText(post.content || ""),
        })
    );

    function htmlToText(html: string) {
        const el = document.createElement("div");
        el.innerHTML = html;
        return el.innerText;
    }

    function escapeRegExp(str: string) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function countHits(text: string, reg: RegExp): number {
        if (!text) return 0;
        return [...text.matchAll(reg)].length;
    }

    function markFirst(text: string, reg: RegExp): string {
        return text.replace(reg, (m) => `<mark>${m}</mark>`);
    }

    function makeSnippet(
        text: string,
        reg: RegExp,
        radius = 20
    ): string | null {
        const match = reg.exec(text);
        if (!match) return null;

        const index = match.index;
        const start = Math.max(0, index - radius);
        const end = Math.min(text.length, index + match[0].length + radius);

        return (
            (start > 0 ? "…" : "") +
            text.slice(start, end).replace(reg, (m) => `<mark>${m}</mark>`) +
            (end < text.length ? "…" : "")
        );
    }

    function search(keyword: string) {
        if (!keyword || !keyword.trim()) return [];

        const safe = escapeRegExp(keyword.trim());
        const reg = new RegExp(safe, "gi");

        const results = [];

        for (const post of posts) {
            const titleHits = countHits(post.title, reg);
            const excerptHits = countHits(post.excerpt, reg);
            const contentHits = countHits(post.content, reg);

            const totalHits = titleHits + excerptHits + contentHits;
            if (totalHits === 0) continue;

            // title
            const markedTitle =
                titleHits > 0 ? markFirst(post.title, reg) : post.title;

            // snippet
            let snip =
                makeSnippet(post.excerpt, reg) ||
                makeSnippet(post.content, reg) ||
                post.content.slice(0, 40) + "…";

            results.push({
                uri: post.uri,
                title: markedTitle,
                snip,
                _score: {
                    titleHits,
                    totalHits,
                },
            });
        }

        // 排序 标题命中置顶，正文命中多优先
        results.sort((a, b) => {
            if (a._score.titleHits > 0 && b._score.titleHits === 0) return -1;
            if (a._score.titleHits === 0 && b._score.titleHits > 0) return 1;
            return b._score.totalHits - a._score.totalHits;
        });

        // 清理内部字段
        return results.map(({ _score, ...rest }) => rest);
    }

    return { search };
}
