<template>
  <div class="all-page-flex">
    <div style="width: 100%;">
      <el-date-picker v-model="father_start_date" @change="father_date_Chage" type="date" value-format="YYYY-MM-DD"
        style="max-width: 240px" placeholder="请选择开始日期" />
      <el-date-picker v-model="father_end_date" @change="father_date_Chage" type="date" value-format="YYYY-MM-DD"
        style="max-width: 240px" placeholder="请选择结束日期" />
    </div>
    <!-- 第一排 -->
    <Barchart title="自定义标题" :mySeries="Series_pricechg" :xData="Xdata" @timeChange="linetimeChange"></Barchart>
    
  </div>
</template>
<script setup>
import { reactive, ref, provide } from 'vue'
import Barchart from './components/Barchart'
import BarchartLast from './components/BarchartLast'
import Linechart from './components/Linechart'
import Linechart2 from './components/Linechart2'
import { api } from '@/utils/api'
import { getTodayTime } from '@/utils/util'
import useDate from '@/hooks/useDate'

//父组件时间
const {
  father_start_date,
    father_end_date,
    father_date,
    father_date_Chage
} = useDate()//父组件时间hooks
provide('father_date',father_date)


//置顶第1行第1个图
const Series_pricechg = ref([])
const Xdata = ref([])

const linetimeChange = (val) => {
  console.log('val1', val)
  if (!val) {
    return
  }
  getbarSeries(val)
}
const getbarSeries = async (val) => {
  let params = {
    cat: '股票',
    start_date: '2023-11-3',
    end_date: '2023-11-9',
  }
  let res = await api.get('/mp/asset_price', {params});
  console.log('res', res);
  let resdata = res.data.data;
  console.log('resdata', resdata);
  const xData = Object.values(resdata['bin']);
  const seriesData = Object.values(resdata['市值占比']);
  Xdata.value = xData;
  Series_pricechg.value = [
      {
        name: '市值占比',
        type: 'bar',
        legend: '市值占比',
        // symbol : '',//曲线无点
        // smooth: true,
        data: seriesData
      }]
}


</script>

<style scoped></style>