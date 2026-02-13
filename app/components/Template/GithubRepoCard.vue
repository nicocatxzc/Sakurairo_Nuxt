<script setup>
import colors from "@/utils/languageColors.json";
const { dataInfo } = defineProps({
    dataInfo: {
        type: String,
        required: true,
    },
});
const repo = computed(() => {
    try {
        return JSON.parse(dataInfo);
    } catch (error) {
        return {
            url: "#",
            name: "无法解析的仓库",
            description: String(dataInfo),
            language: "JSON",
            stars: 0,
            forks: 0,
            license: "MIT",
        };
    }
});
</script>

<template>
    <div class="github-card">
        <a :href="repo?.url" target="_blank" rel="noopener">
            <header class="repo-name">
                <span class="title-text">
                    <Icon name="local:repo" mode="svg" class="icon"></Icon>
                    {{ repo?.name }}
                </span>
            </header>

            <div class="repo-desc">
                {{ repo?.description }}
            </div>

            <div class="repo-meta">
                <span class="lang" v-if="repo?.language">
                    <span
                        class="dot"
                        :style="{
                            backgroundColor: colors[repo?.language] ?? '#999',
                        }"
                    />
                    {{ repo?.language }}
                </span>

                <span class="stars">
                    <Icon name="local:star" mode="svg" class="icon"></Icon>
                    {{ repo?.stars }}
                </span>

                <span class="forks">
                    <Icon name="local:fork" mode="svg" class="icon"></Icon>
                    {{ repo?.forks }}
                </span>

                <span class="license">
                    <Icon name="local:license" mode="svg" class="icon"></Icon>
                    {{ repo?.license }}
                </span>
            </div>
        </a>
    </div>
</template>

<style lang="scss" scoped>
.github-card,
.github-card * {
    box-sizing: border-box;
}

.github-card {
    width: 25rem;
    height: 7.5rem;
    padding: 1rem 1.1rem;

    border-radius: 0.5rem;
    border: var(--border-sketch);
    background: rgb(var(--widget-background));

    a {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-decoration: none;
        color: inherit;
        width: 100%;
        height: 100%;
    }

    .icon {
        fill: var(--word-color-first);
        flex-shrink: 0;
        height: 1rem;
        width: 1rem;
    }

    .repo-name {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        font-weight: 600;
        font-size: 1.1rem;
        color: #2f80ed;

        .title-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .repo-desc {
        font-size: 0.85rem;

        line-height: 1.4;
        margin-top: 0.25rem;

        flex: 1;

        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .repo-meta {
        display: flex;
        justify-content: left;
        align-items: center;

        gap: 1rem;

        font-size: 0.8rem;

        * {
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }

        .lang {
            display: flex;
            align-items: center;
            gap: 0.5rem;

            .dot {
                width: 0.8rem;
                height: 0.8rem;
                border-radius: 50%;
                display: inline-block;
            }
        }
    }
}
</style>
