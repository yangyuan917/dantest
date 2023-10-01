<template>
<div style="width: 100%;">
  <el-input v-model="separate_name" style="width: 200px;" placeholder="输入separate_name" ></el-input>

</div>
<!-- 第一排 -->
  <Barchart :mySeries="series" :xData="barXdata" @timeChange="timeChange"></Barchart>
  <Linechart :mySeries="lineSeries" @allParamChange="linetimeChange"></Linechart>
  <Linechart :mySeries="lineSeriestow" @allParamChange="linetimeChangetow" :showTarget="true"></Linechart>
<!-- 第二排 -->

  <Barchart :mySeries="series" :xData="barXdata" @timeChange="timeChange"></Barchart>
  <Barchart :mySeries="series" :xData="barXdata" @timeChange="timeChange"></Barchart>
  <Linechart :mySeries="lineSeries" @allParamChange="linetimeChange"></Linechart>
<!-- 第三排 -->

   <Barchart :mySeries="series" :xData="barXdata" @timeChange="timeChange"></Barchart>
  <Linechart :mySeries="lineSeries" @allParamChange="linetimeChange"></Linechart>
</template>
<script setup>
import { reactive, ref } from 'vue'
import Barchart from './components/Barchart'
import Linechart from './components/Linechart'
import api from '@/utils/api'
const separate_name = ref('中信证券增盈1号集合资产管理计划')
//柱状图
const series = ref([])
const barXdata = ref([])
// const getXdata = async () => {
//   let res = await api.get('/catergory_list') //这边写获取x轴坐标的数据
//   barXdata.value = res.data.data // x 轴的数据
// }

// getXdata()

const resultFmoadata = ref([]) //处理过后的数据

const timeChange = (val) => {
  console.log('val :>> ', val)
  getBarchartData(val.start_date, val.end_date)
}
const getBarchartData = async (start_date, end_date) => {//柱状图
  let params = {
    start_date,
    end_date,
    separate_name: separate_name.value
  }
  let res = await api.get('/asset_concentrate_separate', { params })

if (!res.data.data) {
series.value = {}
  return
}
  console.log('res111111 :>> ', res);
  //  `${dateString}T00:00:00.000000000`;
  let start_date_data1 = res.data.data[`${start_date}T00:00:00.000000000`]
  let end_date_data1 = res.data.data[`${end_date}T00:00:00.000000000`]
   let valuesArray1 = []
   let valuesArray2 = []
if (start_date_data1) {
  barXdata.value = Object.keys(start_date_data1) ;//轴的值
   valuesArray1 = Object.values(start_date_data1);


}
if (end_date_data1) {
  barXdata.value = Object.keys(end_date_data1) ;//轴的值

   valuesArray2 = Object.values(end_date_data1);

}
  series.value = [
    {
      name: start_date,

      type: 'bar',

      data: valuesArray1 // 蓝色柱状图的数据
    },
    {
      name: end_date,
      type: 'bar',
      data: valuesArray2 // 蓝色柱状图的数据
    }
  ]

  // let res = await api.get('/operation')
}

//折线图1
const lineSeries = ref([
  {
    name: '线段1',
    type: 'line',
    data: [
      ['2020-01-01', 20],
      ['2020-01-02', 40],
      ['2021-01-03', 50]
    ] //
  }
])
const linetimeChange =async (val) => {
  console.log('父组件val :>> ', val)
  let selectedOptions = val.selectedOptions[0]

  let arr = []
  let target = ''
arr = await getLineData(val,target)
console.log('arr111 :>> ', arr);
  // selectedOptions.map((item, index) => {
  //   let randomInt = Math.floor(Math.random() * 10) + index
  //   let obj = {
  //     name: '',
  //     type: 'line',
  //     data: [
  //       ['2020-01-01', randomInt - 1],
  //       ['2020-01-02', randomInt - 1],
  //       ['2021-01-03', randomInt + 5]
  //     ] //
  //   }
  //   obj.name = item
  //   arr.push(obj)
  // })
  lineSeries.value = arr
}

const  getLineData = async(val,target)=>{
let catergory = val.selectedOptions[0]
let params = {
  separate_name: separate_name.value,
  catergory:catergory
  // separate_name:separate_name.value,
}
if (target) {
params.target = target
}

let res = await api.get('/asset_concentrate_timeseries_separate',{params})
let data = res.data.data

const transformedObj = {
  name: catergory,
  type: 'line',
  data:Object.entries(data[catergory]).map(([date, value]) => [date, value])
};
let arr = []
arr.push(transformedObj)
return arr

}
//折线图2
const lineSeriestow = ref([
  {
    name: '线段1',
    type: 'line',
    data: [
      ['2020-01-01', 20],
      ['2020-01-02', 40],
      ['2021-01-03', 50]
    ] //
  }
])

const linetimeChangetow =async (val) => {//这是有指标的
  console.log('父组件val111 :>> ', val)
  let selectedOptions = val.selectedOptions
  let target = val.target
  let arr = []
  arr =    await  getLineData(val,target)

  lineSeriestow.value = arr
}
const getCatergoryList = async () => {
  let res = await api.get('/catergory_list')
  console.log('类别res :>> ', res)
}
getCatergoryList()


const getAssetConcentrate = async () => {//这是获取总数据的地方
  let res = await api.get('/asset_concentrate')
  let data = res.data.data

  let result = transformData(data)
  resultFmoadata.value = result
  console.log('总res :>> ', res)
}
// getAssetConcentrate()

//参数处理方法
function transformData(arrlist) {
  let keys1 = '业务日期'
  let keys2 = '市值(元)'
  const timeKeys = Object.keys(arrlist[keys1])
  const shizhiKeys = Object.keys(arrlist[keys2])
  const result = []
  for (let i = 0; i < timeKeys.length; i++) {
    const timeKey = timeKeys[i]
    const shizhiKey = shizhiKeys[i]
    const timeValue = arrlist[keys1][timeKey]
    const shizhiValue = arrlist[keys2][shizhiKey]
    // const date = new Date(timeValue).toLocaleDateString('zh-CN', {
    //   year: 'numeric',
    //   month: 'long',
    //   day: 'numeric'
    // });

    const date1 = new Date(timeValue)

    // 获取日期的格式为 'YYYY-MM-DD'
    const date = date1.toISOString().split('T')[0]

    const existingData = result.find((item) => item.name === date)
    if (existingData) {
      existingData.data.push(shizhiValue)
    } else {
      result.push({
        name: date,
        data: [shizhiValue]
      })
    }
  }
  return result
}

</script>

<style scoped></style>
