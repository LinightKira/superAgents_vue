<!-- AgentUnitDrawer.vue -->

<template>
    <el-drawer :destroy-on-close="true" :model-value="props.visible" :title="props.title" :size="size"
    :before-close="handleClose">
        <template #default>

            <el-row justify="space-around">
                <el-col :span="showRunSection ? 11 : 24">
                    <!-- AgentUnit部分 -->
                    <div v-if="agentUnit">
                        <h4>名称</h4>
                        <el-input v-model="agentUnit.name" maxlength="20" show-word-limit placeholder="请输入助理的名称" />
                        <h4>提示词</h4>
                        <el-input v-model="agentUnit.prompt" show-word-limit type="textarea" maxlength="3000" minlength="2"
                            :autosize="{ minRows: 10 }" placeholder="请输入提示词" />


                        <h4>分类</h4>
                        <el-input v-model="agentUnit.category" show-word-limit maxlength="10" placeholder="请输入分类名称" />
                        <h4>配置</h4>
                        <el-input v-model="agentUnit.llm_config" placeholder="LLM Config" />
                    </div>
                </el-col>
                <el-col :span="11" v-if="showRunSection">
                    <!-- 运行部分 -->
                    <div>
                        <h4>输入：</h4>
                        <el-input v-model="input_data" show-word-limit type="textarea" maxlength="3000" minlength="2"
                            :autosize="{ minRows: 10 }" placeholder="请输入..." />
                        <el-button type="primary" style="margin-top: 10px; float: right;" @click="handleRun" :loading="isRunning">{{ isRunning ? '运行中...' : '运行' }}</el-button>

                        <h4>结果：</h4>
                        <p v-html="output_data" class="output_data"></p>
                    </div>
                </el-col>
            </el-row>

        </template>
        <template #footer>
            <div style="flex: auto">

                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleSubmit">提交</el-button>
                <el-button @click="handleTestModel">测试</el-button>
            </div>
        </template>
    </el-drawer>
</template>
  
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { IAgentUnit } from '../../models/agent'
import axios from '../../http/http'
import { IResData } from '../../models/common';
import { ElMessageBox } from 'element-plus'

const props = defineProps(['visible', 'agentUnitID', 'title']);
const agentUnit = ref<IAgentUnit>();
const emit = defineEmits();
const size = ref('30%')
const input_data = ref('')
const output_data = ref('暂无结果')
const showRunSection = ref(false)
const isRunning = ref(false)

onMounted(async () => {
    console.log('auid:', props.agentUnitID)
    if (props.agentUnitID) {
        let url = '/agent_unit/' + props.agentUnitID;
        try {
            let { data } = await axios.request<{ data: IResData }>('get', url);

            agentUnit.value = data.datas as IAgentUnit;
            console.log("au:", agentUnit.value)
        } catch (error) {
            console.error('Error fetching agentUnit:', error);
        }
    } else {
        // No agentUnitID, create an empty AgentUnit
        agentUnit.value = {
            id: 0,  // or whatever default ID you want to assign
            name: '',
            prompt: '',
            tools: '',
            category: '',
            llm_config: ''
        }
    }
})




async function handleSubmit() {
    let url = '/agent_unit';
    if (props.agentUnitID) {
        try {
            let { data } = await axios.request<{ data: IResData }>('put', url, agentUnit.value);
            if (data.code === 200) {
                console.log(data.msg)
                emit('success'); // Emit success event
            } else {
                emit('error', data.msg); // Emit error event with the error message
            }
            console.log(data.code, data.msg)
            console.log("AgentUnit modified:", agentUnit.value);
        } catch (error) {
            console.error('Error modifying agentUnit:', error);
        }

    } else {
        // New AgentUnit, invoke add function
        try {
            let { data } = await axios.request<{ data: IResData }>('post', url, agentUnit.value);
            console.log(data.code, data.msg)
            console.log("New AgentUnit added:", agentUnit.value);
            if (data.code === 200) {
                console.log(data.msg)
                emit('success'); // Emit success event
            } else {
                emit('error', data.msg); // Emit error event with the error message
            }
        } catch (error) {
            console.error('Error adding new agentUnit:', error);
        }
    }
    handleClose();
}


const handleClose = async () => {
  if (isRunning.value) {
    try {
      await ElMessageBox.confirm('Are you sure you want to close this?');
      // User confirmed, you can now close
      // Execute your emit or other actions here
      emit('close');
    } catch (error) {
      // User canceled the close action or an error occurred
      // You can handle this case accordingly
    }
  } else {
    // No running action, simply close
    // Execute your emit or other actions here
    emit('close');
  }
};



function handleTestModel() {
    showRunSection.value = !showRunSection.value
    size.value = showRunSection.value ? '60%' : '30%';
}

async function handleRun() {
    isRunning.value = true;

    let inData = {
            agentUnit: { ...agentUnit.value },
            input_data: input_data.value,
    }

    console.log(inData)

    try {
        let { data } = await axios.request<{ data: IResData }>('post', '/agent_unit/run', inData);
        console.log(data.code, data.msg)
        if (data.code === 200) {
            console.log(data.msg)
            console.log('Result:', data.datas.res);
            output_data.value=data.datas.res
            console.log('Tokens:', data.datas.tokens);

        } else {
            alert(data.code + ':' + data.msg);
        }
    } catch (error) {
        console.error('Error adding new agentUnit:', error);
    }
    isRunning.value = false;
};


</script>



<style scoped>
.output_data {
    white-space: pre-line;
}


</style>
