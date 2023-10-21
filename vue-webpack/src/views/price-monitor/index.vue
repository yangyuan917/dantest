<template>
  <div class="menu-view">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('价格监测')
</script>
