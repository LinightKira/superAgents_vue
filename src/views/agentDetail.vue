<script lang="ts" setup>
import { onMounted, provide, ref } from 'vue'
import {
    Delete,
} from '@element-plus/icons-vue'
import axios from '../http/http.ts'
import { IResData } from '../models/common.ts'
import { useRoute, useRouter } from 'vue-router'
import { IAgent, IDispatcher, IDispatchUnit, IAgentUnit } from '../models/agent.ts'
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
let Dispatcher_Unit = ref<IDispatchUnit>({
    id: 0,
    dispatcher_id: 0,
})

const isCreate = ref(false) //判断是否是创建模式
let isNameEditMode = ref(false)//判断Agent_name 是否是编辑模式
let agentName = ref('')

const isDrawerOpen = ref(false) //调度节点的新增or编辑面板
const isCreateDispatcher = ref(false) //判断是否是调度节点的新增模式

const dispatch_unit_visible = ref(false)  //调度节点单元变更标志位
const isDispatchUnitChanged = ref(false) //判断调度节点单元是否发生变更，若变革，则提交保存的时候更新节点单元数据



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

function cancelClick_drawer() {
    isDrawerOpen.value = false
}

async function openDrawer(id?: number) {
    //初始化标志位
    isDispatchUnitChanged.value = false
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

function confirmClick_drawer() {
    console.log('保存')

}

//这里的赋值是指针赋值？
const handleEdit_dispatchUnit = (row: IDispatchUnit) => {
    Dispatcher_Unit.value = row
    dispatch_unit_visible.value = true
    get_agent_units()
}

async function handleDelete_dispatchUnit(row: IDispatchUnit) {
    if (row.id === 0) {
        // 如果 id 为 0，表示尚未保存到数据库，直接从数组中删除
        if (Dispatcher.value.dispatch_units) {
            const index = Dispatcher.value.dispatch_units.indexOf(row);
            if (index !== -1) {
                Dispatcher.value.dispatch_units.splice(index, 1);
            }
        }
    } else {
        // 如果 id 不为 0，表示已保存到数据库，发送删除请求
        let url = '/dispatch_unit/' + row.id;
        try {
            let { data } = await axios.request<{ data: IResData }>('delete', url);
            if (data.code !== 200) {
                alert(data.code + ':' + data.msg);
            }
        } catch (error) {
            console.error('Error deleting dispatch unit:', error);
        }
    }
}

function handleAdd_dispatcher_unit() {
    clear_dialog_dispatchUnit()
    dispatch_unit_visible.value = true
    get_agent_units()
}

const AgentUnits = ref<IAgentUnit[]>([]) //获取所有的AgentsUnit 助理数据

interface IDatas {
    agents: IAgentUnit[]
    page: number
    total: number
}

async function get_agent_units() {
    let { data } = await axios.request<{ data: IResData }>('get', '/agent_units')
    const datas: IDatas = data.datas
    AgentUnits.value = datas.agents
}

function cancelClick_dialog_dispatchUnit() {
    dispatch_unit_visible.value = false
    clear_dialog_dispatchUnit()
}

function clear_dialog_dispatchUnit() {
    Dispatcher_Unit.value = {
        id: 0,
        dispatcher_id: 0,
    }
}

function confirmClick_dialog_dispatchUnit() {

    if (Dispatcher_Unit.value.id == 0) {
        console.log('新增')
        Dispatcher_Unit.value.dispatcher_id = Dispatcher.value.id
        if (Dispatcher_Unit.value.agent_unit_id != 0) {
            let foundAgentUnit = AgentUnits.value.find(agentUnit => agentUnit.id === Dispatcher_Unit.value.agent_unit_id)

            if (foundAgentUnit) {
                Dispatcher_Unit.value.agent_unit = foundAgentUnit
                if (!Dispatcher.value?.dispatch_units) {
                    // 如果 Dispatcher.value 或 dispatch_units 为 undefined，则进行处理
                    Dispatcher.value.dispatch_units = []
                }
                Dispatcher.value.dispatch_units.push(Dispatcher_Unit.value)
                isDispatchUnitChanged.value = true
            }

        }

    } else {
        console.log('修改')
        // 找到要修改的 Dispatch Unit 在 Dispatch Units 数组中的索引
        if (Dispatcher.value.dispatch_units) {
            const index = Dispatcher.value.dispatch_units.findIndex(unit => unit.id === Dispatcher_Unit.value.id)
            console.log('index:',index,Dispatcher.value.dispatch_units[index])
            if (index !== -1) {
                //修改后的agent_unit_id和原始id不相同 证明确实修改了
                console.log(Dispatcher.value.dispatch_units[index].agent_unit_id,Dispatcher_Unit.value.agent_unit_id)
                if (Dispatcher.value.dispatch_units[index].agent_unit_id != Dispatcher_Unit.value.agent_unit_id) {
                    
                    let foundAgentUnit = AgentUnits.value.find(agentUnit => agentUnit.id === Dispatcher_Unit.value.agent_unit_id)
                    console.log('foundagentunit:',foundAgentUnit)
                    if (foundAgentUnit) {
                        console.log('agentunit:',foundAgentUnit)
                        // 更新相应属性值
                        Dispatcher.value.dispatch_units[index].agent_unit = foundAgentUnit;
                        // 这里可以根据具体情况更新其他属性值
                        Dispatcher.value.dispatch_units[index].agent_unit_id=foundAgentUnit.id
                        // 标记 Dispatch Unit 已被修改
                        isDispatchUnitChanged.value = true;
                    }
                }
            } else {
                // 没有找到要修改的 Dispatch Unit
                console.error('Dispatch Unit not found for modification');
            }
        }
    }
    console.log(Dispatcher.value.dispatch_units)
    cancelClick_dialog_dispatchUnit()

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
                    <el-table :data="Dispatcher.dispatch_units" style="width: 100%" @row-click="handleEdit_dispatchUnit">
                        <el-table-column prop="agent_unit.name" label="助理名称" width="180" />
                        <el-table-column prop="next_action" label="下一步设置" width="180" />
                        <el-table-column prop="auto_next" label="自动执行到下一步" />
                        <el-table-column label="操作">

                            <template #default="scope">
                                <el-popconfirm title="是否要删除？">
                                    <template #reference>
                                        <el-button type="danger" :icon="Delete" circle
                                            @click.native.stop="handleDelete_dispatchUnit(scope.row)" />
                                    </template>
                                </el-popconfirm>
                            </template>

                        </el-table-column>
                    </el-table>
                    <div> <el-button type="primary" plain class="add-dispatcher-unit-button"
                            @click="handleAdd_dispatcher_unit">添加助理</el-button></div>
                </div>
                <h3>是否设置为任务起点</h3>
            </div>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancelClick_drawer">取消</el-button>
                <el-button type="primary" @click="confirmClick_drawer">确认</el-button>
            </div>
        </template>
    </el-drawer>

    <el-dialog v-model="dispatch_unit_visible" title="节点单元">
        <el-form :model="Dispatcher_Unit">
            <el-form-item label="智能助理">
                <el-select v-model="Dispatcher_Unit.agent_unit_id" placeholder="请选择智能助理">
                    <el-option v-for="agent in AgentUnits" :key="agent.id" :label="agent.name" :value="agent.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="下一步设置">
                <el-input v-model="Dispatcher_Unit.next_action" />
            </el-form-item>
            <el-form-item label="是否自动下一步">
                <el-switch v-model="Dispatcher_Unit.auto_next" />
            </el-form-item>

        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancelClick_dialog_dispatchUnit">取消</el-button>
                <el-button type="primary" @click="confirmClick_dialog_dispatchUnit">
                    提交
                </el-button>
            </span>
        </template>
    </el-dialog>
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
