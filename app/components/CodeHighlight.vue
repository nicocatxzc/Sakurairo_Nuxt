<script setup>
import hljs from "highlight.js";

const props = defineProps({
    code: {
        type: String,
        required: true,
    },
    lang: {
        type: String,
        default: () => "auto",
    },
});

const highlighted = computed(() => {
    if (props.lang == "auto" || props.lang == "") {
        return hljs.highlightAuto(props.code).value;
    }
    return hljs.highlight(props.code, { language: props.lang }).value.trim();
});

function copy() {
    navigator.clipboard.writeText(props?.code || "")
    ElMessage.success("代码已复制到剪切板!")
}
</script>

<!-- eslint-disable vue/no-v-html -->
<!-- pre标签内的内容会严格按照格式渲染,格式化会导致布局问题 -->
<template>
    <!-- prettier-ignore -->
    <pre class="code"><Icon class="copy-button" :name="'fa-solid:copy'" @click="copy"/><code v-html="highlighted"/></pre>
</template>
<style>
pre {
    position: relative;
    line-height: 1.6;
    margin-bottom: 1.6em;
    max-width: 100%;
    overflow: auto;
    padding:1rem 2rem;
    box-sizing: border-box;

    background-color: var(--code-background);
    border-radius: 0.5rem;
}
pre code {
    word-break: break-word;
}

.code * {
    transition: all 0.2s linear;
}
.copy-button {
    position: absolute;
    top: 0;
    right: 0;

    height: 1rem;
    width: 1rem;
    margin:0.5rem;

    opacity: 0;
    border: var(--widget-shadow-shine);
    background: var(--word-color-first);
}
pre.code:hover .copy-button {
    opacity: 1;
}
.copy-button:hover {
    background-color: var(--active-color);
}
</style>

<style>
@import "highlight.js/styles/github-dark.css";
</style>
