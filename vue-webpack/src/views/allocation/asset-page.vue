<template>
  <BarandLinechart :mySeries="lineSeries" @allParamChange="allChange" :showTarget="true"></BarandLinechart>
  <BarandLinechart :mySeries="lineSeriesTow" @allParamChange="allChangeTow" :showTarget="true"></BarandLinechart>
</template>
<script setup>
import { reactive, ref } from 'vue'
import Linechart from './components/Linechart'
import BarandLinechart from './components/BarandLinechart.vue'
import api from '@/utils/api';


let lineSeries = ref([
  {
    name: '柱状图',
    type: 'bar',
   data: [
      ['2020-01-01', 20],
      ['2020-01-02', 30],
      ['2020-01-03', -20]
    ], //
    yAxisIndex: 0 // 使用第一个 y 轴坐标
  },
  {
    name: '折线图',
    type: 'line',
            lineStyle: {
              color: 'transparent', // 设置折线的颜色为透明
            },
    data: [
      ['2020-01-01', 10],
      ['2020-01-02', 40],
      ['2020-01-03', 80]
    ], //
    yAxisIndex: 1 // 使用第二个 y 轴坐标
  }
])

const allChange = (val)=>{//参数改变
lineSeries.value[1].data =  [
      ['2020-01-01', 100],
      ['2020-01-02', 50],
      ['2020-01-03', 70]
    ],
console.log('lineSeries.value :>> ', lineSeries.value);

console.log('11 :>> ', 11);

}


const lineSeriesTow = ref([
  {
    name: '柱状图',
    type: 'bar',
   data: [
      ['2020-01-01', 20],
      ['2020-01-02', 30],
      ['2020-01-03', -20]
    ], //
    yAxisIndex: 0 // 使用第一个 y 轴坐标
  },
  {
    name: '折线图',
    type: 'line',
    data: [
      ['2020-01-01', 10],
      ['2020-01-02', 40],
      ['2020-01-03', 80]
    ], //
    yAxisIndex: 1 // 使用第二个 y 轴坐标
  }
])




</script>

<style scoped></style>
