<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { ChromePicker, tinycolor } from 'vue-color';

const props = defineProps({
    context: Object,
    disabled: {
        type: Boolean,
        default: false,
    },
});

const initValue = props.context._value;
const colorStr = ref(initValue || '');

function updateValue(v) {
    // 提交字段
    colorStr.value = v;
    props.context.node.input(v);
}

watch(
    // 回填
    () => initValue,
    v => {
        if (v !== colorStr.value) colorStr.value = v;
    }
);

watch(
    // 更新字段
    () => colorStr.value,
    v => {
        updateValue(v);
    }
);

function handleInputChange(v) {
    try {
        const tc = tinycolor(v);
        if (tc.isValid()) updateValue(v);
        else colorStr.value = v; // 保留输入但不触发 change
    } catch {}
}

const show = ref(false);
const wrapper = ref(null);

function toggle() {
    if (props.disabled) return;
    show.value = !show.value;
}

function clickOutside(e) {
    if (wrapper.value && !wrapper.value.contains(e.target)) show.value = false;
}

onMounted(() => document.addEventListener('mousedown', clickOutside));
onBeforeUnmount(() => document.removeEventListener('mousedown', clickOutside));
</script>

<template>
    <div ref="wrapper" style="position: relative; display: flex; align-items: center; gap: 8px">
        <!-- 色块 -->
        <div style="width: 32px; height: 32px; border-radius: 4px; border: 1px solid #ddd; cursor: pointer" :title="String(colorStr)" @click="toggle">
            <div
                style="width: 100%; height: 100%; border-radius: 4px"
                :style="{
                    background: typeof colorStr === 'object' ? tinycolor(colorStr).toRgbString() : colorStr || 'transparent',
                }"
            />
        </div>

        <!-- 右侧输入框 -->
        <el-input
            v-model="colorStr"
            size="small"
            style="width: 140px"
            :disabled="disabled"
            placeholder="#fff / rgba(...)"
            @input="handleInputChange"
        />

        <!-- 浮动调色板 -->
        <div
            v-if="show"
            style="
                position: absolute;
                top: 38px;
                left: 0;
                z-index: 9999;
                background: #fff;
                border-radius: 6px;
                box-shadow: 0 3px 12px rgba(0, 0, 0, 0.16);
                padding: 6px;
            "
        >
            <ChromePicker v-model="colorStr" />
        </div>
    </div>
</template>
