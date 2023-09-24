<template>
  <div>
    <div class="tabs">
      <div v-for="(tab, index) in tabs" :key="index" :class="{ 'tab': true, 'active': activeTab === index }"
        @click="changeTable(index)">{{ tab }}</div>
    </div>
    <div class="grid-item" v-if="activeTab == 0">
<AssetAllocation />
    </div>
    <div class="grid-item" v-if="activeTab == 1">
    <AssetPlan />
    </div>
    <div class="grid-item" v-if="activeTab == 2">
<AssetPage />


    </div>
  </div>
</template>

<script  setup>
import {reactive,ref} from "vue"
import AssetAllocation from './asset-allocation.vue'
import AssetPlan from './asset-plan.vue'
import AssetPage from './asset-page.vue'


const   tabs =  ['大类资产配置', '资管计划', '页面三'];
const activeTab = ref(0)

const     changeTable = (index)=> {
      activeTab.value = index;
    }
</script>

<style  scoped>


body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.tabs {
  display: flex;
  background-color: #f4f4f4;
  padding: 10px;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tab:hover {
  background-color: #ddd;
}

.active {
  background-color: #444;
  color: white;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  gap: 20px;
}

.grid-item {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  gap: 20px;
  background-color: #EFF1F6;

}

.item {
  flex: 1;
  min-width: calc(33.33% - 20px);
  background-color: #f4f4f4;

  padding: 20px;
  box-sizing: border-box;
  text-align: center;
}

.select-box {
  display: flex;
  align-items: center;
  position: absolute;
  left: 136px;
  top: 36px;

}

img {
  max-width: 100%;
  height: auto;
}

.switch {
  width: 100px;
  margin: auto;

}

.time-box {
  display: flex;
  align-items: center;
  position: absolute;
  left: 136px;
  top: 36px;

}
</style>
