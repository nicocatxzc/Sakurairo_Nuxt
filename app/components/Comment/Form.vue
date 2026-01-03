<script setup>
import md5 from "md5";
const { postId, reply } = defineProps({
    postId: {
        type: Number,
        required: true,
    },
    reply: {
        type: Object,
        default: () => {},
    },
});
const emit = defineEmits(["submit"]);

let config = useThemeConfig();
const auth = useAuth();
let comment = ref("");
let name = ref("");
let email = ref("");
let link = ref("");
let avatar = ref(config?.missingAvatarPlaceholder);
const form = useTemplateRef("commentForm");

let replyTarget = ref({});
onMounted(() => {
    const stopwatch = watch(
        () => reply,
        () => {
            replyTarget.value = reply;
            if (reply?.id) {
                form.value.scrollIntoView();
            }
        }
    );
    if (auth.user?.role) {
        name.value = auth.user?.name;
        email.value = auth.user?.email;
    }
    onUnmounted(() => {
        stopwatch();
    });
});

function checkEmail(email) {
    return email.match(
        /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    );
}
function setAvatar(email, size = 80) {
    if (!checkEmail(email)) {
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
    try {
        if (!checkEmail(email.value)) {
            ElMessage.error("请输入有效的邮箱地址");
            return;
        }
        let payload = {
            postId,
            comment: comment.value,
            name: name.value,
            email: email.value,
            link: link.value,
            parent: replyTarget.value?.id ?? "",
        };
        const data = await useEncrypt(JSON.stringify(payload));
        const res = await $fetch("/api/content/comments", {
            method: "PUT",
            body: data,
        });
        if (res?.comment) {
            emit("submit", {
                ...res.comment,
                author: {
                    node: {
                        name: auth.user?.name,
                        avatar: {
                            url: auth.user?.avatar?.url_96 || auth.user?.avatar,
                        },
                    },
                },
            });
            ElMessage.success("评论提交成功");
            comment.value = "";
            replyTarget.value = {};
        }
    } catch (error) {
        ElMessage.error(`评论提交失败,详细信息${error}`);
    }
}
</script>

<template>
    <div class="comment-form">
        <form id="comment-form" ref="commentForm" @submit.prevent="submit">
            <span v-if="replyTarget?.id" class="reply">
                正在回复给
                <a class="reply-target" :href="`#comment-${replyTarget.id}`">
                    @{{ replyTarget?.name }}
                </a>
                <a href="javascript:void()" @click="replyTarget = {}">
                    取消回复?</a
                >
            </span>
            <div class="comment-input">
                <textarea
                    v-model="comment"
                    name="comment"
                    rows="5"
                    tabindex="4"
                /><span class="placeholder">{{config?.commentInputPlaceHolder ?? '要来留个评论吗?'}}</span>
            </div>

            <div v-if="!auth.user?.role" class="infos">
                <ElAvatar size="default" class="avatar">
                    <NuxtPicture alt="navbar avatar" :src="avatar" class="nuxtpic"/>
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
            <div class="checks"><AuthCaptcha class="captcha" /></div>
            <div class="functions">
                <button type="submit" class="submit">{{config?.commentSubmitButtonText ?? '留言'}}</button>
            </div>
        </form>
    </div>
</template>

<style lang="scss" scoped>
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
    &:hover {
        box-shadow: 0 0.1rem 0.6rem -0.2rem var(--active-color);
    }
    #comment-form {
        display: flex;
        width: 100%;
        flex-direction: column;
    }
    .reply-target {
        color: var(--active-color);
    }
    .comment-input {
        height: 10rem;
        margin-bottom: 1rem;
        position: relative;

        textarea {
            font-size: 0.9rem;
            width: 100%;
            height: 100% !important;

            background-color: rgba(var(--widget-background), 0.5);

            border-radius: 0.6rem;
            border: var(--border-shine);
            box-shadow: var(--widget-shadow-shine);
            padding: 1.2rem;

            margin-bottom: 1.2rem;
            resize: vertical;

            outline: none;
            &:focus {
                border: var(--border-sketch);
            }
        }
        .placeholder {
            padding: .2rem;
            position: absolute;
            left: 1rem;
            top: .8rem;
        }
        textarea:focus ~ .placeholder {
            color: #fff;
            background-color: var(--word-color-second);
            transform: scale(0.75) translate(-1rem, -2.2rem);
            border-radius: 3px;
        }
    }
    .infos {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 2em;
        .input {
            width: 25%;
            padding: 0.5rem;
            outline: none;
            border: var(--border-shine);
            &:focus {
                border: var(--border-sketch);
            }
        }
    }
    .checks {
        .captcha {
            max-width: 20rem;
        }
    }

    .functions {
        display: flex;
        flex-flow: row-reverse;
        .submit {
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
        .submit:hover {
            color: var(--active-color);
            background-color: rgb(var(--widget-background));
        }
    }
}
</style>
