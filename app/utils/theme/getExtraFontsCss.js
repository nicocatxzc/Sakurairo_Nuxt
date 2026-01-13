export default function () {
    const themeConfig = useThemeConfig()
    let extraFontsCss = ref('')
    extraFontsCss = computed(() => {
        const extraFonts = themeConfig.value?.extraFonts;

        if (!Array.isArray(extraFonts)) {
            return "";
        }

        return extraFonts
            .map((font) => {
                const fontName = font?.fontName ?? "";
                const link = font?.link ?? "";
                if (!fontName || !link) return "";

                return /* css */ `
@font-face {
  font-family: '${fontName}';
  src: url('${link}');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}`.trim();
            })
            .filter(Boolean)
            .join("\n\n");
    });

    return extraFontsCss
}
