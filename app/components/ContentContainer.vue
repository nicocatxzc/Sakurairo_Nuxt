<script lang="ts" setup></script>

<template>
    <div class="content">
        <div class="container">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.content {
    width: 100vw;
    display: flex;
    justify-content: center;
}
.container {
    max-width: 860px;
    width: 100%;
}
@media (max-width: 860px) {
    .container {
        padding: 0 4%;
    }
}
</style>
