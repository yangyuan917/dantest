<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view v-slot="{ Component }">
        <keep-alive >
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </transition>
  </section>
</template>

<script >
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'AppMain',
  excludearr: ['table-details'],
})
</script>

<style scoped>
.app-main {
  position: relative;

  /* 84 = navbar + tags-view = 50 +34 */
  height: calc(100vh - 84px);
  padding: 20px;
  overflow-x: hidden;
}
</style>
