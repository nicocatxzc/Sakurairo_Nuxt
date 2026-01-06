<script setup>
const emit = defineEmits(["close"]);
defineExpose({
    showAnime,
});

const anime = ref({});
const show = ref(false);
function showAnime(data) {
    anime.value = {
        ...data,
    };
    show.value = true;
}
onMounted(() => {
    const animeCard = useTemplateRef("anime-card-ref");
    let stopwatch = watch(
        () => animeCard.value,
        () => {
            if (animeCard.value) {
                onClickOutside(animeCard.value, () => {
                    emit("close");
                    show.value = false;
                });
            }
        }
    );
    onUnmounted(() => {
        stopwatch();
    });
});
</script>

<template>
    <SiteModel :show="show">
        <div ref="anime-card-ref" class="anime-card-model">
            <div class="anime-card">
                <div class="anime-cover">
                    <img
                        :src="anime?.images"
                        :alt="`${anime?.name_cn}的封面`"
                    />
                </div>

                <div class="anime-detail">
                    <div class="anime-head">
                        <h3 class="anime-title">{{ anime?.name_cn }}</h3>
                        <button type="button" class="anime-link">
                            <a :href="anime.url" target="_blank"> 查看详情> </a>
                        </button>
                    </div>
                    <div class="anime-info">
                        <div class="publish">
                            <h4>发行日期</h4>
                            <p class="date">{{ anime.date }}</p>
                        </div>

                        <div class="anime-tag">
                            <h4>标签</h4>
                            <p class="tags">
                                <span
                                    v-for="tag in anime.tags"
                                    :key="tag"
                                    class="tag"
                                >
                                    #{{ tag }}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div class="anime-summary">{{ anime.summary }}</div>
                </div>
            </div>
        </div>
    </SiteModel>
</template>

<style lang="scss" scoped>
@media (min-aspect-ratio: 4/3) and (min-width: 900px) {
    .anime-card {
        height: 80dvh;
        width: 80dvw;

        display: flex;

        border-radius: 1rem;
        border: var(--border-shine);
        background-color: var(--widget-background-color);

        overflow: hidden;
    }

    .anime-cover {
        flex: 0 0 auto;
        aspect-ratio: 3 / 4;
        height: 100%;
        padding: 1rem;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 1rem;
        }
    }

    .anime-detail {
        flex: 1 1 auto;
        padding: 1.5rem 2rem;

        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    .anime-head {
        display: flex;
        align-items: baseline;
        gap: 1rem;

        .anime-title {
            font-size: 2rem;
            font-weight: 600;

            width: calc(100% - 5rem);

            word-wrap: break-word;
        }

        .anime-link {
            font-size: 1rem;
            white-space: nowrap;

            padding: 0.5rem;

            border: var(--border-sketch);
            &:hover {
                background-color: var(--active-color);
                border-color: var(--active-color);
                a {
                    color: #fff;
                }
            }
            &,
            * {
                transition: none;
            }
        }
    }

    .anime-info {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        h4 {
            font-size: 1.1rem;
            opacity: 0.8;
            margin-bottom: 0.25rem;
        }
    }

    .anime-tag {
        display: blovk;
        gap: 0.5rem;

        .tag {
            padding: 0.2rem 0.6rem;
            font-size: 0.8rem;
        }
    }

    .anime-summary {
        line-height: 1.7;
        opacity: 0.9;
    }
}
@media (max-aspect-ratio: 4/3), (max-width: 899px) {
    .anime-card {
        width: min(92vw, 48rem);
        max-height: 90dvh;

        padding: 1.25rem;

        border-radius: 1rem;
        border: var(--border-shine);
        background-color: var(--widget-background-color);

        overflow-y: auto;
    }

    .anime-cover {
        float: right;
        width: 50%;
        max-width: 16rem;

        margin: 0 0 1rem 1rem;

        img {
            width: 100%;
            height: auto;
            aspect-ratio: 3 / 4;
            object-fit: cover;
            border-radius: 0.75rem;
        }
    }

    .anime-detail {
        display: block;
    }

    .anime-head {
        display: block;
        margin-bottom: 0.75rem;

        .anime-title {
            font-size: 1.75rem;
            font-weight: 600;
            line-height: 1.2;
        }

        .anime-link {
            font-size: 1rem;
            white-space: nowrap;

            padding: 0.5rem;

            border: var(--border-sketch);
            &:hover {
                background-color: var(--active-color);
                border-color: var(--active-color);
                a {
                    color: #fff;
                }
            }
            &,
            * {
                transition: none;
            }
        }
    }

    .anime-info {
        display: block;
        margin-bottom: 1rem;

        h4 {
            font-size: 0.9rem;
            opacity: 0.8;
            margin: 0.75rem 0 0.25rem;
        }
    }

    .anime-tag {
        display: block;
        .tag {
            padding: 0.15rem 0.5rem;
            font-size: 0.75rem;
        }
    }

    .anime-summary {
        margin-top: 1rem;
        line-height: 1.75;
        opacity: 0.9;
    }
}
</style>
