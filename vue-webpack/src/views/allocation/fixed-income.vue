<template>
  <div class="all-page-flex">
   <!-- <div style="width: 100%;">
      <el-date-picker v-model="father_start_date" @change="father_date_Chage" type="date" value-format="YYYY-MM-DD"
        style="max-width: 240px" placeholder="请选择开始日期" />
      <el-date-picker v-model="father_end_date" @change="father_date_Chage" type="date" value-format="YYYY-MM-DD"
        style="max-width: 240px" placeholder="请选择结束日期" />
    </div> -->
  <Scatterchart />
  </div>
</template>
<script setup>
import { reactive, ref,provide } from 'vue'
import Scatterchart from './components/Scatterchart.vue'
import {getTodayTime} from '@/utils/util'
import {api} from '@/utils/api'

//父组件时间
const father_start_date = ref('2023-09-02')
const father_end_date = ref('')
father_end_date.value = getTodayTime()
const father_date = ref({
  father_start_date: father_start_date.value,
  father_end_date: father_end_date.value

})
provide('father_date', father_date);
const father_date_Chage = (val) => {
  father_date.value.father_start_date = father_start_date.value
  father_date.value.father_end_date = father_end_date.value
}










</script>

<style scoped></style>
