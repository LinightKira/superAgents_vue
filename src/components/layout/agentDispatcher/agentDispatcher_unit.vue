<script setup lang="ts">
const { dispatcher_unit } = defineProps(['dispatcher_unit']);
</script>

<template>
{{ dispatcher_unit.agent_unit.prompt }}
</template>

<style scoped>

</style>
