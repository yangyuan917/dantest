<template>
  <Barchart :mySeries="series" :xData="barXdata" @timeChange="timeChange"></Barchart>
  <Linechart :mySeries="lineSeries" @allParamChange="linetimeChange"></Linechart>
  <Linechart
    :mySeries="lineSeriestow"
    @allParamChange="linetimeChangetow"
    :showTarget="true"
  ></Linechart>
</template>
<script setup>
import { reactive, ref } from 'vue'
import Barchart from './components/Barchart'
import Linechart from './components/Linechart'
import api from '@/utils/api'

//柱状图
const series = ref([])
const barXdata = ref([])
const getXdata = async () => {
  let res = await api.get('/catergory_list') //这边写获取x轴坐标的数据
  barXdata.value = res.data.data // x 轴的数据
}

getXdata()

const resultFmoadata = ref([]) //处理过后的数据

const timeChange = (val) => {
  console.log('val :>> ', val)
  getBarchartData(val.start_date, val.end_date)
}
const getBarchartData = async (start_date, end_date) => {
  let data1 = []
  let data2 = []
  resultFmoadata.value.map((item) => {
    if (start_date) {
      if (item.name == start_date) {
        data1 = item.data
      }
    }
    if (end_date) {
      if (item.name == end_date) {
        data2 = item.data
      }
    }
  })
  if (!start_date) {
    series.value[0] = {}
  }
  if (!end_date) {
    series.value[1] = {}
  }
  series.value = [
    {
      name: start_date,

      type: 'bar',

      data: data1 // 蓝色柱状图的数据
    },
    {
      name: end_date,
      type: 'bar',
      data: data2 // 蓝色柱状图的数据
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
const linetimeChange = (val) => {
  console.log('父组件val :>> ', val)
  let selectedOptions = val.selectedOptions
  let arr = []
  selectedOptions.map((item, index) => {
    let randomInt = Math.floor(Math.random() * 10) + index
    let obj = {
      name: '',
      type: 'line',
      data: [
        ['2020-01-01', randomInt - 1],
        ['2020-01-02', randomInt - 1],
        ['2021-01-03', randomInt + 5]
      ] //
    }
    obj.name = item
    arr.push(obj)
  })
  lineSeries.value = arr
}

// [
//  {
//   name: '',
//     type: 'line',
//     data: [['2020-01-01',randomInt-1],['2020-01-02',randomInt-1],['2021-01-03',randomInt+5], ] //
// }
// ]

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
const linetimeChangetow = (val) => {
  console.log('父组件val :>> ', val)
  let selectedOptions = val.selectedOptions
  let arr = []
  selectedOptions.map((item, index) => {
    let randomInt = Math.floor(Math.random() * 10) + index
    let obj = {
      name: '',
      type: 'line',
      data: [
        ['2020-01-01', randomInt - 1],
        ['2020-01-02', randomInt - 1],
        ['2021-01-03', randomInt + 5]
      ] //
    }
    obj.name = item
    arr.push(obj)
  })
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
getAssetConcentrate()

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

// let arrlist = {
//   time: {
//     0: 'Fri, 08 Sep 2023 00:00:00 GMT',
//     1: 'Fri, 08 Sep 2023 00:00:00 GMT',
//     2: 'Mon, 11 Sep 2023 00:00:00 GMT',
//     3: 'Mon, 11 Sep 2023 00:00:00 GMT',
//     4: 'Mon, 11 Sep 2023 00:00:00 GMT',
//     5: 'Fri, 08 Sep 2023 00:00:00 GMT',
//     6: 'Fri, 08 Sep 2023 00:00:00 GMT',
//     7: 'Mon, 11 Sep 2023 00:00:00 GMT',
//     8: 'Mon, 11 Sep 2023 00:00:00 GMT',
//     9: 'Mon, 11 Sep 2023 00:00:00 GMT'
//   },
//   shizhi: {
//     0: 18316497.49,
//     1: 1981794376.46,
//     2: 9948.63,
//     3: 6339483.62,
//     4: 18316497.49,
//     5: 1981794376.46,
//     6: 9948.63,
//     7: 6339483.62,
//     8: 18316497.49,
//     9: 1981794376.46
//   },

//   leibie: {
//     0: '城投债券',
//     1: '同业存单',
//     2: '金融债',
//     3: '利率债',
//     4: '非标',
//     5: '城投债券',
//     6: '同业存单',
//     7: '金融债',
//     8: '利率债',
//     9: '非标'
//   }
// }

// let obj = {
//   城投债券: [['2020-08-01', 18316497.49]],
//   同业存单: [['2020-08-01', 18316497.49]]
//   //
// }

// let arr1 = [
//   {
//     name: '2023-09-08',
//     data: [18316497.49, 1981794376.46] //
//   },
//   {
//     name: '2023-09-08',
//     data: [9948.63, 6339483.62] //
//   }
// ]
</script>

<style scoped></style>
