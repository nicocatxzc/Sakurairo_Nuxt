<script setup>
const themeConfig = useThemeConfig();
const list = themeConfig.value?.showAreaContent;
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
    <ul class="showcard-list">
        <div v-for="(item, index) in list" class="showcard" :key="index">
            <div class="title">
                <h3 v-html="item?.title" />
            </div>
            <NuxtLink
                :href="item?.target"
                :target="item?.target.match(/http/)?'_blank':'_self'"
                :rel="item?.target.match(/http/)?'external nofollow noreferrer':''"
                class="card-link"
            >
                <div class="card-image">
                    <NuxtPicture
                    class="nuxtpic"
                        format="webp"
                        :quality="100"
                        :alt="'showcard-image'"
                        :src="item?.imageUrl"
                        loading="lazy"
                    />
                </div>
                <div class="card-info">
                    <p class="card-desc" v-html="item.desc" />
                </div>
            </NuxtLink>
        </div>
    </ul>
</template>

<style scoped>
.showcard-list {
    display: grid;
    grid-template-columns: 1fr;
    max-width: calc(25rem * 3 + 2rem * 2);
    margin-inline: auto;
    gap: 1rem;
    justify-content: center;

    z-index: 0;
}
@media screen and (min-width: 50rem){
    .showcard-list {
        grid-template-columns: repeat(2,1fr);
    }
}
@media screen and (min-width: 70rem) {
    .showcard-list {
        grid-template-columns: repeat(3,1fr);
    }
}
.showcard {
    position: relative;
    height: 14rem;

    border-radius: 1.25rem;
    overflow: hidden;
}
.showcard,
.showcard * {
    transition: all 0.3s ease;
}
.showcard .title {
    width: 100%;
    padding: 1rem 1.25rem;
    top: 0;
    left: 0;
    position: absolute;

    background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.4) 0%,
        rgba(0, 0, 0, 0.2) 60%,
        transparent 100%
    );
    border-radius: 1.25rem 1.25rem 0 0;
    mask-image: linear-gradient(180deg, #000000 20%, #0000004d);
    backdrop-filter: blur(4px);

    z-index: 1;
}
.title h3 {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
.card-link {
    z-index: 0;
}
.card-image {
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;

    position: absolute;
}
.card-image .nuxtpic {
    display: block;
    height: 100%;
    width: 100%;
}
.card-info {
    width: 100%;
    bottom: 0;
    left: 0;
    position: absolute;

    opacity: 0.9;
    padding: 4rem 1.25rem 2rem;
    background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.6) 0%,
        rgba(0, 0, 0, 0.3) 70%,
        transparent 100%
    );
    transform: translateY(1rem);
    z-index: 1;
}
.showcard .title,
.card-desc {
    color: #fff;
}
.showcard:hover {
    transform: translateY(-0.35rem);
}
.showcard:hover .card-image {
    transform: scale(1.1);
}
</style>
