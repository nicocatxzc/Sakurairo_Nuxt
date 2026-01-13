/**
 * 获取响应式的主题变量CSS字符串
 */
export default function getThemeCss() {
    const themeConfig = useThemeConfig();
    const themeCss = computed(() => {
        return /*css */ `
:root {
    --global-font-size:${themeConfig.value?.globalFontSize ?? 16}px;
    --global-font-weight:${themeConfig.value?.globalFontWeight ?? 300};
    ${(themeConfig.value?.globalDefaultFont ?? false) ? 'font-family:'+themeConfig.value?.globalDefaultFont : ''}
}
body {
    background-image: url("${themeConfig.value?.frontendDefaultBackground}");
}
:root {
    --active-color: ${themeConfig.value?.activeColor || "#00b0f0"};
    --widget-transparency: ${themeConfig.value?.widgetTransparency ?? 0.8};
    --background-transparency: ${
        themeConfig.value?.backgroundTransparency ?? 0.8
    };
    --word-color-first: ${themeConfig.value?.wordColorFirst || "#505050"};
    --word-color-second: ${themeConfig.value?.WordColorSecond || "#00000080"};
    --word-color-third: #00000080;
    --word-color-first-reverse:${themeConfig.value?.wordColorFirstDark || "#CCCCCC"};
    --widget-background: 255, 255, 255;
    --widget-background-color: rgba(var(--widget-background), var(--widget-transparency));
    --widget-shadow-shine: 0 0.1rem 1.8rem -0.25rem rgb(232, 232, 232);
    --widget-shadow-shining: 0 0.1rem 1.8rem 0.7rem rgb(232, 232, 232);
    --widget-shadow-shadow: 0 0.3rem 1rem rgba(0,0,0,0.1);
    --border-color-sketch: 0, 0, 0 ;
    --border-color-shine: 255, 255, 255;
    --border-sketch: 0.1rem solid rgba(var(--border-color-sketch),0.1);
    --border-shine: 0.1rem solid rgb(var(--border-color-shine));
    --page-background-color: rgba(255,255,255,var(--background-transparency));
    --code-background: ${themeConfig.value?.codeBlockBackgroundColor ?? "#e1e4e8"};
}
:root.dark {
    --active-color: ${themeConfig.value?.activeColorDark || 
"#FCCD00"};
    --widget-transparency: ${themeConfig.value?.widgetTransparencyDark ?? 0.8};
    --background-transparency: ${themeConfig.value?.backgroundTransparencyDark ?? 0.7};
    --word-color-first: ${themeConfig.value?.wordColorFirstDark || "#CCCCCC"};
    --word-color-second: ${themeConfig.value?.wordColorSecondDark || "#7d7d7d"};
    --word-color-third: #7d7d7d;
    --word-color-first-reverse:${themeConfig.value?.wordColorFirst || "#505050"};
    --widget-background: 26, 26, 26;
    --widget-background-color: rgba(var(--widget-background), var(--widget-transparency));
    --widget-shadow-shine: 0 0.1rem 1.2rem -0.25rem rgba(26, 26, 26, 0.8);
    --widget-shadow-shining: 0 0.1rem 2rem -0.25rem var(--active-color);
    --widget-shadow-shadow: 0 0.3rem 1rem rgba(0,0,0,0.2);
    --border-color-sketch: rgba(255,255,255,0.1);
    --border-color-shine: #7d7d7d30;
    --border-sketch: 0.1rem solid var(--border-color-sketch);
    --border-shine: 0.1rem solid var(--border-color-shine);
    --page-background-color: rgba(51, 51, 51, var(--background-transparency));
    --code-background: ${themeConfig.value?.codeBlockBackgroundColorDark ?? "#24292e"};
    --image-bright:${themeConfig.value?.imgBrightDark ?? 0.7};
}
:root {
    --border-active: 0.1rem solid var(--active-color);
}
`;
    });

    return themeCss;
}
