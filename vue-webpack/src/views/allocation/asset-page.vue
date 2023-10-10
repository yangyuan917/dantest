<template>
  <BarandLinechart :mySeries="lineSeries" @allParamChange="allChange" :showTarget="true"></BarandLinechart>
  <Barchart2 :mySeries="series" :echartsLegend="echartsLegend"  @allParamChange="timeChange" :showTarget="true"></Barchart2>
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
      console.log('111111111lineSeries.value :>> ', lineSeries.value)
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
    yAxisIndex: indicator == '市值(元)' ? 0 : 1,
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

const echartsLegend = ref([
 '图例一', '图例二','图例三', '图例四',
])//这是图例，必须和series中的name一致
const series = ref([
  {
      name: '图例一',//这是名字
      type: 'bar',

       stack: 'stack1',
        itemStyle: {
        color: '#8f9cc6',//这里修改颜色
      },
      data: [-100, -52, -200, -334, -390, -330, -220]//这里修改数据，后台获取到的数据可以放这里
    },
        {
      name: '图例二',
      type: 'bar',

       stack: 'stack1',
        itemStyle: {
        color: ' #5470c6',
      },
      data: [100, 52, 200, 334, 390, 330, 220]
    },
            {
      name: '图例三',
      type: 'bar',

       stack: 'stack2',
        itemStyle: {
        color: ' #b7ccad',
      },
      data: [-100, -52, -200, -334, -390, -330, -220]
    },
            {
      name: '图例四',
      type: 'bar',

       stack: 'stack2',
        itemStyle: {
        color: '#91CC75',
      },
      data: [100, 52, 200, 334, 390, 330, 220]
    },
])



</script>

<style scoped></style>
