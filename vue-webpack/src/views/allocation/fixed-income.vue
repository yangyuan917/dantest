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
import useDate from '@/hooks/useDate'

const {
  father_start_date,
    father_end_date,
    father_date,
    father_date_Chage
} = useDate()//父组件时间hooks
provide('father_date',father_date)










</script>

<style scoped></style>
