import { defineStore } from "pinia";

export const useModelStore = defineStore("model", () => {
    const search = ref(false)

    return { search };
});
