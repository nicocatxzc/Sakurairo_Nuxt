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

function handleAdd() {
    list.value = [
        ...list.value,
        {
            labelKey: Date.now(),
        },
    ];
}

function remove(index) {
    list.value.splice(index, 1);
}

function render(field, item) {
    const Comp =
        field.$formkit?.library && Object.values(field.$formkit.library)[0];

    if (!Comp) return null;

    const model = computed({
        get: () => item[field.name],
        set: (v) => (item[field.name] = v),
    });

    return h(Comp, {
        context: {
            value: model.value,
            handlers: {
                blur() {},
            },
            node: {
                input: (v) => (model.value = v),
            },
            classes: {},
        },
    });
}
</script>

<template>
    <div>
        <VueDraggable
            v-model="list"
            :animation="150"
            handle=".group"
            class="drag-list"
        >
            <div
                v-for="(item, index) in list"
                :key="item.labelKey"
                class="group"
            >
                <div class="group-inputs">
                    <template
                        v-for="comp in props.context.innerSchema"
                        :key="comp.name"
                    >
                        <label class="label">{{ comp.label }}</label>
                        <component :is="render(comp, item)" />
                    </template>
                </div>
                <div class="trash">
                    <Icon
                        :name="'fa7-solid:trash'"
                        class="icon"
                        @click="remove(index)"
                    />
                </div>
            </div>
        </VueDraggable>
        <ElButton @click="handleAdd">新增</ElButton>
    </div>
</template>

<style scoped>
.drag-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}
.group {
    margin: 0 0.1rem;

    display: flex;

    border: 0.1rem solid gray;
    border-radius: 0.5rem;

    cursor: move;
}
.group-inputs {
    width: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
}
.label {
    width: fit-content;
}
.trash {
    display: flex;
    align-items: center;
    outline: gray;

    cursor: pointer;
}
.trash:hover {
    background-color: gray;
}
.trash .icon {
    background-color: red;
}
</style>
