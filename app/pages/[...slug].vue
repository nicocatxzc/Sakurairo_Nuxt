<script setup>
const route = useRoute();

const { data, promise ,error } = await useCachedFetch(route.path, "/api/page-content", {
    promise: true,
    fetchOptions: {
        query: {
            path: route.path,
        },
    },
});
await promise;
if(error.value) {
    throw createError({
        statusCode: 404,
        statusMessage: "Not found",
    });
}

let page = computed(()=>{
    console.log(data.value)
    if (data.value?.type == "404") {
        showError({ statusCode: 404, statusMessage: "页面不存在" });
    }
    return data.value
})
</script>

<template>
    <section v-if="page != null && page?.type != '404'" class="main-container">
        <PagePost
            v-if="page.type === 'single' || page.type === 'page'"
            :page = "page"
        />
        <PageTaxonomy v-if="page.type==='category' || page.type === 'tag'" :page="page"/>
        <PageAuthor v-if="page.type==='author'" :page="page"/>
    </section>
</template>

<style scoped></style>
