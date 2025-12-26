<script lang="ts" setup>
const { comment } = defineProps({
    comment: {
        type: Object,
        required: true,
    },
});
const emit = defineEmits(["reply"]);
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
    <li :id="`comment-${comment.databaseId}`" class="comment-card">
        <div class="comment">
            <button
                class="reply-button"
                @click="
                    emit('reply', {
                        id: comment.databaseId,
                        name: comment.author.node.name,
                    })
                "
            >
                回复
            </button>
            <section class="comment-infos">
                <ElAvatar size="default" class="author-avatar">
                    <NuxtImg
                        alt="comment author avatar"
                        :src="comment.author.node.avatar?.url"
                    />
                </ElAvatar>
                <div class="comment-metas">
                    <span class="author-name">{{
                        comment.author.node.name
                    }}</span>
                    <div class="comment-meta-list">
                        <time :datetime="comment.date">
                            发布于 {{ comment.date }}
                        </time>
                    </div>
                </div>
            </section>
            <section class="comment-content">
                <a
                    v-if="comment.parent?.node"
                    :href="`#comment-${comment.parent.node.databaseId}`"
                    class="reply"
                >
                    @{{ comment.parent.node.author.name }}
                </a>
                <span v-html="comment.content" />
            </section>
        </div>
    </li>
</template>

<style scoped>
.comment-card {
    position: relative;
    width: 100%;
    margin: 0 auto 1.5rem;
    padding: 1.6rem;

    border-radius: 1rem;
    background-color: rgba(var(--widget-background), 0.5);
    box-shadow: var(--widget-shadow-shine);
    border: var(--border-shine);
    transition: all 0.5s ease-in-out;
}
.comment-infos {
    display: flex;
    gap: 0.5rem;
}
.comment-metas {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.comment-content .reply {
    color: var(--active-color);
}
.reply-button {
    font-size: 0.8rem;

    position: absolute;
    right: 1.6rem;
    top: 1.6rem;
    padding: 0.1rem 0.5rem;
    border-radius: 0.3rem;
    opacity: 0;

    color: rgb(var(--widget-background));
    background-color: var(--active-color);
    border: var(--border-active);
    transition: all 0.2s ease;

    will-change: opacity;
}
.comment-card:hover .reply-button {
    opacity: 1;
}
</style>
