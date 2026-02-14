export default defineNuxtPlugin((nuxtApp) => {
    const getTextStyle = (color) => {
        return `color:${color};font-size:12px;font-family:"Comic Sans MS", "Comic Neue", "Tahoma";font-weight:900`;
    };

    console.log(
        `%cTHEME \n%cSakurairo_Nuxt \n%cINSPIRED %cBY \n%cSAKURAIR%cO \n%chttps://github.com/nicocatxzc/Sakurairo_Nuxt \nhttps://github.com/mirai-mamori/Sakurairo`,
        getTextStyle("inherit"),
        getTextStyle("#f1e05a"),
        getTextStyle("inherit"),
        getTextStyle("#65c9fe"),
        getTextStyle("inherit"),
        getTextStyle("#fabe03"),
        getTextStyle("inherit"),
    );

    console.log("Build version", "1.0.1.2");
});
