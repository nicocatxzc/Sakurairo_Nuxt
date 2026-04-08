import { randomBytes } from "crypto";

export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    runtimeConfig: {
        // 私有配置
        wordpressURL: process.env.wordpressURL,
        wordpressUserName: process.env.wordpressUserName,
        wordpressAuthToken: process.env.wordpressAuthToken,

        // totp种子
        captchaSecret:
            process.env.CAPTCHA_SECRET || randomBytes(32).toString("hex"),
        commSecret: process.env.COMM_SECRET || randomBytes(32).toString("hex"),
        // 公开配置
        public: {
            apiBase: "/api",
        },
    },
    image: {
        provider: "hachimi",
        inject: true,
        format: ["webp"],
        quality: 100,
        providers: {
            hachimi: {
                provider: "~/providers/hachimi",
            },
        },
    },
    icon: {
        customCollections: [
            {
                prefix: "local",
                dir: "./app/icons",
            },
        ],
    },
    formkit: {
        autoImport: true,
    },
    modules: [
        "@nuxt/eslint",
        "@nuxt/icon",
        "@nuxt/image",
        "@element-plus/nuxt",
        "@pinia/nuxt",
        "@vueuse/nuxt",
        "pinia-plugin-persistedstate/nuxt",
        "@formkit/nuxt",
        "nuxt-monaco-editor",
        "motion-v/nuxt",
    ],
    vite: {
        optimizeDeps: {
            include: [
                // UI
                "element-plus",
                "@element-plus/icons-vue",
                "lodash-unified",

                // 状态
                "@vueuse/core",
                "pinia",
                "pinia-plugin-persistedstate",

                // dayjs
                "dayjs",
                "dayjs/plugin/timezone",
                "dayjs/plugin/localeData",
                "dayjs/plugin/localizedFormat",
                "dayjs/plugin/utc",
                "dayjs/locale/zh",
                "dayjs/locale/en",

                // 工具
                "highlight.js",
                "otpauth",
                "jose",
                "lodash-es",
                "htmlparser2",
                "markdown-it",
                "markdown-it-texmath",
                "katex",
                "medium-zoom",
                "tocbot",
                "@tsparticles/engine",
                "@tsparticles/all",
                "typed.js",
                "mitt",
                "vue-cloudflare-turnstile",
                'md5',
            ],
        },
    },
    imports: {
        dirs: ["composables/**", "utils/**"],
    },
});
