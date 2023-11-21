
<template>
    <div class="common-layout">
        <el-container>
            <NavMenu />
            <el-container>
                <Main />
            </el-container>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import NavMenu from '../components/layout/navMenu.vue';
import Main from '../components/layout/main.vue';
</script>


<style scoped></style>
