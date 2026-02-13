<template>
    <HtmlRender
        :html="htmlContent"
        :components-map="componentsMap"
        container-tag="article"
    />
</template>

<script setup>
import CodeHighlight from "@/components/CodeHighlight.vue";
import TemplateFriendLink from "@/components/Template/FriendLink.vue";
import TemplateBangumi from "@/components/Template/Bangumi.vue";
import TemplateBilibiliFavlist from "@/components/Template/BilibiliFavlist.vue";
import TemplateArchive from "@/components/Template/Archive.vue"
import TemplateGithubRepoCard from "@/components/Template/GithubRepoCard.vue"
import HtmlRender from "@/components/Html/Render.vue";
const { html } = defineProps({
    html: {
        type: String,
        required: true,
    },
});

const htmlContent = html ? html : "";

function mapSrcsetToIPX(srcset) {
    if (!srcset) return undefined;

    return srcset
        .split(",")
        .map((part) => {
            const seg = part.trim().split(/\s+/);
            const url = seg[0];
            const descriptor = seg[1] || "";
            const ipxUrl = getNuxtImg(url);
            return descriptor ? `${ipxUrl} ${descriptor}` : ipxUrl;
        })
        .join(", ");
}

function decodeBase64(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
}

/* componentsMap 规则：
 - conditions(node): 判断是否匹配
 - component: Vue 组件名称
 - renderChildren: 是否递归渲染子节点，默认true
 - propsMapper 传递给组件的数据
 - listenersMapper 事件映射
*/
const componentsMap = {
    // 高亮组件
    codeBlock: {
        conditions(node) {
            return node.type === "tag" && node.name === "pre";
        },
        component: CodeHighlight,

        propsMapper(node) {
            // 查找<code>
            const codeNode = node.children?.find(
                (c) => c.type === "tag" && c.name === "code",
            );

            let codeText = "";
            let detectedLang = "auto";

            if (codeNode) {
                // 收集code内容
                codeText = codeNode.children
                    .filter((c) => c.type === "text")
                    .map((c) => c.text)
                    .join("");

                // 获取language
                const classText = codeNode.attrs?.class || "";
                const m = classText.match(/language-([\w-]+)/);
                if (m) {
                    detectedLang = m[1];
                }
            } else {
                // 没有code
                codeText = node.children
                    .filter((c) => c.type === "text")
                    .map((c) => c.text)
                    .join("");

                detectedLang = "auto";
            }

            // 传递code和lang
            return {
                code: codeText,
                lang: detectedLang,
                ...node.attrs,
            };
        },
    },

    // 链接
    alink: {
        conditions(node) {
            // a标签
            if (!(node.type === "tag" && node.name === "a")) return false;
            // 相对链接
            if (!node?.attrs?.href?.startsWith("/")) return false;
            // 排除灯箱
            if (
                (node.children || []).some(
                    (child) => child.type === "tag" && child.name === "img",
                )
            )
                return false;

            return true;
        },
        component: "a",
        propsMapper(node) {
            return {
                href: node.attrs.href,
                onClick: (e) => {
                    // 修饰键 / 新标签 / 右键菜单，全部放行
                    if (
                        e.defaultPrevented ||
                        e.metaKey ||
                        e.ctrlKey ||
                        e.shiftKey ||
                        e.altKey ||
                        e.button !== 0
                    ) {
                        return;
                    }

                    e.preventDefault();
                    navigateTo(node.attrs.href);
                },
            };
        },
    },

    lightboxImage: {
        conditions(node) {
            // 必须是 a 标签
            if (!(node.type === "tag" && node.name === "a")) return false;

            // 必须直接或间接包着 img
            return (node.children || []).some(
                (child) => child.type === "tag" && child.name === "img",
            );
        },

        component: "img",
        renderChildren: false,
        propsMapper(node) {
            // 找到第一个 img
            const img = (node.children || []).find(
                (c) => c.type === "tag" && c.name === "img",
            );

            if (!img) return {};

            // 原始 src：优先 img.src，其次 a.href
            const rawSrc = img.attrs?.src || node.attrs?.href || "";
            const nuxtImg = getNuxtImg(rawSrc);

            return {
                // 保留 img 原有属性
                ...img.attrs,

                // src 替换为 Nuxt Image 计算后的链接
                src: nuxtImg,

                srcset: mapSrcsetToIPX(img.attrs?.srcset),
                // 打灯箱标记
                "data-zoomable": "",
            };
        },
    },

    image: {
        conditions(node) {
            if (!(node.type === "tag" && node.name === "img")) return false;

            return true;
        },
        component: "img",

        propsMapper(node) {
            const nuxtImg = getNuxtImg(node.attrs?.src || "");
            return {
                ...node.attrs,
                srcset: mapSrcsetToIPX(node.attrs?.srcset),
                src: nuxtImg,
            };
        },
    },

    // 友链模板
    friendlink: {
        conditions(node) {
            if (!(node.type === "tag" && node.name === "div")) return false;
            if (node.attrs.id == "hachimi-friend-link") return true;
            return false;
        },
        component: TemplateFriendLink,
        propsMapper(node) {
            return {
                ...node.attrs,
            };
        },
    },

    bangumi: {
        conditions(node) {
            if (!(node.type === "tag" && node.name === "div")) return false;
            if (node.attrs.id == "hachimi-bangumi") return true;
            return false;
        },
        component: TemplateBangumi,
        propsMapper(node) {
            return {
                ...node.attrs,
            };
        },
    },

    bilibiliFavlist: {
        conditions(node) {
            if (!(node.type === "tag" && node.name === "div")) return false;
            if (node.attrs.id == "hachimi-favlist") return true;
            return false;
        },
        component: TemplateBilibiliFavlist,
        propsMapper(node) {
            return {
                ...node.attrs,
            };
        },
    },

    archive: {
        conditions(node) {
            if (!(node.type === "tag" && node.name === "div")) return false;
            if (node.attrs.id == "hachimi-archive") return true;
            return false;
        },
        component: TemplateArchive,
        propsMapper(node) {
            return {
                ...node.attrs,
            };
        },
    },

    markdown: {
        conditions(node) {
            return (
                node.type === "tag" &&
                node.name === "div" &&
                node.attrs?.id === "hachimi-markdown"
            );
        },

        component: HtmlRender,
        renderChildren: false,

        propsMapper(node) {
            const encoded = node.attrs?.["data-md"];

            let rawMarkdown = "";

            if (encoded) {
                try {
                    rawMarkdown = decodeBase64(encoded);
                } catch (e) {
                    console.warn("Markdown base64 decode failed", e);
                }
            }

            if (!rawMarkdown) {
                const pre = (node.children || []).find(
                    (c) => c.type === "tag" && c.name === "pre",
                );
                rawMarkdown = (pre?.children || [])
                    .filter((c) => c.type === "text")
                    .map((c) => c.text)
                    .join("");
            }

            const html = parseMarkdown(rawMarkdown);

            return {
                html,
                "components-map": componentsMap,
                "container-tag": "article",
            };
        },
    },

    githubRepoCard: {
        conditions(node) {
            if (!(node.type === "tag" && node.name === "div")) return false;
            if (node.attrs.class == "hachimi-ghcard") return true;
            return false;
        },
        component: TemplateGithubRepoCard,
        propsMapper(node) {
            return {
                ...node.attrs,
            };
        },
    },
};
</script>
