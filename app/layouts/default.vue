<script setup></script>

<template>
    <div class="background">
        <div class="background-filter" />
        <ClientOnly>
            <ProgressBar class="progress-bar" />
        </ClientOnly>
        <NavBar class="nav-bar" />
        <NavBarMobile class="nav-bar-mobile" />
        <slot class="layout-slot" />
        <SiteFooter class="site-footer" />
        <ClientOnly>
            <SiteWidget class="site-widget" />
            <SiteModels />
        </ClientOnly>
    </div>
</template>

<style scoped>
.background-filter {
    position: fixed;
    height: 100dvh;
    width: 100dvw;
    background-color: var(--page-background-color);
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
.site-footer {
    z-index: 1;
}
.site-widget {
    z-index: 10;
}
.login-form {
    z-index: 12;
}
.nav-bar-mobile {
    display: none;
    z-index: 10;
}
@media screen and (max-width: 860px) {
    .nav-bar {
        display: none;
    }
    .nav-bar-mobile {
        display: flex;
    }
}
</style>
