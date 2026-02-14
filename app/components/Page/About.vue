<script setup>
const about = parseMarkdown(/* markdown */`
# Sakurairo_Nuxt
## 关于主题

### 开源相关
本主题基于[Theme Sakurairo](https://github.com/mirai-mamori/Sakurairo)主题进行重构开发，使用GPL2协议开源
本主题的仓库地址：[Sakurairo_Nuxt](https://github.com/nicocatxzc/Sakurairo_Nuxt)

### 引用相关
本主题使用了以下图标库：
- Font-Awesome
- line-md
- Fluent System Icons
- Google material icons

你可以在[这里](https://github.com/nicocatxzc/hachimi/blob/master/third-party.md)查看相关协议

### 依赖相关

- 本主题使用Nuxt作为全栈框架实现高性能驱动
- 主题使用Formkit驱动设置表单

其余依赖可以在仓库依赖列表查看

### Sakurairo_Nuxt的贡献者

[![Contributors](https://contrib.rocks/image?repo=nicocatxzc/Sakurairo_Nuxt)](https://contrib.rocks/image?repo=nicocatxzc/Sakurairo_Nuxt)

### Sakurairo的贡献者

[![Contributors](https://contrib.rocks/image?repo=mirai-mamori/Sakurairo)](https://github.com/nicocatxzc/hachimi/graphs/contributors)

### 希望你喜欢！
`);
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
    <div class="about-page" v-html="about"></div>
</template>

<style>
.about-page {
    a {
        color: var(--active-color);
    }
}
</style>
