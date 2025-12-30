<script setup>
import { ref, watch } from "vue";

const props = defineProps({
    context: Object,
});

function handleUpdate(value) {
    props.context.node.input(value);
}

const localValue = ref(props.context._value);
watch(
    () => props.context._value,
    (val) => {
        if (val !== localValue.value) {
            localValue.value = val;
        }
    }
);
</script>

<template>
    <ClientOnly>
        <div style="border: 1px solid #ccc">
            <MonacoEditor
                :model-value="props.context._value ?? ''"
                :lang="props.context.language || 'jsx'"
                :options="{
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }"
                class-name="editor"
                style="height: 12.5rem"
                @update:model-value="handleUpdate"
            />
        </div>
    </ClientOnly>
</template>
