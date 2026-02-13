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
                prefix:"local",
                dir:"./app/icons"
            }
        ]
    },
    formkit: {
        autoImport: true,
    },
    modules: [
        "@nuxt/eslint",
        "@nuxt/fonts",
        "@nuxt/hints",
        "@nuxt/icon",
        "@nuxt/image",
        "@nuxt/scripts",
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
                "element-plus",
                "@element-plus/icons-vue",
                "dayjs",
                "@vueuse/core",
                "pinia",
                "pinia-plugin-persistedstate",
                "highlight.js",
                "otpauth",
                "jose",
            ],
        },
    },
    imports: {
        dirs: ["composables/**", "utils/**"],
    },
});
