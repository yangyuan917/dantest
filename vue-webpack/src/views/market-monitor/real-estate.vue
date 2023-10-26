<template>
  <div class="all-page-flex">
    <div style="width: 100%;">
      <el-date-picker v-model="father_start_date" @change="father_date_Chage" type="date" value-format="YYYY-MM-DD"
        style="max-width: 240px" placeholder="请选择开始日期" />
      <el-date-picker v-model="father_end_date" @change="father_date_Chage" type="date" value-format="YYYY-MM-DD"
        style="max-width: 240px" placeholder="请选择结束日期" />
    </div>
    <!-- 第一排 -->
    <!-- <Barchart :mySeries="series" :xData="barXdata" :separate_name="separate_name" @timeChange="timeChange"></Barchart> -->
    <Linechart :mySeries="lineSeries1" :checkboxApi="checkboxApi1" @allParamChange="linetimeChange1"></Linechart>
    <Linechart :mySeries="lineSeries2" :checkboxApi="checkboxApi2" @allParamChange="linetimeChange2"></Linechart>
    <Linechart :mySeries="lineSeries3" :checkboxApi="checkboxApi3" @allParamChange="linetimeChange3"></Linechart>
    <Linechart :mySeries="lineSeries4" :checkboxApi="checkboxApi4" @allParamChange="linetimeChange4"></Linechart>
    <!-- <Barchart   :mySeries="Barchartseries" :xData="barXdata" @timeChange="BarcharttimeChange"></Barchart> -->






  </div>
</template>

<script  setup>
import {reactive,ref,provide} from "vue"
import Linechart from "@/views/allocation/components/Linechart.vue"
import Barchart2 from "@/views/allocation/components/Barchart2.vue"
import Barchart from "@/views/allocation/components/Barchart.vue"
import useDate from '@/hooks/useDate'
import { api } from '@/utils/api'

//时间相关
const {
  father_start_date,
    father_end_date,
    father_date,
    father_date_Chage
} = useDate()//父组件时间hooks
console.log('father_date', father_date)
provide('father_date',father_date)


//第一个图
const lineSeries1 = ref([])
const checkboxApi1 = '/catergory_list'//左侧的选框接口
const linetimeChange1 = (val) => {
console.log('val1', val)
if (!val) {
  return
}
getLineSeries1Data(val)

}
const  getLineSeries1Data = async(val) => {//获取第一个数据
  let params = {
  // td:val.selectedOptions.join(",")
  dt:'通州,大运'//测试数据
  }
  let res = await api.get('/estate/listp2',{params})
  let resdata = res.data.data
  resdata.map(item=>{
  item.type= 'line',
  item.data =convertDataForECharts(item.data)
  return item

  })
  lineSeries1.value = [...resdata]
}
function convertDataForECharts(data) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    let date = new Date(item['业务日期']);
    let downPct = item['down_pct'];
    result.push([date.getTime(), downPct]);
  }

  return result;
}

//第二个图
const lineSeries2 = ref([])
const checkboxApi2 = '/catergory_list'//左侧的选框接口
const linetimeChange2 = (val) => {
console.log('val1', val)
if (!val) {
  return
}
getLineSeries2Data(val)

}
const  getLineSeries2Data = async(val) => {//获取第二个数据
  let params = {
  // td:val.selectedOptions.join(",")
  dt:'通州,大运'//测试数据
  }
  let res = await api.get('/estate/listp',{params})
  let resdata = res.data.data
  lineSeries2.value = convertToEChartsFormat(resdata)
  console.log('lineSeries2.value ', lineSeries2.value )
}
function convertToEChartsFormat(data) {
 let xAxisData = data.xaixs.map(function(dateStr) {
    return new Date(dateStr).getTime();
  });
  let seriesData = data.series.map(function(series) {
    return {
      name: series.name,
      type: 'bar',
      data: series.data.map(function(value, index) {
        return [xAxisData[index], value];
      })
    };
  });
 return seriesData
}



//第三个图
const lineSeries3 = ref([])
const checkboxApi3 = '/catergory_list'//左侧的选框接口
const linetimeChange3 = (val) => {
console.log('val1', val)
if (!val) {
  return
}
getLineSeries3Data(val)

}
const  getLineSeries3Data = async(val) => {//获取第二个数据
  let params = {
  // td:val.selectedOptions.join(",")
  dt:'bj'//测试数据
  }
  let res = await api.get('/estate/onsale',{params})
  let resdata = res.data.data
  console.log('resdata', resdata)
  lineSeries3.value = convertToEChartsFormat3(resdata)
  console.log(' lineSeries3.value',  lineSeries3.value)

  // lineSeries3.value = convertToEChartsFormat(resdata)
}

function convertToEChartsFormat3(obj) {
let xAxisData = obj.xaixs
let data = obj.series.data
  // 创建一个新数组用于存储转换后的数据
  let newData = [];
  // 遍历原始数据数组
  for (let i = 0; i < data.length; i++) {
    // 将日期字符串转换为时间戳
    let timestamp = new Date(xAxisData[i]).getTime();
    // 创建一个包含时间戳和down_pct值的对象
    let newDataPoint = {
      value: [timestamp, data[i]]
    };
    // 将新数据点添加到新数组中
    newData.push(newDataPoint);
  }
console.log('newData', newData)
  // 返回转换后的数据
 return {
      name:  obj.series.name,
      type: 'line',
      data: newData
    };

  // return newData;
}

//第四个图
const lineSeries4 = ref([])
const checkboxApi4 = '/catergory_list'//左侧的选框接口
const linetimeChange4 = (val) => {
if (!val) {
  return
}
getLineSeries4Data(val)

}
const  getLineSeries4Data = async(val) => {//获取第二个数据
  let params = {
  // td:val.selectedOptions.join(",")
  dt:'成都,北京,深圳'//测试数据
  }
  let res = await api.get('/estate/register',{params})
  let resdata = res.data.data.map(item=>{
  item.type='bar'
  item.data[0] = new Date(item.data[0]).getTime();
  return item
  })
  console.log('resdata4', resdata)
  lineSeries4.value = resdata
  // lineSeries3.value = convertToEChartsFormat(resdata)
}
</script>

<style  scoped>
</style>
