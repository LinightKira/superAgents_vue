<script setup lang="ts">
import { Edit, Delete } from '@element-plus/icons-vue'
import Dispatcher_unit from  './agentDispatcher_unit.vue'
import { inject } from 'vue';
const { dispatcher } = defineProps(['dispatcher']);

const openDrawer = inject<(id?: number) => void>('openDrawer');

const handleEditClick = () => {

  if (openDrawer) {
    openDrawer(dispatcher.id);
  }
}

function handleDeleteClick(){
  alert('还没开发')
}
</script>

<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>{{ dispatcher.name }}</span>
        <div>
          <el-button :icon="Edit" circle @click="handleEditClick" />
          <el-button :icon="Delete" circle @click="handleDeleteClick" />
        </div>
      </div>
    </template>
   <Dispatcher_unit class="text item" v-for="unit in dispatcher.dispatch_units " :key="unit.id" :dispatcher_unit="unit"/>
  </el-card>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-header-button{
  justify-content: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 300px;
  height: 300px;
  margin-right: 10px;

}
</style>
