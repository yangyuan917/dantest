<template>
  <div class="menu-view">
    <h1>{{ title }}</h1>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('菜单')
</script>
