<template>
    <el-row class="page_box">
        <el-col :span="24" class="head_box">
            <el-button type="primary"  @click="handleAddWorkflow">
                新增工作流
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
                            <el-button type="success" class="button">运行</el-button>
                            <el-button type="primary" class="button" @click="() => v.id !== undefined && goToAgentDetails(v.id)">查看</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </div>
        
    </el-row>
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
 function handleAddWorkflow(){
    router.push({
        name: "agentdetail"
    });
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
    left:0;
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
    box-sizing:border-box;
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
}</style>