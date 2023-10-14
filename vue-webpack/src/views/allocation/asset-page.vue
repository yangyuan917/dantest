<template>
  <div class="all-page-flex">
    <BarandLinechart :mySeries="lineSeries" @allParamChange="allChange" :showTarget="true"></BarandLinechart>
    <Barchart2 :mySeries="series" :echartsLegend="echartsLegend" @allParamChange="barChange" :showTarget="true">
    </Barchart2>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import Linechart from './components/Linechart'
import BarandLinechart from './components/BarandLinechart.vue'
import Barchart2 from './components/Barchart2.vue'
import api from '@/utils/api'

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
      color: 'transparent' // 设置折线的颜色为透明
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
const allChange = async (val) => {
  //参数改变
  console.log('父组件val111 :>> ', val)
  let arr = []
  let target = ''
  arr = await getLineData2(val, target)
  lineSeries.value = arr
  console.log('111111111lineSeries.value :>> ', lineSeries.value)
}

const getLineData2 = async (val, target) => {
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
  let res = await api.get('/transaction_bondfund', { params })
  console.log('/transaction_bondfund    res :>> ', res)
  let rawData = res.data.data
  console.log('rawData :>> ', rawData)
  console.log('Object.keys(rawData) :>> ', Object.keys(rawData))

  const arr = Object.keys(rawData).map((indicator) => {
    console.log('indicator :>> ', indicator)
    console.log('entries(rawData[indicator]) :>> ', Object.entries(rawData[indicator]))
    return {
      name: indicator,
      type: indicator == '市值(元)' ? 'bar' : 'line',
      yAxisIndex: indicator == '市值(元)' ? 0 : 1,
      data: Object.entries(rawData[indicator]).map(([date, value]) => [date, value])
    }
  })
  return arr
}

const barChange = async (obj) => {
  //参数改变
  console.log('参数改变obj :>> ', obj)
  let params = {
    sector1: obj.sector1.value,
    sector2: obj.sector2.value
  }
  let res = await api.get('/transaction_stock', { params })
 let testObj = res.data.data

let list = [testObj.list1,testObj.list2]
let Legend1 = testObj.list1 ? Object.keys(testObj.list1) : []
let Legend2 = testObj.list2 ? Object.keys(testObj.list2) : []
echartsLegend.value = [...Legend1,...Legend2]
  let arr1 = resultFmoat(testObj.list1,1)
  let arr2 = resultFmoat(testObj.list2,2)
  series.value = [...arr1,...arr2]
  console.log('res :>> ', res)
  console.log('list :>> ', list)
  console.log('echartsLegend :>> ', echartsLegend)

}

const resultFmoat = (inputObject, type) => {
  const result = []
  for (const key in inputObject) {
    if (inputObject.hasOwnProperty(key)) {
      const item = {
        name: key,
        type: 'bar',
        stack: 'stack1',
        itemStyle: {
          color: '#8f9cc6'
        },
        data: Object.entries(inputObject[key]).map(([date, value]) => [date, value])
      }
      result.push(item)
    }
  }

  if (type == 1) {
    if (result[0]) {
      result[0].stack = 'stack1'
      result[0].itemStyle.color = '#8f9cc6'
    }
    if (result[1]) {
      result[1].stack = 'stack1'
      result[1].itemStyle.color = '#5470c6'
    }
  }

  if (type == 2) {
    if (result[0]) {
      result[0].stack = 'stack2'
      result[0].itemStyle.color = '#b7ccad'
    }
    if (result[1]) {
      result[0].stack = 'stack2'
      result[1].itemStyle.color = '#91CC75'
    }
  }

  // if (result[0]) {
  //   result[0].stack = 'stack1'
  //   result[0].itemStyle.color = '#8f9cc6'
  // }
  // if (result[1]) {
  //   result[1].stack = 'stack1'
  //   result[1].itemStyle.color = '#5470c6'
  // }
  // if (result[2]) {
  //   result[2].stack = 'stack2'
  //   result[2].itemStyle.color = '#b7ccad'
  // }
  // if (result[3]) {
  //   result[3].stack = 'stack2'
  //   result[3].itemStyle.color = '#91CC75'
  // }

  return result
}

const echartsLegend = ref(['图例一', '图例二', '图例三', '图例四']) //这是图例，必须和series中的name一致
const series = ref([
  {
    name: '图例一', //这是名字
    type: 'bar',

    stack: 'stack1',
    itemStyle: {
      color: '#8f9cc6' //这里修改颜色
    },

    data: [
      ['2023-09-01', -10],
      ['2023-09-02', -40],
      ['2023-09-04', -80],
      ['2023-09-05', -80],
      ['2023-09-06', -80]
    ] ////这里修改数据，后台获取到的数据可以放这里
  },
  {
    name: '图例二',
    type: 'bar',

    stack: 'stack1',
    itemStyle: {
      color: ' #5470c6'
    },
    data: [
      ['2023-09-01', 10],
      ['2023-09-02', 40],
      ['2023-09-04', 80],
      ['2023-09-05', 80],
      ['2023-09-06', 80]
    ]
  },
  {
    name: '图例三',
    type: 'bar',

    stack: 'stack2',
    itemStyle: {
      color: ' #b7ccad'
    },
    data: [
      ['2023-09-01', -10],
      ['2023-09-02', -40],
      ['2023-09-04', -80],
      ['2023-09-05', -80],
      ['2023-09-06', -80]
    ]
  },
  {
    name: '图例四',
    type: 'bar',

    stack: 'stack2',
    itemStyle: {
      color: '#91CC75'
    },
    data: [
      ['2023-09-01', 10],
      ['2023-09-02', 40],
      ['2023-09-04', 80],
      ['2023-09-05', 80],
      ['2023-09-06', 80]
    ]
  }
])

// [
//   {
//       name: '总计_减仓',
//       type: 'bar',

//        stack: 'stack1',
//         itemStyle: {
//         color: '#8f9cc6',
//       },

//         data: [
//           [ "2023-09-19", 0.768577],
//         ["2023-09-20", 0.457382],
//         ["2023-09-21", 0.377451],
//         ["2023-09-22", 0.166451]

//     ],
//     },
//         {
//       name: '图例二',
//       type: 'bar',

//        stack: 'stack1',
//         itemStyle: {
//         color: ' #5470c6',
//       },
//       data: [
//       ['2023-09-01', 10],
//       ['2023-09-02', 40],
//       ['2023-09-04', 80],
//       ['2023-09-05', 80],
//       ['2023-09-06', 80]
//     ]
//     },
//             {
//       name: '图例三',
//       type: 'bar',

//        stack: 'stack2',
//         itemStyle: {
//         color: ' #b7ccad',
//       },
//        data: [
//       ['2023-09-01', -10],
//       ['2023-09-02', -40],
//       ['2023-09-04', -80],
//       ['2023-09-05', -80],
//       ['2023-09-06', -80]
//     ]
//     },
//             {
//       name: '图例四',
//       type: 'bar',

//        stack: 'stack2',
//         itemStyle: {
//         color: '#91CC75',
//       },
//       data: [
//       ['2023-09-01', 10],
//       ['2023-09-02', 40],
//       ['2023-09-04', 80],
//       ['2023-09-05', 80],
//       ['2023-09-06', 80]
//     ]
//     },
// ]
</script>

<style scoped></style>
