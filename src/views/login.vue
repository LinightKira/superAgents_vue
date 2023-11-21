<template>
    <div>
      <input v-model="tokenInput" type="text" placeholder="Enter your token" />
      <button @click="saveToken">Save Token</button>
      <div v-if="storedToken">Stored Token: {{ storedToken }}</div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref , onMounted } from 'vue';
  
  const tokenInput = ref('');
  const storedToken = ref('');

  onMounted(() => {
  // 在组件挂载后，读取本地存储的 token
  storedToken.value = localStorage.getItem('token') || '';
});
  
  const saveToken = () => {
    // store.dispatch('setToken', tokenInput.value);
    // 在这里，您还可以将 token 存储在其他地方，比如 localStorage
    localStorage.setItem('token', tokenInput.value);
  };
  </script>