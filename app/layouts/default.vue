<script setup></script>

<template>
    <div class="background">
        <div class="background-filter"/>
        <ProgressBar class="progress-bar" />
        <NavBar class="nav-bar" />
        <slot class="layout-slot" />
        <SiteFooter class="site-footer"/>
    </div>
</template>

<style scoped>
.background-filter {
    position: fixed;
    height: 100dvh;
    width: 100dvw;
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: saturate(120%) blur(8px);
}
.background-filter {
    z-index: -1;
}
.progress-bar {
    z-index: 11;
}
.nav-bar {
    z-index: 10;
}
.layout-slot {
    z-index: 1;
}
</style>
