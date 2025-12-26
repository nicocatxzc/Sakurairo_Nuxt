import { defineStore } from "pinia";
type scrollDirection = 'down' | 'up' | 'none'

// 滚动进度
export const useScrollStore = defineStore("scroll", () => {
    let progress = ref(0);
    let direction = ref<scrollDirection>("down"); // down up none
    let lastScrollY = ref(0);

    function update(scrollY:number, winHeight:number, docHeight:number) {
        const maxScroll = docHeight - winHeight;
        if (maxScroll <= 0) {
            progress.value = 100;
            return;
        }

        const newPercent = Math.min(
            100,
            Math.max(0, (scrollY / maxScroll) * 100)
        );
        progress.value = Number(newPercent.toFixed(2));

        // 计算方向
        if (Math.abs(scrollY - lastScrollY.value) > 5) {
            // 5px 阈值防抖动
            direction.value = scrollY > lastScrollY.value ? "down" : "up";
        }
        lastScrollY.value = scrollY;
    }

    function reset() {
        progress.value = 0;
        direction.value = "none";
        lastScrollY.value = 0;
    }

    return { progress, direction, update, reset };
});

// 加载进度
export const useLoadStore = defineStore("load", () => {
    let progress = ref(0);
    let loadState = ref("free"); // loading/success/error/free

    type state = "free" | "loading" | "success" | "error"
    function updateState(state:state="free", prog = 0) {
        switch (state) {
            case "free":
                progress.value = 0;
                loadState.value = state;
                break;
            case "loading":
                progress.value = prog;
                loadState.value = state;
                break;
            case "success":
                progress.value = prog ? prog : 100;
                loadState.value = state;
                setTimeout(() => {
                    updateState("free")
                }, 3000);
                break;
            case "error":
                progress.value = prog ? prog : 100;
                loadState.value = state;
                ElMessage({
                    message: "页面加载失败",
                    type: "warning",
                });
                setTimeout(() => {
                    progress.value = 0;
                    loadState.value = "free";
                }, 1000);
                break;

            default:
                progress.value = 0;
                loadState.value = "free";
                break;
        }
    }
    return { progress, loadState, updateState };
});
