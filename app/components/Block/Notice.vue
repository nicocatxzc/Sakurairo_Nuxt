<script lang="ts" setup>
const { dataInfo } = defineProps({
    dataInfo: {
        type: String,
        required: true,
    },
});
const notice = computed(() => {
    try {
        return JSON.parse(dataInfo);
    } catch (error) {
        console.log(dataInfo);
        return {
            type: "task",
            content: "解析信息时遇到错误",
        };
    }
});
</script>

<template>
    <div class="block-notice">
        <Icon
            class="icon task"
            v-if="notice?.type == 'task'"
            name="fluent:clipboard-task-list-rtl-24-regular"
        />
        <Icon
            class="icon warning"
            v-if="notice?.type == 'warning'"
            name="fa7-solid:warning"
        />
        <Icon
            class="icon noway"
            v-if="notice?.type == 'noway'"
            name="fa7-solid:xmark-square"
        />
        <Icon
            class="icon buy"
            v-if="notice?.type == 'buy'"
            name="fluent:checkbox-checked-24-filled"
        />
        <span v-html="notice?.content"></span>
    </div>
</template>

<style lang="scss" scoped>
.block-notice,
.block-notice * {
    box-sizing: border-box;
    transition: all .3s ease;
}
.block-notice {
    margin: 1rem .5rem ;
    padding: 1rem 1rem 1rem 1.5rem ;
    position: relative ;

    display: flex;
    align-items: center;

    background: rgba(var(--widget-background), 0.5);
    border: var(--border-shine);
    border-radius: .5rem ;
    box-shadow: var(--widget-shadow-shadow);

    text-indent: 0 ;

    &:hover {
        box-shadow: var(--widget-shadow-shining);
        background: rgba(var(--widget-background), 0.8);
        transform: translateY(-0.1rem);
    }

    .icon {
        height: 1.5rem;
        width: 1.5rem;
        margin-right: 1.5rem;
    }
    .task {
        color: #7d7d7d ;
        text-indent: 0 ;
    }
    
    .warning {
        color: #f1c700 ;
        text-indent: 0 ;
    }
    
    .noway {
        color: #dc143c ;
        text-indent: 0 ;
    }
    
    .buy {
        color: #32cd32 ;
        text-indent: 0 ;
    }
}

</style>
