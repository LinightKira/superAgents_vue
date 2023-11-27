<template>
    <el-row class="page_box">
        <el-col :span="24" class="head_box">
            <el-button type="primary" @click="handleAddWorkflow">
                新增项目
            </el-button>
        </el-col>
        <div class="lists_box">
            <el-col v-for="v in AgentsData" :key="v.id" :span="3" :offset=1>
                <el-card :body-style="{ padding: '0px' }" shadow="hover">
                    <template v-if="v.avatar">
                        <el-image :src="v.avatar" class="image" fit="cover"></el-image>
                    </template>
                    <template v-else>
                        <template v-if="v.description">
                            <div class="description-text">{{ v.description }}</div>
                        </template>
                        <template v-else>
                            <el-empty description="既没介绍也没图~" />
                        </template>
                    </template>
                    <div style="padding: 14px">
                        <el-text truncated>{{ v.name }}</el-text>
                        <div class="bottom">
                            <el-button type="success" class="button"
                                @click="() => v.id !== undefined && handlerRunAgent(v.id)">运行</el-button>
                            <el-button type="primary" class="button"
                                @click="() => v.id !== undefined && goToAgentDetails(v.id)">查看</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </div>
    </el-row>

    <el-drawer v-model="run_task_drawer">
        <template #header>
            <h4>运行：{{ run_Agent?.name }}</h4>
        </template>
        <template #default>
            <h4>说明</h4>
            <div>{{ run_Agent?.description }}</div>
            <h4>输入：</h4>
            <el-input v-model="input_data" show-word-limit type="textarea" maxlength="500" minlength="2"
                :autosize="{ minRows: 10 }" placeholder="请输入..." />


        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="() => { run_task_drawer = false }">取消</el-button>
                <el-button type="primary" @click="handlerRun">运行</el-button>
            </div>
        </template>
    </el-drawer>
</template>
  
<script lang="ts" setup>
import axios from '../http/http'
import { onMounted, ref } from 'vue'
import { IResData } from '../models/common'
import { IAgent } from '../models/agent'
import { useRouter } from 'vue-router'

const router = useRouter()

const AgentsData = ref<IAgent[]>([])

interface IDatas {
    agents: IAgent[]
    page: number
    total: number
}

const run_task_drawer = ref(false)  //运行一个项目的面板显示标志位
const input_data = ref('')
const run_Agent = ref<IAgent>()

onMounted(async () => {
    let { data } = await axios.request<{ data: IResData }>('get', '/agents')
    const datas: IDatas = data.datas
    AgentsData.value = datas.agents
})

function goToAgentDetails(agentid: number) {

    router.push({
        name: "agentdetail",
        params: {
            id: agentid
        }
    });
}
function handleAddWorkflow() {
    router.push({
        name: "agentdetail"
    });
}

function handlerRunAgent(agentid: number) {
    run_Agent.value = AgentsData.value.find(agent => agent.id === agentid)

    run_task_drawer.value = true
}

function handlerRun() {

}


</script>
  
<style>
.page_box {
    position: relative;
    padding-top: 50px;
    height: 100vh;
    box-sizing: 100%;
    overflow: hidden;
}

.head_box {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    display: flex;
    justify-content: end;
    background-color: #fff;
    z-index: 100;
}

.lists_box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    height: calc(100vh - 50px);
    overflow: hidden;
    overflow-y: auto;
    margin-left: -4.1666666667%;
    padding-left: 2%;
    box-sizing: border-box;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.button {
    padding: 0;
    min-height: auto;
    width: 35%;
}

.image {
    width: 100%;
    display: block;
    height: 300px;
}

.description-text {
    width: 100%;
    display: block;
    height: 300px;
    padding: 20px;
    /* 可以添加内边距，使得文本内容与容器边缘有一定间距 */
    box-sizing: border-box;
    /* 让内边距不会撑大元素的尺寸 */
    font-size: 16px;
    /* 调整字体大小 */
    line-height: 1.6;
    /* 调整行高，使得文本更加通透 */
    color: #333;
    /* 调整字体颜色 */
    overflow: hidden;
    /* 如果文本内容过多，可以隐藏超出容器的部分 */
    text-overflow: ellipsis;
    /* 如果文本内容过多，显示省略号 */
    white-space: normal;
    /* 自动换行 */
}
</style>