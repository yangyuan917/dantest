<template>
  <div class="echarts-box">
    <div class="title-box">
      <div class="time-title">
        <div>
          {{ title }}
        </div>

      </div>
      <div class="line"></div>
    </div>
    <!-- <div :id="uid" :style="myStyle" class="echarts"></div> -->
    <BaseEcharts :echartsOption="myOption" />
  </div>
</template>
<script setup>
import { onMounted, onBeforeMount, ref, onBeforeUnmount, onUnmounted, watch, inject } from 'vue'
import BaseEcharts from '@/components/BaseEcharts.vue'
import * as echarts from 'echarts'
const emit = defineEmits(['timeChange'])
import { api } from '@/utils/api';

const props = defineProps({

  title: {
    type: String,
    default: '标题'
  },
  separate_name: {//父组件下拉框的值
    type: String,
    default: ''
  },
  api_url: {// 传入的接口名称
    type: String,
    default: ''
  }
})

let scatterData = ref([
{
value: [
    1,
    300
  ],
  name: '1adasdasdas'
},
  [
    321.639344,
    100.085301
  ],
  [
    1729.180328,
    1.281031
  ],
  [
    172,
    0.654261
  ],
  [
    69.041096,
    2.312045
  ],
  [
    605,
    2.55472
  ],
  [
    46,
    3.802921
  ],
  [
    179,
    1.430698
  ],
  [
    359.016393,
    2.178189
  ]

]);

// 准备折线图的数据
let lineData = ref(
  [50, 30, 50, 70, 90],
  // [20, 40, 60, 80, 100]
);

const xData = ref([
])
const legendData = ref([
])
const mySeries = ref([])
const myOption = ref({
  // tooltip: {
    // trigger: 'axis',
  //   axisPointer: {
  //     type: 'shadow',
  //   },
  // },
  tooltip: {
   axisPointer: {
      type: 'shadow',
    },
    formatter: function (params) {
    // console.log('params', params)
      if (params.seriesType === 'scatter') {
        console.log('params :>> ', params);
        return '类别：' + params.seriesName + '<br/>' +
        '值:'  +params.data.value +'<br/>' +
          'code：' + params.data.code + '<br/>' +
          'bond_name：' + params.data.bond_name;
      } else {
      console.log('line', params)
         return '名称：' + params.seriesName + '<br/>'+
           '值:'  +params.value +'<br/>'
      }
    }
  },
  // xAxis: {
  //   type: 'value',
  //   data: xData.value, // x 轴的数据
  //   // axisLabel: {
  //   //   rotate: 45
  //   // }
  // },
  xAxis: {
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
  },
  yAxis: {
    type: 'value'
  },
  dataZoom: [
    // 添加数据区域缩放组件，即滚动条
    {
      show: true,
      type: 'slider',
      top: '90%',
      bottom: '4%',
      start: 0,
      end: 100
    }
  ],
  legend: {
    data: legendData.value // 设置图例的数据

  },
  // series: mySeries.value
  series: [
    {
      type: 'line',
      name: '折线图',
      data: lineData.value,
       smooth: true,  // 设置为光滑曲线
    symbol: '',  // 不显示标点


    },
    {
      type: 'scatter',
      name: '散点图',
      symbolSize: 10,
      data: scatterData.value
    },

  ]
})



const getAllData = async () => {//所有的数据请求都在这里，区别就是接口不同，要求返回的格式必须相同,后续后端其他接口改造完，可用这个组件统一

  let params = {

  }
  let lineRes = await api.get('/bp/curve_cnbd', { params })
  let scatRes = await api.get('/bp/fixincome_price', { params })
  console.log('lineRes :>> ', lineRes);
  lineRes = lineRes.data
  scatRes = scatRes.data.data
  lineData.value = lineRes.data.data
  console.log('scatRes', scatRes)
  // scatterData.value =scatRes.data.data
  legendData.value = scatRes.map(item => item.name)
  console.log('legendData.value', legendData.value)
  const transformedData = scatRes.map(item => {
    item.type = 'scatter';
    item.symbolSize = 10
     const transformedItem = {
       type:'scatter',
      symbolSize: 10,
    data: []
  };

  item.data.forEach((value, index) => {
    transformedItem.data.push({
      value,

      name: item.name[index],
      bond_name: item.bond_name[index],
      code: item.code[index]
    });
  });

  transformedItem.name = item.name;

  return transformedItem;

  })
  // scatterData.value =scatRes[0]
  xData.value = lineRes.data.xaixs
  // let scatterRes = await api.get('/curve_cnbd', { params })
  myOption.value.xAxis.data = xData.value
  myOption.value.legend.data = legendData.value
  myOption.value.series = [

    {
      type: 'line',

      name: '折线图',
      data: lineData.value
    },
    // { bond_name: '债券11111', type: 'scatter', name:'11', data: [1, 2] },
    // scatterData.value
    // scatRes[0]
    ...transformedData
  ]

console.log('myOption :>> ', myOption);
  // res = res.data
  // if (!res.data) {
  //   return
  // }
  // mySeries.value = res.data.series.map(item => {
  //   item.type = 'bar'
  //   return item
  // })
  // xData.value = res.data.xaxis
  // myOption.value.series = mySeries.value
  // myOption.value.xAxis.data = xData.value
}
getAllData()







</script>

<style scoped>
.echarts-box {
  background-color: #ffffff;
  border-radius: 8px;
  width: 100%;
}

.title-box {
  padding: 20px;
  padding-bottom: 4px;
  /* font-size: 20px; */
  font-size: 1vw;
  font-family: PingFang SC;
  font-weight: bold;
  /* color: #262626; */

  color: red;
}

.time-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 一条灰色的线，高1px */
.line {
  height: 1px;
  background-color: #e5e5e5;
  margin-top: 10px;
  margin-bottom: 10px;
}

.echarts {
  padding: 20px;
  padding-bottom: 6px;
  box-sizing: border-box;
  text-align: center;
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
  /* 设置宽高比为16:9 */
  /* min-width: calc(33.33% - 20px); */

  /* width: 580px; */
}

.item {
  flex: 1;
  min-width: calc(33.33% - 20px);
  /* background-color: #f4f4f4; */
  background-color: #f4f4f4;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
}

.time {
  display: flex;
  justify-content: center;
}
</style>
