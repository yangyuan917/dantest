<template>
  <div class="menu-view">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('市场监测')
</script>
