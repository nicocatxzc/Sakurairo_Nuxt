<script lang="ts" setup>
const config = defineModel({ type: Object, required: true });

const emit = defineEmits(["submit"]);

const configEdit = ref("");
const isEditing = ref(false);

watch(
    () => config.value,
    (val) => {
        // 是否正在编辑
        if (isEditing.value) return;

        try {
            configEdit.value = JSON.stringify(toRaw(val), null, 2);
        } catch {}
    },
    {
        deep: true,
        immediate: true,
    },
);

// 导出
function exportConfig() {
    try {
        const json = JSON.stringify(toRaw(config.value), null, 2); // 原始配置

        const blob = new Blob([json], {
            type: "application/json",
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "theme-config-backup.json";
        a.click();
        URL.revokeObjectURL(url);
    } catch {
        ElMessage.error("导出失败");
    }
}

// 复制
async function copyConfig() {
    try {
        await navigator.clipboard.writeText(configEdit.value);
        ElMessage.success("已复制到剪贴板");
    } catch {
        ElMessage.error("复制失败");
    }
}

// 文件
async function beforeUpload(file: any) {
    console.log(file)
    try {
        const text = await file.raw.text();
        configEdit.value = text;
        isEditing.value = true;
        ElMessage.success("文件已加载");
    } catch {
        ElMessage.error("读取文件失败");
    }

    // 阻止默认上传
    return false;
}

// 恢复
async function submitRestore() {
    let parsed: any;

    try {
        parsed = JSON.parse(configEdit.value);
    } catch (e) {
        ElMessage.error("JSON 格式错误，无法恢复");
        return;
    }

    try {
        await ElMessageBox.confirm("确认恢复配置？当前配置将被覆盖。", "警告", {
            type: "warning",
        });

        emit("submit", parsed);
        ElMessage.success("已提交恢复请求");
    } catch {
        // 用户取消
    }
}
</script>

<template>
    <div class="page-backup">
        <h3>备份和恢复</h3>
        <p>
            你可以将此处的配置下载下来留作备份，以备配置遗失或损坏后用作恢复。
        </p>

        <div class="actions">
            <el-button type="primary" @click="exportConfig">
                导出配置
            </el-button>

            <el-button @click="copyConfig"> 复制配置 </el-button>

            <el-upload
                :show-file-list="false"
                :auto-upload="false"
                accept=".json"
                :on-change="beforeUpload"
            >
                <el-button>从文件恢复</el-button>
            </el-upload>

            <el-button type="danger" @click="submitRestore">
                确认更改
            </el-button>

            <el-button type="default" @click="isEditing = !isEditing">
                {{ isEditing ? "启用编辑" : "恢复预览" }}
            </el-button>
        </div>

        <el-input
            v-model="configEdit"
            :rows="12"
            type="textarea"
            class="editor"
            :readonly="isEditing"
        />
    </div>
</template>

<style lang="scss" scoped>
.page-backup {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
</style>
