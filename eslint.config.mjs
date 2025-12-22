// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
    // Your custom configs here
    {
        rules: {
            "prefer-const": "off",
            "vue/html-self-closing": [
                "error",
                {
                    html: {
                        void: "always",
                        normal: "any",
                        component: "any",
                    },
                },
            ],
        },
    }
);
