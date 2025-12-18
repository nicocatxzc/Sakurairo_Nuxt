<script setup>
import md5 from "md5";
let config = useThemeConfig();

let comment = ref("");
let name = ref("");
let email = ref("");
let link = ref("");
let avatar = ref(config?.missingAvatarPlaceholder);

function setAvatar(email, size = 80) {
    if (
        !email.match(
            /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        )
    ) {
        avatar.value = config?.missingAvatarPlaceholder;
        return;
    }
    avatar.value =
        "https://gravatar.com/avatar/" +
        md5(email) +
        ".jpg?s=" +
        size +
        "&d=mm";
}

async function submit() {
    let payload = {
        comment: comment.value,
        name: name.value,
        email: email.value,
        link: link.value,
    };
    const data = useEncrypt(JSON.stringify(payload));
    const res = await $fetch("/api/comment", {
        method: "PUT",
        body: data,
    });
    console.log(res);
}
</script>

<template>
    <div class="comment-form">
        <form id="comment-form" @submit.prevent="submit">
            <textarea
                v-model="comment"
                name="comment"
                rows="5"
                tabindex="4"
                placeholder="要来留个评论吗?"
                class="comment-input"
            />
            <div class="infos">
                <ElAvatar size="default" class="avatar">
                    <NuxtImg alt="navbar avatar" :src="avatar" />
                </ElAvatar>
                <input
                    v-model="name"
                    type="text"
                    placeholder="昵称"
                    class="input name"
                    required
                />
                <input
                    v-model="email"
                    type="text"
                    placeholder="邮箱"
                    class="input email"
                    required
                    @blur="setAvatar(email)"
                />
                <input
                    v-model="link"
                    type="text"
                    placeholder="个人主页"
                    class="input link"
                />
            </div>
            <div class="checks"><AuthCaptcha /></div>
            <div class="functions">
                <button type="submit" class="submit">留言</button>
            </div>
        </form>
    </div>
</template>

<style scoped>
.comment-form,
.comment-form * {
    transition: all 0.4s ease-in-out;
}
.comment-form {
    width: 91%;
    margin: 0 auto;
    padding: 2rem 1.6rem;
    margin-bottom: 4rem;

    border: var(--border-shine);
    background-color: rgba(var(--widget-background), 0.5);
    box-shadow: var(--widget-shadow-shine);

    border-radius: 1rem;
    will-change: box-shadow;
}
.comment-form:hover {
    box-shadow: 0 0.1rem 0.6rem -0.2rem var(--active-color);
}
#comment-form {
    display: flex;
    width: 100%;
    flex-direction: column;
}
.comment-input {
    font-size: 0.9rem;

    background-color: rgba(var(--widget-background), 0.5);

    border-radius: 0.6rem;
    border: var(--border-shine);
    box-shadow: var(--widget-shadow-shine);
    padding: 1.2rem;
    height: 10rem;
    margin-bottom: 1.2rem;
    resize: vertical;

    outline: none;
}
.comment-input:focus {
    border: var(--border-sketch);
}
.infos {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2em;
}
.infos .input {
    padding: 0.5rem;
    outline: none;
    border: var(--border-shine);
}
.infos .input:focus {
    border: var(--border-sketch);
}
.functions {
    display: flex;
    flex-flow: row-reverse;
}
.functions .submit {
    font-size: 1rem;
    width: 30%;
    max-width: 8.5rem;
    height: 2.8rem;
    margin: 0;
    padding: 0.6rem 1.25rem;

    color: rgb(var(--widget-background));
    background: var(--active-color);

    border: 0.1rem solid var(--active-color);
    border-radius: 0.6rem;
    will-change: color background-color;
}
.functions .submit:hover {
    color: var(--active-color);
    background-color: rgb(var(--widget-background));
}
</style>
