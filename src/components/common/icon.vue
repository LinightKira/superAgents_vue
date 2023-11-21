<template>
      <component :is="icon"></component>
</template>

<script setup lang="ts">
import {defineProps} from 'vue'

//泛型 在使用的时候再指定类型
const {icon} = defineProps<{
    icon:any
}>()
</script>