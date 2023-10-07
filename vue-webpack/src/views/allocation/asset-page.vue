<template>
  <BarandLinechart :mySeries="lineSeries" @allParamChange="allChange" :showTarget="true"></BarandLinechart>
  <Barchart2 :mySeries="series" @allParamChange="timeChange"></Barchart2>
</template>
<script setup>
import { reactive, ref } from 'vue'
import Linechart from './components/Linechart'
import BarandLinechart from './components/BarandLinechart.vue'
import Barchart2 from './components/Barchart2.vue'
import api from '@/utils/api';


let lineSeries = ref([
  {
    name: '柱状图',
    type: 'bar',
   data: [
      ['2023-09-01', 20],
      ['2023-09-02', 30],
      ['2023-09-03', -20]
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
      ['2023-09-01', 10],
      ['2023-09-02', 40],
      ['2023-09-04', 80],
      ['2023-09-05', 80],
      ['2023-09-06', 80]
    ], //
    yAxisIndex: 1 // 使用第二个 y 轴坐标
  }
])
console.log('lineSeries.value :>> ', lineSeries.value)
console.log('lineSeries :>> ', lineSeries)
const allChange = async (val)=>{//参数改变
      console.log('父组件val111 :>> ', val)
      let arr = []
      let target = ''
      arr = await  getLineData2(val,target)
      lineSeries.value = arr
      console.log('lineSeries.value :>> ', lineSeries.value)
    }

    const  getLineData2 = async(val,target)=>{
    let catergory = val.selectedOptions[0]
    let indicator = val.target
    console.log('catergory :>> ', catergory)
    let params = {
      // separate_name: separate_name.value,
      catergory: catergory,
      indicator: indicator
      // separate_name:separate_name.value,
    }
    if (target) {
    params.target = target
    }
    let res = await api.get('/transaction_bondfund',{params})
    console.log('/transaction_bondfund    res :>> ', res)
    let rawData = res.data.data;
    console.log('rawData :>> ', rawData);
    console.log('Object.keys(rawData) :>> ', Object.keys(rawData));

    const arr = Object.keys(rawData).map((indicator) => {
      console.log('indicator :>> ', indicator);
      console.log('entries(rawData[indicator]) :>> ', Object.entries(rawData[indicator]));
  return {
    name: indicator,
    type: indicator == '市值(元)' ? 'bar' : 'line',
    data: Object.entries(rawData[indicator]).map(([date, value]) => [date, value])
  };

});
return arr
}


    // const transformedObj = {
    //   name: catergory,
    //   type: 'line',
    //   data:Object.entries(data[catergory]).map(([date, value]) => [date, value])
    // };
    // let arr = []
    // arr.push(transformedObj)

    // return arr


const series = ref([
  {
    name: '柱状图',
    type: 'bar',
   data: [
      ['2023-09-01', 20],
      ['2023-09-02', 30],
      ['2023-09-03', -20]
    ], //
  },
  {
    name: '柱状图',
    type: 'bar',
    data: [
      ['2023-09-01', 10],
      ['2023-09-02', 40],
      ['2023-09-03', 80]
    ], //
  }
])

// const barXdata = ref([])
// const resultFmoadata = ref([]) //处理过后的数据

// const timeChange = (val) => {
//   console.log('val :>> ', val)
//   getBarchartData(val.start_date, val.end_date)
// }
// const getBarchartData = async (start_date, end_date) => {//柱状图
//   let params = {
//     start_date,
//     end_date,
//     separate_name: separate_name.value
//   }

// let res = await api.get('/transaction_stock', { params })
// let start_date_data1 = res.data.data[`${start_date}`]
//   let end_date_data1 = res.data.data[`${end_date}`]
//    let valuesArray1 = []
//    let valuesArray2 = []
//    console.log('start_date_data1 :>> ', start_date_data1); 
// if (start_date_data1) {
//   barXdata.value = Object.keys(start_date_data1) ;//轴的值
//    valuesArray1 = Object.values(start_date_data1);
// }
// if (end_date_data1) {
//   barXdata.value = Object.keys(end_date_data1) ;//轴的值

//    valuesArray2 = Object.values(end_date_data1);

// }
//   series.value = [
//     {
//       name: start_date,

//       type: 'bar',

//       data: valuesArray1 // 蓝色柱状图的数据
//     },
//     {
//       name: end_date,
//       type: 'bar',
//       data: valuesArray2 // 蓝色柱状图的数据
//     }
//   ]

</script>

<style scoped></style>
