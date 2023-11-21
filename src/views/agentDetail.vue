<script lang="ts" setup>
import { onMounted, provide, ref } from 'vue'
import axios from '../http/http.ts'
import { IResData } from '../models/common.ts'
import { useRoute, useRouter } from 'vue-router'
import { IAgent, IDispatcher } from '../models/agent.ts'
import { ArrowLeft, Edit, Promotion } from '@element-plus/icons-vue'
import AgentDispatchers from '../components/layout/agentDispatcher/agentDispatchers_view.vue'
const route = useRoute()
const router = useRouter()
const Agent = ref<IAgent>()
let description = ref<string | undefined>('')
const Dispatchers = ref<IDispatcher[]>([]) //Agent下的所有调度节点
const Dispatcher = ref<IDispatcher>({
    id: 0,
    agent_id: 0,
    name: ''

})
const isCreate = ref(false) //判断是否是创建模式
let isNameEditMode = ref(false)//判断Agent_name 是否是编辑模式
let agentName = ref('')

const isDrawerOpen = ref(false) //调度节点的新增or编辑面板
const isCreateDispatcher = ref(false) //判断是否是调度节点的新增模式



onMounted(async () => {
    let agentId = route.params.id

    if (agentId) {
        isCreate.value = false
        let url = '/agents/' + agentId
        let { data } = await axios.request<{ data: IResData }>('get', url)

        Agent.value = data.datas
        // 在页面加载时，设置 description 的初始值
        description.value = Agent.value?.description

        //获取Agent所有调度数据
        url = '/dispatchers/' + agentId
        let dispatchersResponse = await axios.request<{ data: IResData }>('get', url)
        console.log(dispatchersResponse.data)
        Dispatchers.value = dispatchersResponse.data.datas?.dispatchers
    } else {
        isCreate.value = true  //创建模式标志位
        isNameEditMode.value = true //编辑名称开启标志位
        console.log(isCreate.value)
        console.log(isNameEditMode.value)
    }

})

async function handleSaveName() {

    if (isCreate.value) {
        Agent.value = {
            name: agentName.value
        }
    } else {
        if (Agent.value) {
            Agent.value.name = agentName.value
        }
    }
    let pp = isCreate.value ? 'post' : 'put'

    let { data } = await axios.request<{ data: IResData }>(pp, '/agents', Agent.value)
    if (data.code == 200) {
        if (isCreate.value) {
            //从data.datas.id 重定向到 agentdetail/:id下
            // 从返回的数据中获取新创建的代理的 id
            let newAgentId = data.datas.id;
            console.log(newAgentId)
            router.push({
                name: "agentdetail",
                params: {
                    id: newAgentId
                }
            });
        }
    } else {
        alert(data.code + ':' + data.msg)
    }
    isNameEditMode.value = false
}

const toggleEditMode = () => {

    if (isNameEditMode.value) {
        // 编辑下再次点击，表示保存
        handleSaveName();
    } else {
        agentName.value = Agent.value?.name || '';
        isNameEditMode.value = true;
    }
};
function goToNewTask() {
    router.push({
        name: "newtask",
    });
}

function handleBlur_description() {
    handleSubmit_description()
}

async function handleSubmit_description() {
    console.log('触发修改')
    if (description.value != Agent.value?.description) {
        if (Agent.value) {
            Agent.value.description = description.value
        }
    }
    let { data } = await axios.request<{ data: IResData }>('put', '/agents', Agent.value)
    if (data.code != 200) {
        alert(data.code + ':' + data.msg)
    }
}

function cancelClick() {
    isDrawerOpen.value = false
}

async function openDrawer(id?: number) {

    if (id) {
        clearDispathcer()
        isDrawerOpen.value = true
        //获取调度节点
        let url = '/dispatcher/' + id
        let { data } = await axios.request<{ data: IResData }>('get', url)
        if (data.code == 200) {
            Dispatcher.value = data.datas
        } else {
            alert(data.code + ':' + data.msg)
        }


    } else {
        clearDispathcer()
        isDrawerOpen.value = true
        isCreateDispatcher.value = true
    }
}

function clearDispathcer() {
    Dispatcher.value = {
        id: 0,
        agent_id: 0,
        name: ''
    }
}

provide('openDrawer', openDrawer);

function confirmClick() {
    console.log('保存')
}

</script>
<template>
    <div class="top-line">
        <el-button :icon="ArrowLeft" circle @click="goToNewTask" />
        <el-text class="agent-name" v-if="!isNameEditMode">{{ Agent?.name }}</el-text>
        <el-input v-if="isNameEditMode" :autofocus="true" class="agent-name-input" v-model="agentName"
            @keyup.enter="handleSaveName" placeholder="请填写项目名称" maxlength="20" show-word-limit />

        <el-button type="primary" class="agent-name-button" :icon="isNameEditMode ? Promotion : Edit" circle
            @click="toggleEditMode" />

    </div>
    <el-input class="textarea" v-model="description" maxlength="30" placeholder="请输入助手的描述" show-word-limit type="textarea"
        :disabled="isCreate" @blur="handleBlur_description" @keyup.enter="handleSubmit_description" />
    <div v-if="!isCreate">
        <AgentDispatchers :dispatchers="Dispatchers" @openDrawer="openDrawer" />
    </div>

    <el-drawer v-model="isDrawerOpen">
        <template #header>
            <h4>{{ isCreateDispatcher ? '新增节点' : '编辑节点' }}</h4>
        </template>
        <template #default>
            <div>
                <h3>节点名称</h3>
                <el-input v-model="Dispatcher.name" placeholder="请填写..." maxlength="20" show-word-limit />
                <h3>节点说明</h3>
                <el-input v-model="Dispatcher.description" placeholder="请填写..." maxlength="30" show-word-limit />
                <h3>执行助理</h3>
                <div>
                    <el-table :data="Dispatcher.dispatch_units" style="width: 100%">
                        <el-table-column prop="agent_unit.name" label="助理名称" width="180" />
                        <el-table-column prop="next_action" label="下一步设置" width="180" />
                        <el-table-column prop="auto_next" label="自动执行到下一步" />
                    </el-table>
                    <div> <el-button type="primary" plain class="add-dispatcher-unit-button">添加助理</el-button></div>
                </div>
                <h3>是否设置为任务起点</h3>
            </div>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancelClick">取消</el-button>
                <el-button type="primary" @click="confirmClick">确认</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<style scoped>
.top-line {
    height: 32px;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
}


.agent-name {
    height: 40px;
    line-height: 40px;
    font-size: 32px;
    box-sizing: border-box;
    padding-left: 11px;
    margin-left: 30px;
    margin-right: 10px;
}

.textarea {
    width: 100%;
}

/* 根据需要调整描述的样式 */
.agent-name-input {
    margin-left: 30px;
    width: 80%;
    height: 50px;
    line-height: 50px;
    font-size: 32px;
    box-sizing: border-box;
}

.agent-name-button {
    margin-left: 30px;
}

.add-dispatcher-unit-button {
    margin-top: 10px;
    width: 100%;
}
</style>
