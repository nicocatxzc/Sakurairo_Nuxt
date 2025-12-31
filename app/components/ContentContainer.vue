<script lang="ts" setup></script>

<template>
    <div class="content flex-center">
        <div class="container">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.content {
    position: relative;
    width: 100vw;
}
.container {
    position: relative;
    max-width: 860px;
    width: 100%;
}
@media (max-width: 860px) {
    .container {
        padding: 0 4%;
    }
}
</style>
