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
    SortableOptions,
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
                help:"填写后将使用该图像作为站点logo，未填写将使用wordpress后端设置的图像或默认图像",
                placeholder: "填写logo地址",
            },
            {
                $formkit: elText,
                name: "siteSeoKeyword",
                label: "seo关键词",
                value: "",
                placeholder: "比如'博客,日常,分享'",
                help: "不建议填写关键词，可能会被必应或谷歌当作滥用处理，除非你很有信心",
            },
            {
                $formkit: elText,
                name: "siteSeoDesc",
                label: "seo描述",
                value: "",
                placeholder: "比如'一个不一般的个人博客'",
                help: "在页面没有正文内容时会作为替代显示在搜索结果词条的描述中",
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
                        help: "文章标题等文字的颜色",
                        value: "#505050",
                    },
                    {
                        $formkit: elColorPicker,
                        name: "wordColorSecond",
                        label: "次要文字颜色",
                        help: "帮助和页脚等文字的颜色",
                        value: "#00000080",
                    },
                    {
                        $formkit: elColorPicker,
                        name: "activeColor",
                        label: "激活组件颜色",
                        help: "鼠标悬浮链接以及按钮和高亮标签等部分的颜色",
                        value: "#00b0f0",
                    },
                    {
                        $formkit: elColorPicker,
                        name: "codeBlockBackgroundColor",
                        label: "代码块背景色",
                        value: "#e1e4e8",
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
                        $formkit: elSlider,
                        name: "backgroundBlur",
                        label: "背景模糊度",
                        value: 0.7,
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
                        $formkit: elColorPicker,
                        name: "codeBlockBackgroundColorDark",
                        label: "代码块背景色",
                        value: "#24292e",
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
                        help: "此处以像素为单位，主题大部分组件会以此为依据调整自身大小，以实现等比缩放的效果",
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
                        help: "字体的粗细",
                        value: 300,
                        min: 100,
                        max: 1000,
                        step: 1,
                        props: {
                            showInput: true,
                        },
                    },

                    {
                        $formkit: elText,
                        name: "globalDefaultFont",
                        label: "默认字体",
                        value: "",
                        placeholder: "字体名称",
                    },

                    {
                        $formkit: SortableList,
                        name: "extraFonts",
                        label: "额外字体",
                        help: "在此处引入新字体后，就可以在其他组件的设置中使用字体名称来应用字体",
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

                    {
                        $formkit: elSwitch,
                        name: "navbarUserMenu",
                        label: "导航栏用户栏",
                        value: true,
                    },
                ],
            },
            {
                key: "frontend",
                title: "前台设置",
                schema: [
                    {
                        $formkit: elText,
                        name: "frontendDefaultBackground",
                        label: "前台默认背景",
                        value: "",
                        placeholder: "填写图像链接",
                    },

                    {
                        $formkit: SortableList,
                        name: "toolbarFontsChoice",
                        label: "工具栏可选字体",
                        help: "请使用有效的字体名称，需要在全局字体设置中添加对应名称的额外字体才能生效",
                        innerSchema: [
                            {
                                $formkit: elText,
                                name: "name",
                                label: "字体名称",
                                value: "",
                                placeholder: "请输入字体名称",
                            },
                        ],
                    },

                    {
                        $formkit: elSelect,
                        name: "frontendParticle",
                        label: "前台背景粒子特效",
                        help: "粒子特效调整仅对内嵌的樱花和雪生效",
                        value: "off",
                        options: [
                            { label: "关闭", value: "off" },
                            { label: "樱花", value: "sakura" },
                            { label: "雪", value: "snow" },
                            {
                                label: "自定义",
                                value: "custom",
                            },
                        ],
                    },

                    {
                        $formkit: elSlider,
                        name: "particleAmount",
                        label: "粒子数量",
                        value: 10,
                        min: 10,
                        max: 100,
                        step: 1,
                        props: {
                            showInput: true,
                        },
                    },

                    {
                        $formkit: elSlider,
                        name: "particleMinSize",
                        label: "粒子最小大小",
                        value: 10,
                        min: 1,
                        max: 100,
                        step: 1,
                        props: {
                            showInput: true,
                        },
                    },

                    {
                        $formkit: elSlider,
                        name: "particleMaxSize",
                        label: "粒子最大大小",
                        value: 30,
                        min: 1,
                        max: 100,
                        step: 1,
                        props: {
                            showInput: true,
                        },
                    },

                    {
                        $formkit: elSlider,
                        name: "particleSpeed",
                        label: "粒子速度",
                        value: 30,
                        min: 1,
                        max: 100,
                        step: 1,
                        props: {
                            showInput: true,
                        },
                    },

                    {
                        $formkit: CodeEditor,
                        name: "particleConfig",
                        label: "自定义粒子特效实现",
                        value: "{}",
                        language: "js",
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
                        help: "可以在此处编写页脚内容，也可以加入能接受延迟加载的统计代码，请确保它们安全",
                        value: "<b>Powered by Nuxt</b>",
                        language: "html",
                    },
                ],
            },
            {
                key: "search",
                title: "搜索设置",
                schema: [
                    {
                        $formkit: elSwitch,
                        name: "navbarSearch",
                        label: "导航栏搜索按钮",
                        value: true,
                    },
                    {
                        $formkit: elSwitch,
                        name: "liveSearchLocalIndex",
                        label: "实时搜索功能",
                        help: "启用本功能会发送全部文章数据到用户客户端,如果文章数据过多会严重浪费流量",
                        value: true,
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
                        help: "开启后会在页面顶部会显示进度条，进度取决于当前页面的滚动进度",
                        value: true,
                    },
                    {
                        $formkit: elSwitch,
                        name: "topLoadingProgress",
                        label: "顶部加载进度条",
                        help: "开启后会在页面顶部会显示进度条，进度取决于下一页的加载进度",
                        value: true,
                    },
                    {
                        $formkit: elSlider,
                        name: "pageAutoLoad",
                        label: "文章列表自动加载(秒)",
                        help: "首页/分类/作者页等页面文章列表自动加载的延迟，为0时不自动加载",
                        value: 3,
                        min: 0,
                        max: 10,
                        step: 1,
                        props: {
                            showInput: true,
                        },
                    },
                    {
                        $formkit: elText,
                        name: "missingImgPlaceholder",
                        label: "图片占位图",
                        help: "图像正在加载或无法加载时会显示该图片",
                        placeholder: "请输入图片链接",
                    },
                    {
                        $formkit: elText,
                        name: "missingAvatarPlaceholder",
                        label: "头像占位图",
                        help: "头像正在加载或无法加载时会显示该头像",
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
                        $formkit: elRadioGroup,
                        name: "coverFocusStyle",
                        label: "首页聚焦显示内容",
                        value: "title",
                        options: [
                            {
                                label: "显示头像",
                                value: "avatar",
                            },
                            {
                                label: "显示标题",
                                value: "title",
                            },
                        ],
                    },

                    {
                        $formkit: elText,
                        name: "coverAvatar",
                        label: "封面头像",
                        placeholder: "请输入图像链接",
                    },

                    {
                        $formkit: elText,
                        name: "coverTitle",
                        label: "封面标题内容",
                        help: "显示在封面正中央的文本",
                        value: "Hachimi",
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
                        label: "封面标题大小",
                        help: "基于全局基本字体大小的倍率",
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
                        $formkit: elSwitch,
                        name: "coverTypedjs",
                        label: "封面打字机特效",
                        value: false,
                    },

                    {
                        $formkit: CodeEditor,
                        name: "coverTypedjsConfig",
                        label: "封面打字机配置",
                        /*javascript*/
                        value: `{
    "strings": [
        "是金子总会发光，但我是老铁。",
        "学而不思则罔，不思不学则爽"
    ],
    "typeSpeed": 140,
    "backSpeed": 50,
    "loop": true,
    "showCursor": true
}`,
                        language: "javascript",
                    },

                    {
                        $formkit: elText,
                        name: "randomPicUrlPc",
                        label: "PC端封面随机图片地址",
                        value: "https://moeapi.moecat.cc/imgs/pc",
                        help: "输入图片的url可以实现封面固定的效果",
                        placeholder: "请输入图片链接或api地址",
                    },

                    {
                        $formkit: elText,
                        name: "randomPicUrlMb",
                        label: "移动端封面随机图片地址",
                        value: "https://moeapi.moecat.cc/imgs/mb",
                        placeholder: "请输入图片链接或api地址",
                    },

                    {
                        $formkit: elSwitch,
                        name: "coverAsBackground",
                        label: "封面与前台背景一体化",
                        help: "开启后封面会变透明，以实现封面和背景的一体化效果",
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
                        $formkit: SortableOptions,
                        name: "homepageBlock",
                        label: "首页布局",
                        value: ["show", "postlist"],
                        options: [
                            { label: "展示区域", value: "show" },
                            { label: "文章区域", value: "postList" },
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
                        label: "区域标题位置",
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
                        $formkit: SortableOptions,
                        name: "postCardMetas",
                        label: "文章卡片显示信息",
                        help: "点击可反选，长按可排序",
                        value: ["category", "views"],
                        options: [
                            { label: "作者", value: "author" },
                            { label: "分类", value: "category" },
                            { label: "评论数量", value: "commentCounts" },
                            { label: "浏览量", value: "views" },
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
                        value: 0.5,
                        min: 0,
                        max: 3,
                        step: 0.01,
                        props: {
                            showInput: true,
                        },
                    },
                    {
                        $formkit: elSlider,
                        name: "postCardMetaBorderRadius",
                        label: "文章信息圆角",
                        value: 0.5,
                        min: 0,
                        max: 3,
                        step: 0.01,
                        props: {
                            showInput: true,
                        },
                    },
                    {
                        $formkit: elSlider,
                        name: "postCardTitleBorderRadius",
                        label: "文章标题圆角",
                        value: 0.5,
                        min: 0,
                        max: 3,
                        step: 0.01,
                        props: {
                            showInput: true,
                        },
                    },
                    {
                        $formkit: elSlider,
                        name: "postCardTitleFontSize",
                        label: "文章标题字体大小",
                        value: 1.1,
                        min: 0.1,
                        max: 3,
                        step: 0.01,
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
                title: "文章与页面设置",
                schema: [
                    {
                        $formkit: elSwitch,
                        name: "postTableOfContent",
                        label: "文章目录",
                        help: "在文章页显示目录(检测到内容有标题会自动生成大纲并显示)",
                        value: false,
                    },
                    {
                        $formkit: elSwitch,
                        name: "pageTableOfContent",
                        label: "页面目录",
                        help: "在页面显示目录",
                        value: false,
                    },
                ],
            },
            {
                key: "commentsArea",
                title: "评论区设置",
                schema: [
                    {
                        $formkit: elText,
                        name: "commentInputPlaceHolder",
                        label: "评论区输入框占位符",
                        value: "要来喵一句吗？",
                        placeholder: "请输入文本",
                    },
                    {
                        $formkit: elText,
                        name: "commentSubmitButtonText",
                        label: "评论区提交按钮文本",
                        value: "提交",
                        placeholder: "请输入文本",
                    },
                ],
            },
            {
                key: "templates",
                title: "页面模板设置",
                schema: [
                    {
                        $formkit: elRadioGroup,
                        name: "bangumiAPIsource",
                        label: "文章卡片图片",
                        value: "bangumi",
                        options: [
                            {
                                label: "bangumi",
                                value: "bangumi",
                            },
                            {
                                label: "Bilibili",
                                value: "bilibili",
                            },
                        ],
                    },
                    {
                        $formkit: elText,
                        name: "sysBangumiUserID",
                        label: "bangumi用户ID",
                        placeholder: "请输入用户ID(数字)",
                    },
                    {
                        $formkit: elText,
                        name: "sysBilibiliUserId",
                        label: "bilibili用户ID",
                        placeholder: "请输入用户ID(数字)",
                    },
                    {
                        $formkit: elTextarea,
                        name: "sysBilibiliUserCookie",
                        label: "bilibili用户cookie",
                        help: "观看进度和隐私内容需要认证信息查询，请妥善保管cookie",
                        placeholder: "请输入cookie",
                    },
                ],
            },
        ],
    },
    {
        key: "othersFunctions",
        title: "其他设置",
        subGroup: [
            {
                key: "globalStatic",
                title: "全站数据设置",
                schema: [
                    {
                        $formkit: CodeEditor,
                        name: "customHeader",
                        label: "自定义页面header",
                        help: "此处的代码会被插入页面的head中被解释执行，可以用来插入Umami等工具script代码或自定义全局样式，请确保它是安全的",
                        value: "",
                        language: "html",
                    },
                ],
            },
            {
                key: "globalSafe",
                title: "安全设置",
                schema: [
                    {
                        $formkit: elSelect,
                        name: "captchaSelect",
                        label: "站内人机验证方式",
                        value: "builtIn",
                        options: [
                            { label: "内建", value: "builtIn" },
                            {
                                label: "cloudflare Turnstile",
                                value: "cloudflare",
                            },
                        ],
                    },
                    {
                        $formkit: elText,
                        name: "turnstileSiteKey",
                        label: "Turnstile Site Key",
                        placeholder: "请输入key",
                    },
                    {
                        $formkit: elText,
                        name: "sysTurnstileSecretKey",
                        label: "Turnstile Secret Key",
                        placeholder: "请输入key",
                    },
                ],
            },
        ],
    },
    {
        key: "about",
        title: "关于",
        schema: [],
    },
];
