<script setup lang="ts">
import Dispatcher from '../agentDispatcher/agentDispatcher.vue'  //调度组件

const { dispatchers } = defineProps(['dispatchers']);

const emit = defineEmits();

function addDispatcher() {
      // Implement your logic to add a new dispatcher

      emit('openDrawer')
}

</script>

<template>
    <div class="bigbox">
        <el-button class="add-button" icon="el-icon-plus" @click="addDispatcher">新增节点</el-button>
        <div class="disList">
            <Dispatcher v-for="dispatcher in dispatchers" :key="dispatcher.id" :dispatcher="dispatcher" />
        </div>

    </div>
</template>

<style scoped>
.bigbox {
    width: 95%;
    margin-top: 10px;
    min-height: 70vh;
    border: 1px solid #ccc;
    /* 添加边框 */
    border-radius: 8px;
    /* 圆角边框 */
    padding: 35px 10px 10px 10px;
    /* 可以根据需要调整内边距 */ 
    position: relative;
}

.disList{
    display:flex;
    flex-wrap: wrap;
}

.add-button {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

</style>
