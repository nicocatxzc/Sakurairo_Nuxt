import type { H3Event, EventHandlerRequest } from "h3";
export default async function getSitemap(
    pathname: string,
    event: H3Event<EventHandlerRequest>
) {
    try {
        switch (pathname) {
            case "/sitemap-post.xml":
                const posts = await getPageSitemap(event);
                return posts;
            case "/sitemap-page.xml":
                const pages = await getPageSitemap(event);
                return pages;
            case "/sitemap-category.xml":
                const categories = await getCategories(event);
                return categories;
            case "/sitemap-tag.xml":
                const tags = await getTags(event);
                return tags;

            default:
                const sitemap = await getMainSitemap(event);
                return sitemap;
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Internal Server Error`,
            message: String(error),
        });
    }
}

async function getMainSitemap(event: H3Event<EventHandlerRequest>) {
    const req = useSiteOrigin(event);

    return /*xml*/ `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

    <sitemap>
        <loc>${req.baseURL}/sitemap-post.xml</loc>
    </sitemap>

    <sitemap>
        <loc>${req.baseURL}/sitemap-page.xml</loc>
    </sitemap>

    <sitemap>
        <loc>${req.baseURL}/sitemap-category.xml</loc>
    </sitemap>

    <sitemap>
        <loc>${req.baseURL}/sitemap-tag.xml</loc>
    </sitemap>

</sitemapindex>
`;
}

async function getPageSitemap(event: H3Event<EventHandlerRequest>) {
    const query = /* GraphQL */ `
        query Pages {
            pages(first: 99999) {
                nodes {
                    uri
                    modifiedGmt
                }
            }
        }
    `;
    const req = useSiteOrigin(event);
    const content = await useWPGraphql(query);
    let pages: string[] = [];

    content.data.pages.nodes.forEach((page: { uri: any; modifiedGmt: any }) => {
        pages.push(
            /* xml */ `<url><loc>${req.baseURL}${page?.uri}</loc><lastmod>${page?.modifiedGmt}</lastmod></url>`
        );
    });

    return /*xml*/ `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap-urls.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.join("\n")}
</urlset>
`;
}

async function getPostSitemap(event: H3Event<EventHandlerRequest>) {
    const query = /* GraphQL */ `
        query Posts {
            posts(first: 99999) {
                nodes {
                    uri
                    modifiedGmt
                }
            }
        }
    `;
    const req = useSiteOrigin(event);
    const content = await useWPGraphql(query);
    let posts: string[] = [];

    content.data.posts.nodes.forEach((post: { uri: any; modifiedGmt: any }) => {
        posts.push(
            /* xml */ `<url><loc>${req.baseURL}${post?.uri}</loc><lastmod>${post?.modifiedGmt}</lastmod></url>`
        );
    });

    return /*xml*/ `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap-urls.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${posts.join("\n")}
</urlset>
`;
}

async function getCategories(event: H3Event<EventHandlerRequest>) {
    const query = /* GraphQL */ `
        query categories {
            categories(first: 99999) {
                nodes {
                    uri
                }
            }
        }
    `;
    const req = useSiteOrigin(event);
    const content = await useWPGraphql(query);
    let categories: string[] = [];

    content.data.categories.nodes.forEach((category: { uri: any }) => {
        categories.push(
            /* xml */ `<url><loc>${req.baseURL}${category?.uri}</loc></url>`
        );
    });

    return /*xml*/ `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap-urls.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categories.join("\n")}
</urlset>
`;
}

async function getTags(event: H3Event<EventHandlerRequest>) {
    const query = /* GraphQL */ `
        query tags {
            tags (first: 99999) {
                nodes {
                    uri
                }
            }
        }
    `;
    const req = useSiteOrigin(event);
    const content = await useWPGraphql(query);
    let tags: string[] = [];

    content.data.tags.nodes.forEach((tag: { uri: any }) => {
        tags.push(/* xml */ `<url><loc>${req.baseURL}${tag?.uri}</loc></url>`);
    });

    return /*xml*/ `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap-urls.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${tags.join("\n")}
</urlset>
`;
}
