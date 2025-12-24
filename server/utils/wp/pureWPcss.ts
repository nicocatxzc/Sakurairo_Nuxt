import postcss from "postcss";
import selectorParser from "postcss-selector-parser";

export default function pureWPcss(css: string) {
    const root = postcss.parse(css);

    root.walkRules((rule) => {
        const selectors = rule.selectors ?? [];

        // 保留:root变量
        if (
            selectors.length === 1 &&
            selectors[0] === ":root" &&
            rule.nodes?.every(
                (d) => d.type === "decl" && d.prop.startsWith("--wp--")
            )
        ) {
            return;
        }

        // 保留布局类
        if (
            selectors.some(
                (s) =>
                    s.includes(".is-layout-") ||
                    s.includes(".wp-site-blocks") ||
                    s.includes(".has-global-padding")
            )
        ) {
            return;
        }

        // 保留区块
        if (selectors.some((s) => s.includes(".wp-block-"))) {
            return;
        }

        // 正则排除 tag + :where(:not(...))
        const hasTagWhereNot = selectors.some((s) =>
            /^[a-z]+:where\(:not\([^)]+\)\)/i.test(s.trim())
        );
        if (hasTagWhereNot) {
            rule.remove();
            return;
        }

        // 移除element
        const isElementRule = selectors.every(checkCssSelector);
        if (isElementRule) {
            rule.remove();
        }
    });

    return root.toString();
}

function checkCssSelector(selector: string): boolean {
    let hasTag = false;
    let hasForbidden = false;

    selectorParser((selectors) => {
        selectors.walk((node) => {
            if (node.type === "tag") hasTag = true;

            if (node.type === "pseudo" && node.value === ":where") {
                let foundNot = false;

                node.walk((child) => {
                    if (child.type === "pseudo" && child.value === ":not") {
                        foundNot = true;
                    }
                });

                if (foundNot) {
                    hasForbidden = true;
                }
            }

            if (
                node.type === "class" ||
                node.type === "id" ||
                node.type === "attribute"
            ) {
                // 允许 wp-block / is-layout / has-
                if (
                    node.value.startsWith("wp-block") ||
                    node.value.startsWith("is-layout") ||
                    node.value.startsWith("has-") // 保留工具类
                ) {
                    return;
                }
                hasForbidden = true;
            }
        });
    }).processSync(selector);

    return hasTag && !hasForbidden;
}
