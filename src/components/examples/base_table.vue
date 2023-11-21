<template>
    <el-table
      :data="tableData"
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
</template>
  
  <script lang="ts" setup>
  import axios from '../../http/http'
  import {onMounted, ref} from 'vue'
  
  interface Data{
    code:number
    msg:string
    datas?:any
  }
  interface User {
    date: string
    name: string
    address: string
  }



  const tableData = ref<User[]>([])
  onMounted(async()=>{
    console.log("哈哈哈")
    let {data} = await axios.request<{data:Data}>('get','/data/query')
    tableData.value=data.datas
  })
  
  const tableRowClassName = ({
    row,
    rowIndex,
  }: {
    row: User
    rowIndex: number
  }) => {
    if (rowIndex === 1) {
      return 'warning-row'
    } else if (rowIndex === 3) {
      return 'success-row'
    }
    return ''
  }
  
  </script>
  
  <style>
  .el-table .warning-row {
    --el-table-tr-bg-color: var(--el-color-warning-light-9);
  }
  .el-table .success-row {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
  }
  </style>