<script setup lang="ts">
import assistantsDrawer from '../components/layout/assistantsDrawer.vue'
import axios from '../http/http'
import { onMounted, ref } from 'vue'
import { IResData } from '../models/common'
import { IAgentUnit } from '../models/agent'
import { Plus } from '@element-plus/icons-vue'
interface IDatas {
    agents: IAgentUnit[]
    page: number
    total: number
}

const tableData = ref<IAgentUnit[]>([])
const drawerVisible = ref(false)
const drawerTitle = ref('')
const agentUnitID = ref<number>()

onMounted(async () => {
    let { data } = await axios.request<{ data: IResData }>('get', '/agent_units')
    const datas: IDatas = data.datas
    tableData.value = datas.agents
})
const handleAdd = () => {
    drawerTitle.value = "添加"
    drawerVisible.value = true
    console.log(drawerVisible.value)
}


const handleEdit = (row: IAgentUnit) => {

    drawerTitle.value = "编辑"
    drawerVisible.value = true
    agentUnitID.value = row.id
    console.log(agentUnitID.value)
}
const handleDelete = (index: number, row: IAgentUnit) => {
    console.log(index, row)
}

function closeDrawer() {
    drawerVisible.value = false;
    agentUnitID.value = 0

}

async function handleSuccess() {
    // Refresh the list or perform any other action on success
    let { data } = await axios.request<{ data: IResData }>('get', '/agent_units')
    const datas: IDatas = data.datas
    tableData.value = datas.agents

}




function handleError(errorMessage: string) {
    // Display the error message using a notification library or alert
    alert(errorMessage);
}
</script>

<template>
    <div v-if="drawerVisible">
        <assistantsDrawer :visible="drawerVisible" :title="drawerTitle" :agentUnitID="agentUnitID" @add="handleAdd"
            @modify="handleEdit" @close="closeDrawer" @success="handleSuccess" @error="handleError" />
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2>智能助理</h2>
        <el-button @click="handleAdd" type="primary" :icon="Plus">添加</el-button>
    </div>
    <el-table :data="tableData"  style="width: 100%">
        <el-table-column prop="name" label="名称(name)" width="300" />
        <el-table-column prop="prompt" label="提示词(prompt)" width="600" />
        <el-table-column prop="category" label="分类" />
        <el-table-column label="操作">
            <template #default="scope">
                <!-- <el-button size="small" @click="handleRun(scope.row)">运行</el-button> -->
                <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped></style>
