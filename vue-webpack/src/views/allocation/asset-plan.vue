<template>
  <Barchart :mySeries="series" @timeChange="timeChange"></Barchart>
  <Barchart :mySeries="seriestow" @timeChange="timeChangeTow"></Barchart>
  <Linechart :mySeries="lineSeries" @allParamChange="linetimeChange"></Linechart>

</template>
<script setup>
import { reactive, ref } from 'vue'
import Barchart from './components/Barchart'
import Linechart from './components/Linechart'
import api from '@/utils/api';


//柱状图
const series = ref([
  {
    name: '2023-09-23',
    type: 'bar',
    data: [80, 150, 100, 130, 160] //
  }
])

const timeChange = (val) => {
  series.value = [
    {
      name: val.start_date,
      type: 'bar',

      data: [10, 150, 100, 130, 160] //
    },
    {
      name: val.end_date,
      type: 'bar',
      data: [20, 150, 100, 130, 160] //
    }
  ]
}
//柱状图2
const seriestow = ref([
  {
    name: '2023-09-23',
    type: 'bar',
    data: [80, 150, 100, 130, 160] //
  }
])

const timeChangeTow = (val) => {
  seriestow.value = [
    {
      name: val.start_date,
      type: 'bar',

      data: [10, 150, 100, 130, 160] //
    },
    {
      name: val.end_date,
      type: 'bar',
      data: [20, 150, 100, 130, 160] //
    }
  ]
}

//折线图1
const lineSeries = ref([
  {
    name: '线段1',
    type: 'line',
    data: [['2020-01-01',20],['2020-01-02',40],['2021-01-03',50], ] //
  }
])
const linetimeChange = (val)=>{
console.log('父组件val :>> ', val);
let selectedOptions = val.selectedOptions
let arr = []
selectedOptions.map((item,index)=>{
let randomInt = Math.floor(Math.random() * 10)+index ;
let obj = {
  name: '',
    type: 'line',
    data: [['2020-01-01',randomInt-1],['2020-01-02',randomInt-1],['2021-01-03',randomInt+5], ] //
}
  obj.name = item
  arr.push(obj)

})
lineSeries.value = arr
}


</script>

<style scoped></style>
