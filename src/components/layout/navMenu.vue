<script lang="ts" setup>
import {userMenu} from'./userMenu' //动态菜单数据
const menuIteams = userMenu();
import Icons  from '../common/icon.vue'  //图标组件
import { Plus } from '@element-plus/icons-vue'

const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
</script>

<template>
    <el-aside width="200px" class="aside" >
        <el-row>
            <el-col>
                <el-menu active-text-color="#ffd04b" background-color="#545c64" router 
                    default-active="1" text-color="#fff" @open="handleOpen" @close="handleClose">
                    <el-menu-item index='/newtask'  class="createTask-button">
                        <el-icon><Icons :icon="Plus"/></el-icon> <span>新任务</span>
                    </el-menu-item>
                    <el-menu-item :index="v.url" v-for="v in menuIteams" :key="v.url">
                        <el-icon><Icons :icon="v.icon"/></el-icon>
                        <span>{{v.name}}</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
    </el-aside>
</template>

<style scoped>
.aside{
    position: relative;
    height: 100vh;
    background-color:#545c64;
    z-index: 999;
}

.top-line{
    height: var(--el-menu-item-height);
    display: flex;
    align-items: center;
    line-height: var(--el-menu-item-height);
    padding: 0 var(--el-menu-base-level-padding);
}
.createTask-button{
    text-align: center;
    vertical-align: middle; 
    border: 1px solid white;
    height: 35px;
    width: 150px;
    margin: 20px auto 10px;

}
.createTask-button:hover{
    border-color: var(--el-color-primary);
}

</style>
