import { useThemeConfigStore } from "#imports";
import type { ComputedRef } from "vue";

type HexColor = `#${string}`;
type RGBColor = `rgb(${number}, ${number}, ${number})`;
type RGBAColor = `rgba(${number}, ${number}, ${number}, ${number})`;
type Color = HexColor | RGBColor | RGBAColor;

export interface ThemeConfig {
    // 基础设置
    siteLogo: string;
    siteSeoKeyword: string;
    siteSeoDesc: string;
    siteSeoSource: Array<
        "excerpt" | "postContent" | "siteSeoDesc" | "siteDesc"
    >;

    // 全局设置 - 配色
    wordColorFirst: Color;
    wordColorSecond: Color;
    activeColor: Color;
    codeBlockBackgroundColor: Color;
    widgetTransparency: number;
    backgroundTransparency: number;
    backgroundBlur: number;
    wordColorFirstDark: Color;
    wordColorSecondDark: Color;
    activeColorDark: Color;
    codeBlockBackgroundColorDark: Color;
    widgetTransparencyDark: number;
    backgroundTransparencyDark: number;
    imgBrightDark: number;

    // 全局设置 - 字体设置
    globalFontSize: number;
    globalFontWeight: number;
    globalDefaultFont: string;
    extraFonts: Array<{
        fontName: string;
        link: string;
    }>;

    // 导航栏设置
    navLogo: string;
    navTitle: string;
    navTitleFont: string;
    navOptionFont: string;
    navbarDistribution: "left" | "right" | "center" | "space-evenly";
    navbarOptionMargin: number;
    navbarUserMenu: boolean;

    // 前台设置
    frontendDefaultBackground: string;
    toolbarFontsChoice: Array<{
        name: string;
    }>;
    frontendParticle: "off" | "sakura" | "snow" | "custom";
    particleAmount: number;
    particleMinSize: number;
    particleMaxSize: number;
    particleSpeed: number;
    particleConfig: string;

    // 页尾设置
    footerSakura: boolean;
    footerFont: string;
    footerHTML: string;

    // 搜索设置
    navbarSearch: boolean;
    liveSearchLocalIndex: boolean;

    // 其他设置
    topScrollProgress: boolean;
    topLoadingProgress: boolean;
    pageAutoLoad: number;
    missingImgPlaceholder: string;
    missingAvatarPlaceholder: string;

    // 首页封面
    coverFocusStyle: "avatar" | "title";
    coverAvatar: string;
    coverTitle: string;
    coverTitleFont: string;
    coverTitleFontSize: number;
    coverSignature: string;
    coverSignatureFont: string;
    coverTypedjs: boolean;
    coverTypedjsConfig: string;
    randomPicUrlPc: string;
    randomPicUrlMb: string;
    coverAsBackground: boolean;

    // 社交区域
    socialLinks: Array<{
        iconUrl: string;
        linkUrl: string;
    }>;

    // 首页布局
    homepageBlock: Array<"show" | "postList" | "custom">;
    showBlockTitle: string;
    postListBlockTitle: string;
    customBlockTitle: string;
    blockTitleFont: string;
    blockTitlePosition: "left" | "center" | "right";

    // 展示区域设置
    showAreaContent: Array<{
        imageUrl: string;
        title: string;
        desc: string;
        target: string;
    }>;

    // 文章区域设置
    postCardMetas: Array<"author" | "category" | "commentCounts" | "views">;
    postCardImageOption: "alwaysWithCover" | "alwaysAlone" | "onlyFeatherImage";
    postCardImageUrl: string;
    postCardBorderRadius: number;
    postCardMetaBorderRadius: number;
    postCardTitleBorderRadius: number;
    postCardTitleFontSize: number;

    // 文章与页面设置
    postTableOfContent: boolean;
    pageTableOfContent: boolean;

    // 评论区设置
    commentInputPlaceHolder: string;
    commentSubmitButtonText: string;

    // 页面模板设置
    bangumiAPIsource: "bangumi" | "bilibili";
    sysBangumiUserID: string;
    sysBilibiliUserId: string;
    sysBilibiliUserCookie: string;
    sysShowPrivateFavlist: boolean;

    // 全站数据设置
    customHeader: string;

    // 安全设置
    captchaSelect: "builtIn" | "cloudflare";
    turnstileSiteKey: string;
    sysTurnstileSecretKey: string;
}

// 预览数据类型（所有字段可选）
export type PreviewThemeConfig = Partial<ThemeConfig>;

// 确保 store 中的 config 类型正确
declare module "#imports" {
    interface ThemeConfigStore {
        config: ThemeConfig;
    }
}

/**
 * 获取响应式的主题配置对象，在预览模式下会自动切换为临时配置
 */
export const useThemeConfig = (): ComputedRef<
    ThemeConfig | PreviewThemeConfig
> => {
    const store = useThemeConfigStore();
    let previewMode = ref(false);
    const previewData = ref<PreviewThemeConfig>({});

    if (import.meta.client) {
        window.addEventListener("message", (e) => {
            if (e.data?.type === "previewData") {
                previewMode.value = true;
                previewData.value = { ...e.data.data };
            }
        });
    }
    return computed(() =>
        previewMode.value ? previewData.value : store.config,
    );
};
