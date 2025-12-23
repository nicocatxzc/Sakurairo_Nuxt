export default function getThemeCss() {
    const themeConfig = useThemeConfig();
    const themeCss = computed(()=>{
      return /*css */ `
:root {
    --global-font-size:${themeConfig.value.globalFontSize};
    --global-font-weight:${themeConfig.value.globalFontWeight};
}
:root {
    --active-color: ${themeConfig.value.activeColor};
    --widget-transparency: ${themeConfig.value.widgetTransparency};
    --background-transparency: ${themeConfig.value.backgroundTransparency};
    --word-color-first: ${themeConfig.value.wordColorFirst};
    --word-color-second: ${themeConfig.value.WordColorSecond};
    --word-color-third: #00000080;
    --word-color-first-reverse:${themeConfig.value.wordColorFirstDark};
    --widget-background: 255, 255, 255;
    --widget-background-color: rgba(var(--widget-background), var(--widget-transparency));
    --widget-shadow-shine: 0 0.1rem 1.8rem -0.25rem rgb(232, 232, 232);
    --widget-shadow-shining: 0 0.1rem 1.8rem 0.7rem rgb(232, 232, 232);
    --widget-shadow-shadow: 0 -0.3rem 1rem rgba(0,0,0,0.1);
    --border-color-sketch: 0, 0, 0 ;
    --border-color-shine: 255, 255, 255;
    --border-sketch: 0.1rem solid rgba(var(--border-color-sketch),0.1);
    --border-shine: 0.1rem solid rgb(var(--border-color-shine));
    --page-background-color: rgba(255,255,255,var(--background-transparency));
    --code-background: #e1e4e8;
    --secondary-word-color:${themeConfig.value.wordColorSecond};
}
:root.dark {
    --active-color: ${themeConfig.value.activeColorDark};
    --widget-transparency: ${themeConfig.value.widgetTransparencyDark};
    --background-transparency: ${themeConfig.value.backgroundTransparencyDark};
    --word-color-first: ${themeConfig.value.wordColorFirstDark};
    --word-color-second: ${themeConfig.value.wordColorSecondDark};
    --word-color-third: #7d7d7d;
    --word-color-first-reverse:${themeConfig.value.wordColorFirst};
    --widget-background: 26, 26, 26;
    --widget-background-color: rgba(var(--widget-background), var(--widget-transparency));
    --widget-shadow-shine: 0 0.1rem 1.2rem -0.25rem rgba(26, 26, 26, 0.8);
    --widget-shadow-shining: 0 0.1rem 2rem -0.25rem var(--active-color);
    --widget-shadow-shadow: 0 -0.3rem 1rem rgba(0,0,0,0.2);
    --border-color-sketch: rgba(255,255,255,0.1);
    --border-color-shine: #7d7d7d30;
    --border-sketch: 0.1rem solid var(--border-color-sketch);
    --border-shine: 0.1rem solid var(--border-color-shine);
    --page-background-color: rgba(51, 51, 51, var(--background-transparency));
    --code-background: #24292e;
    --image-bright:${themeConfig.value.imgBrightDark};
}`;
    });

    return themeCss;
}
