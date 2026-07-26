<script setup>
const props = defineProps({
    node: { type: Object, required: true },
    componentsMap: { type: Object, default: () => ({}) },
});

// 计算匹配到的规则
const matchedRule = computed(() => {
    for (const key of Object.keys(props.componentsMap || {})) {
        const rule = props.componentsMap[key];
        try {
            if (
                typeof rule.conditions === "function" &&
                rule.conditions(props.node)
            ) {
                return rule;
            }
        } catch (e) {
            // 捕获错误
        }
    }
    return null;
});

// 决定要用的组件
const resolvedComponent = computed(() => {
    if (matchedRule.value) {
        // 如果规则里有对应字段
        if (matchedRule.value.component) return matchedRule.value.component;
        // 如果没有则退回到原始标签
    }
    // 用原生标签
    return props.node.name;
});

// 传递节点数据
const resolvedProps = computed(() => {
    const baseAttrs = props.node.attrs || {};
    // console.log(props.node)
    if (
        matchedRule.value &&
        typeof matchedRule.value.propsMapper === "function"
    ) {
        try {
            return matchedRule.value.propsMapper(props.node, baseAttrs) || {};
        } catch (e) {
            return baseAttrs;
        }
    }
    if (!baseAttrs?.id && ['h1','h2','h3','h4','h5'].includes(props.node.name)) {
        baseAttrs.id = props.node.raw?.children[0]?.data
    }
    return baseAttrs;
});

// 事件映射
const resolvedListeners = computed(() => {
    if (
        matchedRule.value &&
        typeof matchedRule.value.listenersMapper === "function"
    ) {
        try {
            return matchedRule.value.listenersMapper(props.node) || {};
        } catch (e) {
            return {};
        }
    }
    return {};
});
</script>

<template>
    <template v-if="node.type === 'text'">
        {{ node.text }}
    </template>

    <template v-else-if="node.type === 'tag'">
        <component
            :is="resolvedComponent"
            v-bind="resolvedProps"
            v-on="resolvedListeners"
        >
            <template v-if="matchedRule?.renderChildren ?? true" #default>
                <HtmlNodeRender
                    v-for="(c, i) in node.children"
                    :key="i"
                    :node="c"
                    :components-map="componentsMap"
                />
            </template>
        </component>
    </template>
</template>
