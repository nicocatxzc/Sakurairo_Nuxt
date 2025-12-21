import "element-plus/dist/index.css";
import "vue-color/style.css";
import {
    elText,
    elTextarea,
    CodeEditor,
    elSelect,
    elCheckbox,
    elCheckboxGroup,
    elColorPicker,
    elRadioGroup,
    elSlider,
    elSwitch,
    SortableList,
} from "./inputs/index";

export default [
    {
        key: "basicSettings",
        title: "基础设置",
        schema: [
            {
                $formkit: elText,
                name: "siteLogo",
                label: "站点logo",
                value: "",
                placeholder: "填写logo地址",
            },
            {
                $formkit: elText,
                name: "siteSeoKeyword",
                label: "seo关键词",
                value: "",
                placeholder: "比如'博客,日常,分享'",
            },
            {
                $formkit: elText,
                name: "siteSeoDesc",
                label: "seo描述",
                value: "",
                placeholder: "比如'一个不一般的个人博客'",
            },
        ],
    },
    {
        key: "globalSettings",
        title: "全局设置",
        subGroup: [
            {
                key: "globalColors",
                title: "配色",
                schema: [
                    {
                        $el: "div",
                        attrs: {
                            innerHTML: "<h3>色彩搭配</h3>",
                        },
                    },
                    {
                        $formkit: elColorPicker,
                        name: "wordColorFirst",
                        label: "主要文字颜色",
                        value: "#505050",
                    },
                    {
                        $formkit: elColorPicker,
                        name: "wordColorSecond",
                        label: "次要文字颜色",
                        value: "#00000080",
                    },
                    {
                        $formkit: elColorPicker,
                        name: "activeColor",
                        label: "激活组件颜色",
                        value: "#00b0f0",
                    },
                    {
                        $formkit: elSlider,
                        name: "widgetTransparency",
                        label: "组件透明度",
                        value: 0.8,
                        min: 0,
                        max: 1,
                        step: 0.01,
                        props: {
                            showInput: true,
                        },
                    },
                    {
                        $formkit: elSlider,
                        name: "backgroundTransparency",
                        label: "背景透明度",
                        value: 0.8,
                        min: 0,
                        max: 1,
                        step: 0.01,
                        props: {
                            showInput: true,
                        },
                    },
                    {
                        $el: "div",
                        attrs: {
                            innerHTML: "<h3>深色模式</h3>",
                        },
                    },
                    {
                        $formkit: elColorPicker,
                        name: "wordColorFirstDark",
                        label: "主要文字颜色",
                        value: "#CCCCCC",
                    },
                    {
                        $formkit: elColorPicker,
                        name: "wordColorSecondDark",
                        label: "次要文字颜色",
                        value: "#7d7d7d",
                    },
                    {
                        $formkit: elColorPicker,
                        name: "activeColorDark",
                        label: "激活组件颜色",
                        value: "#FCCD00",
                    },
                    {
                        $formkit: elSlider,
                        name: "widgetTransparencyDark",
                        label: "组件透明度",
                        value: 0.8,
                        min: 0,
                        max: 1,
                        step: 0.01,
                        props: {
                            showInput: true,
                        },
                    },
                    {
                        $formkit: elSlider,
                        name: "backgroundTransparencyDark",
                        label: "背景透明度",
                        value: 0.7,
                        min: 0,
                        max: 1,
                        step: 0.01,
                        props: {
                            showInput: true,
                        },
                    },
                    {
                        $formkit: elSlider,
                        name: "imgBrightDark",
                        label: "图像亮度",
                        value: 0.7,
                        min: 0,
                        max: 1,
                        step: 0.01,
                        props: {
                            showInput: true,
                        },
                    },
                ],
            },
            {
                key: "globalFonts",
                title: "字体设置",
                schema: [
                    {
                        $formkit: elSlider,
                        name: "globalFontSize",
                        label: "字体大小",
                        value: 16,
                        min: 1,
                        max: 100,
                        step: 1,
                        props: {
                            showInput: true,
                        },
                    },

                    {
                        $formkit: elSlider,
                        name: "globalFontWeight",
                        label: "字重",
                        value: 300,
                        min: 100,
                        max: 1000,
                        step: 1,
                        props: {
                            showInput: true,
                        },
                    },

                    {
                        $formkit: SortableList,
                        name: "extraFonts",
                        label: "额外字体",
                        innerSchema: [
                            {
                                $formkit: elText,
                                name: "fontName",
                                label: "字体名称",
                                placeholder: "请输入字体名称",
                            },
                            {
                                $formkit: elText,
                                name: "link",
                                label: "字体链接",
                                placeholder: "请输入字体文件的链接",
                            },
                        ],
                    },
                ],
            },
            {
                key: "navbarSettings",
                title: "导航栏",
                schema: [
                    {
                        $formkit: elText,
                        name: "navLogo",
                        label: "导航栏logo",
                        value: "",
                        placeholder: "导航栏logo链接",
                    },
                    {
                        $formkit: elText,
                        name: "navTitle",
                        label: "导航栏标题",
                        value: "",
                        placeholder: "导航栏标题",
                    },
                    {
                        $formkit: elText,
                        name: "navTitleFont",
                        label: "导航栏标题字体",
                        value: "",
                        placeholder: "字体名称",
                    },
                    {
                        $formkit: elText,
                        name: "navOptionFont",
                        label: "导航栏选项字体",
                        value: "",
                        placeholder: "字体名称",
                    },
                    {
                        $formkit: elSelect,
                        name: "navbarDistribution",
                        label: "选项分布方式",
                        value: "right",
                        options: [
                            { label: "靠左", value: "left" },
                            { label: "靠右", value: "right" },
                            { label: "居中", value: "center" },
                            {
                                label: "分散",
                                value: "space-evenly",
                            },
                        ],
                    },
                    {
                        $formkit: elSlider,
                        name: "navbarOptionMargin",
                        label: "选项间距",
                        value: 15,
                        min: 1,
                        max: 100,
                        step: 1,
                        props: {
                            showInput: true,
                        },
                    },
                ],
            },
            {
                key: "footer",
                title: "页尾设置",
                schema: [
                    {
                        $formkit: elSwitch,
                        name: "footerSakura",
                        label: "页尾樱花",
                        value: true,
                    },
                    {
                        $formkit: elText,
                        name: "footerFont",
                        label: "页尾字体",
                        value: "",
                        placeholder: "字体名称",
                    },

                    {
                        $formkit: CodeEditor,
                        name: "footerHTML",
                        label: "页尾html代码",
                        value: "<b>Powered by Nuxt</b>",
                        language: "html",
                    },
                ],
            },
            {
                key: "others",
                title: "其他设置",
                schema: [
                    {
                        $formkit: elSwitch,
                        name: "topScrollProgress",
                        label: "顶部阅读进度条",
                        value: true,
                    },
                    {
                        $formkit: elSwitch,
                        name: "topLoadingProgress",
                        label: "顶部加载进度条",
                        value: true,
                    },
                    {
                        $formkit: elSlider,
                        name: "pageAutoLoad",
                        label: "文字列表自动加载(秒)",
                        value: 3,
                        min: 1,
                        max: 10,
                        step: 1,
                        props: {
                            showInput: true,
                        },
                    },
                    {
                        $formkit: elText,
                        name: "missingImgPlaceholder",
                        label: "丢失图片占位图",
                        placeholder: "请输入图片链接",
                    },
                    {
                        $formkit: elText,
                        name: "missingAvatarPlaceholder",
                        label: "丢失头像占位图",
                        placeholder: "请输入图片链接",
                    },
                    {
                        $formkit: elText,
                        name: "paginationAnimation",
                        label: "分页加载动画",
                        placeholder: "请输入图片链接",
                    },
                    {
                        $formkit: elText,
                        name: "loadingAnimation",
                        label: "图片加载动画",
                        placeholder: "请输入图片链接",
                    },
                ],
            },
        ],
    },
    {
        key: "homepage",
        title: "首页设置",
        subGroup: [
            {
                key: "homepageCover",
                title: "首页封面",
                schema: [
                    {
                        $formkit: elText,
                        name: "coverTitle",
                        label: "封面标题内容",
                        value: "默认单行文本",
                        placeholder: "请输入封面标题内容",
                    },

                    {
                        $formkit: elText,
                        name: "coverTitleFont",
                        label: "封面标题字体",
                        placeholder: "请输入字体名称",
                    },

                    {
                        $formkit: elSlider,
                        name: "coverTitleFontSize",
                        label: "封面标题大小(全局基本字体大小的倍率)",
                        value: 5.6,
                        min: 0.01,
                        max: 10,
                        step: 0.01,
                        props: {
                            showInput: true,
                        },
                    },

                    {
                        $formkit: elText,
                        name: "coverSignature",
                        label: "封面签名栏内容",
                        value: "我的心都碎成二维码了，可扫出来还是我好喜欢你呜呜呜",
                        placeholder: "请输入签名内容",
                    },

                    {
                        $formkit: elText,
                        name: "coverSignatureFont",
                        label: "封面签名栏字体",
                        placeholder: "请输入字体名称",
                    },

                    {
                        $formkit: CodeEditor,
                        name: "typedjs",
                        label: "封面打字机配置",
                        /*javascript*/
                        value: `{
    "strings": [
        "是金子总会发光，但我是老铁。",
        "学而不思则罔，不思不学则爽"
    ],
    "typeSpeed": 140,
    "backSpeed": 50,
    "loop": false,
    "showCursor": true
}`,
                        language: "javascript",
                    },

                    {
                        $formkit: elText,
                        name: "pcRandomPicUrl",
                        label: "PC端封面随机图片地址",
                        value: "https://moeapi.moecat.cc/imgs/pc",
                        placeholder: "请输入图片链接或api地址",
                    },

                    {
                        $formkit: elText,
                        name: "mbRandomPicUrl",
                        label: "移动端封面随机图片地址",
                        value: "https://moeapi.moecat.cc/imgs/mb",
                        placeholder: "请输入图片链接或api地址",
                    },

                    {
                        $formkit: elSwitch,
                        name: "coverAsBackground",
                        label: "封面与前台背景一体化",
                        value: false,
                    },
                ],
            },
            {
                key: "socialArea",
                title: "社交区域",
                schema: [
                    {
                        $formkit: SortableList,
                        name: "socialLinks",
                        label: "封面社交区域图标",
                        innerSchema: [
                            {
                                $formkit: elText,
                                name: "iconUrl",
                                label: "图标链接地址",
                                value: "",
                                placeholder: "请输入图片链接",
                            },

                            {
                                $formkit: elText,
                                name: "linkUrl",
                                label: "链接地址",
                                value: "",
                                placeholder: "请输入跳转地址",
                            },
                        ],
                    },
                ],
            },
            {
                key: "homepageComponents",
                title: "首页布局",
                schema: [
                    {
                        $formkit: "list",
                        name: "homepageBlock",
                        value: ["show", "postlist", "post"],
                        children: [
                            {
                                $formkit: elSelect,
                                label: "区域1",
                                options: [
                                    { label: "文章区域", value: "postlist" },
                                    { label: "展示区域", value: "show" },
                                    { label: "自定义页面", value: "custom" },
                                ],
                            },
                            {
                                $formkit: elSelect,
                                label: "区域2",
                                options: [
                                    { label: "文章区域", value: "postlist" },
                                    { label: "展示区域", value: "show" },
                                    { label: "自定义页面", value: "custom" },
                                ],
                            },
                            {
                                $formkit: elSelect,
                                label: "区域3",
                                options: [
                                    { label: "文章区域", value: "postlist" },
                                    { label: "展示区域", value: "show" },
                                    { label: "自定义页面", value: "custom" },
                                ],
                            },
                            {
                                $formkit: elText,
                                name: "showBlockTitle",
                                label: "展示区标题",
                                value: "展示",
                                placeholder: "请输入文本",
                            },
                            {
                                $formkit: elText,
                                name: "postListBlockTitle",
                                label: "文章区标题",
                                value: "文章",
                                placeholder: "请输入文本",
                            },
                            {
                                $formkit: elText,
                                name: "customBlockTitle",
                                label: "自定义区标题",
                                value: "自定义",
                                placeholder: "请输入文本",
                            },
                            {
                                $formkit: elText,
                                name: "blockTitleFont",
                                label: "区域标题字体",
                                value: "",
                                placeholder: "请输入字体名称",
                            },
                            {
                                $formkit: elSelect,
                                label: "区域图标位置",
                                name: "blockTitlePosition",
                                value: "left",
                                options: [
                                    { label: "左边", value: "left" },
                                    { label: "中间", value: "center" },
                                    { label: "右边", value: "right" },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                key: "showArea",
                title: "展示区域设置",
                schema: [
                    {
                        $formkit: SortableList,
                        name: "showAreaContent",
                        label: "展示区域内容",
                        innerSchema: [
                            {
                                $formkit: elText,
                                name: "imageUrl",
                                label: "图片链接",
                            },
                            {
                                $formkit: elText,
                                name: "title",
                                label: "标题",
                            },
                            {
                                $formkit: elText,
                                name: "desc",
                                label: "描述",
                            },
                            {
                                $formkit: elText,
                                name: "target",
                                label: "跳转地址",
                            },
                        ],
                    },
                ],
            },
            {
                key: "articleArea",
                title: "文章区域设置",
                schema: [
                    {
                        $formkit: elCheckboxGroup,
                        name: "postCardMetas",
                        label: "文章卡片显示信息",
                        value: ["category", "commentCounts"],
                        options: [
                            { label: "作者", value: "author" },
                            { label: "分类", value: "category" },
                            { label: "评论数量", value: "commentCounts" },
                        ],
                    },
                    {
                        $formkit: elRadioGroup,
                        name: "postCardImageOption",
                        label: "文章卡片图片",
                        value: "onlyFeatherImage",
                        options: [
                            {
                                label: "始终显示且跟随封面",
                                value: "alwaysWithCover",
                            },
                            { label: "始终显示且独立", value: "alwaysAlone" },
                            {
                                label: "仅显示特色图片",
                                value: "onlyFeatherImage",
                            },
                        ],
                    },
                    {
                        $formkit: elText,
                        name: "postCardImageUrl",
                        label: "文章卡片随机图api",
                        value: "",
                        placeholder: "请输入地址",
                    },
                    {
                        $formkit: elSlider,
                        name: "postCardBorderRadius",
                        label: "文章卡片圆角",
                        value: 6,
                        min: 0,
                        max: 30,
                        step: 1,
                        props: {
                            showInput: true,
                        },
                    },
                    {
                        $formkit: elSlider,
                        name: "postCardMetaBorderRadius",
                        label: "文章信息圆角",
                        value: 6,
                        min: 0,
                        max: 30,
                        step: 1,
                        props: {
                            showInput: true,
                        },
                    },
                    {
                        $formkit: elSlider,
                        name: "postCardTitleBorderRadius",
                        label: "文章标题圆角",
                        value: 6,
                        min: 0,
                        max: 30,
                        step: 1,
                        props: {
                            showInput: true,
                        },
                    },
                    {
                        $formkit: elSlider,
                        name: "postCardTitleFontSize",
                        label: "文章标题字体大小",
                        value: 18,
                        min: 10,
                        max: 30,
                        step: 1,
                        props: {
                            showInput: true,
                        },
                    },
                ],
            },
        ],
    },
    {
        key: "postPage",
        title: "页面设置",
        subGroup: [
            {
                key: "articlePage",
                title: "文章页面设置",
                schema: [],
            },
            {
                key: "commentsArea",
                title: "评论区设置",
                schema: [],
            },
            {
                key: "templates",
                title: "页面模板设置",
                schema: [],
            },
        ],
    },
    {
        key: "othersFunctions",
        title: "其他设置",
        schema: [
            {
                $formkit: CodeEditor,
                name: "customHeader",
                label: "自定义页面header",
                value: "",
                language: "html",
            },
        ],
    },
];
