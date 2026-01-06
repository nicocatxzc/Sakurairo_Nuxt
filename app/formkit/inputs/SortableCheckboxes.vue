<script setup>
import { VueDraggable } from "vue-draggable-plus";
const props = defineProps({
    context: Object,
});
const list = computed({
    get() {
        return props.context.value || [];
    },
    set(val) {
        props.context.node.input(val);
    },
});

const options = computed(() => props.context.options || []);

/**
 * UI 状态
 */
const selected = ref([]);
const unselected = ref([]);

/**
 * 初始化：按 value 拆 options
 */
onMounted(() => {
    selected.value = [...list.value];
    unselected.value = options.value
        .map((o) => o.value)
        .filter((v) => !selected.value.includes(v));
});

/**
 * selected 变化 → 回写 FormKit
 */
watch(selected, (val) => {
    list.value = [...val];
});

watch(
    [selected, options],
    () => {
        unselected.value = options.value
            .map((o) => o.value)
            .filter((v) => !selected.value.includes(v));
    },
    { immediate: true }
);
</script>

<template>
    <div class="checkbox-group">
        <div class="selected">
            <!-- 已选 -->
            <template v-if="selected.length">
                <div class="title">已选</div>

                <VueDraggable
                    v-model="selected"
                    class="drag-list"
                    handle=".handle"
                    :animation="150"
                >
                    <div
                        v-for="val in selected"
                        :key="val"
                        class="group handle"
                    >
                        <el-checkbox-group v-model="selected">
                            <el-checkbox :value="val">
                                {{
                                    options.find((o) => o.value === val)
                                        ?.label ?? val
                                }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </VueDraggable>
            </template>
        </div>

        <!-- 未选 -->
        <div class="unselected">
            <template v-if="unselected.length">
                <div class="title">未选</div>

                <div class="drag-list">
                    <div v-for="val in unselected" :key="val" class="group">
                        <el-checkbox-group v-model="selected">
                            <el-checkbox :value="val">
                                {{
                                    options.find((o) => o.value === val)
                                        ?.label ?? val
                                }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.title {
    font-size: 0.85rem;
    color: #888;
}

.drag-list {
    border: 0.1rem solid gray;
    border-radius: 0.5rem;
    margin: 0.25rem 0;

    display: flex;
    gap: 0.25rem;
}

.group {
    padding: 0.4rem 0.6rem;
}

:deep(.handle) .el-checkbox__label {
    cursor: move;
}
</style>
