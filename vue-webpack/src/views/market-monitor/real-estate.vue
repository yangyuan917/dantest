<template>
  <div class="all-page-flex">
    <div style="width: 100%;">
      <el-date-picker size="mini" v-model="father_start_date" @change="father_date_Chage" type="date" value-format="YYYY-MM-DD"
        style="max-width: 240px" placeholder="请选择开始日期" />
      <el-date-picker size="mini" v-model="father_end_date" @change="father_date_Chage" type="date" value-format="YYYY-MM-DD"
        style="max-width: 240px" placeholder="请选择结束日期" />
    </div>
    <!-- 第一排 -->
    <!-- <Barchart :mySeries="series" :xData="barXdata" :separate_name="separate_name" @timeChange="timeChange"></Barchart> -->
    <Linechart :mySeries="lineSeries1" :checkboxApi="checkboxApi1" @allParamChange="linetimeChange1"></Linechart>
    <Linechart :mySeries="lineSeries2" :checkboxApi="checkboxApi2" @allParamChange="linetimeChange2"></Linechart>
    <Linechart :mySeries="lineSeries3" :checkboxApi="checkboxApi3" :maxNum="1" @allParamChange="linetimeChange3">
    </Linechart>
    <Linechart :mySeries="lineSeries4" :checkboxApi="checkboxApi4" @allParamChange="linetimeChange4"></Linechart>
    <Linechart :mySeries="lineSeries5" :checkboxApi="checkboxApi5" @allParamChange="linetimeChange5"></Linechart>
    <!-- <Barchart   :mySeries="Barchartseries" :xData="barXdata" @timeChange="BarcharttimeChange"></Barchart> -->






  </div>
</template>

<script  setup>
import { reactive, ref, provide } from "vue"
import Linechart from "@/views/allocation/components/Linechart.vue"
import Barchart2 from "@/views/allocation/components/Barchart2.vue"
import Barchart from "@/views/allocation/components/Barchart.vue"
import useDate from '@/hooks/useDate'
import { api } from '@/utils/api'
import { dayjs } from 'element-plus'

//时间相关
const {
  father_start_date,
  father_end_date,
  father_date,
  father_date_Chage
} = useDate()//父组件时间hooks
provide('father_date', father_date)


//第一个图
const lineSeries1 = ref([])
const checkboxApi1 = '/list/city_price'//左侧的选框接口
const linetimeChange1 = (val) => {
  console.log('val1', val)
  if (!val) {
    return
  }
  getLineSeries1Data(val)
}
const getLineSeries1Data = async (val) => {//获取第一个数据
  let params = {
    dt: val.selectedOptions.join(",")
    // dt:'通州,大运'//测试数据
  }
  let res = await api.get('/estate/listp2', { params })
  let resdata = res.data.data
  resdata.map(item => {
    item.type = 'line',
      item.smooth = true,
      item.symbol = '',
      item.data = convertDataForECharts(item.data)
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
    // result.push([date.getTime(), downPct]);
    result.push([dayjs(date).startOf('day').format('YYYY-MM-DD'),
       downPct]);
  }

  return result;
}

let darkcolor = ['#91CC75', '#FAC858', '#EE6666']
let shoalcolor = ['#C8EBAE', '#FDE4AC', '#F0B3B3']
const getColor = (() => {
  let darkIndex = 0;
  let shoalIndex = 0;

  return (tag) => {
    let color;
    if (tag === '涨') {
      color = darkcolor[darkIndex];
      darkIndex = (darkIndex + 1) % darkcolor.length;
    } else if (tag === '降') {
      color = shoalcolor[shoalIndex];
      shoalIndex = (shoalIndex + 1) % shoalcolor.length;
    }
    return color;
  };
})();
//第二个图
const lineSeries2 = ref([])
const checkboxApi2 = '/list/city_price'//左侧的选框接口
const linetimeChange2 = (val) => {
  console.log('val1', val)
  if (!val) {
    return
  }
  getLineSeries2Data(val)

}
const getLineSeries2Data = async (val) => {//获取第二个数据
  let params = {
    dt: val.selectedOptions.join(",")
    // dt:'通州,大运'//测试数据
  }
  let res = await api.get('/estate/listp', { params })
  let resdata = res.data.data
  lineSeries2.value = convertToEChartsFormat(resdata)
  console.log('lineSeries2.value ', lineSeries2.value)
}
function convertToEChartsFormat(data) {
  let xAxisData = data.xaixs.map(function (dateStr) {
    // return  new  Date(dateStr).getTime();
    //返回days 处理过后的0点时间

    return dayjs(dateStr).startOf('day').format('YYYY-MM-DD');
  });
  let seriesData = data.series.map(function (series) {
    if (series.tag == '降') {
      series.data = series.data.map((num) => -num);
    }
    return {
      name: series.name,
      stack: series.name,
      type: 'bar',
      itemStyle: {
        color: getColor(series.tag)
      },
      data: series.data.map(function (value, index) {
        return [xAxisData[index], value];
      })
    };
  });
  return seriesData
}



//第三个图
const lineSeries3 = ref([])
const checkboxApi3 = '/list/city_onsale'//左侧的选框接口
const linetimeChange3 = (val) => {
  console.log('val1', val)
  if (!val) {
    return
  }
  getLineSeries3Data(val)

}
const getLineSeries3Data = async (val) => {//获取第三个数据
  let params = {
    dt: val.selectedOptions.join(",")
    // dt:'bj'//测试数据
  }
  let res = await api.get('/estate/onsale', { params })
  let resdata = res.data.data
  console.log('resdata', resdata)
  // lineSeries3.value = convertToEChartsFormat3(resdata)
  // console.log(' lineSeries3.value', lineSeries3.value)

  lineSeries3.value = convertToEChartsFormat3(resdata)
  console.log('lineSeries3.value', lineSeries3.value)
}

// todo：这是一个异步函数
function convertToEChartsFormat3(obj) {
  let seriesData = obj.map(function (item) {
    console.log('Processing item:', item);
    console.log('Processing item.index:', Object.keys(item)[0]);
    return {
      name: Object.keys(item)[0],
      stack: Object.keys(item)[0],
      type: 'line',
      data: Object.values(item)[0],
    };
  });
  return seriesData
}

// function convertToEChartsFormat3(obj) {
//   let xAxisData = obj.xaixs
//   let data = obj.series.data
//   // 创建一个新数组用于存储转换后的数据
//   let newData = [];
//   // 遍历原始数据数组
//   for (let i = 0; i < data.length; i++) {
//     // 将日期字符串转换为时间戳
//     let timestamp = dayjs(xAxisData[i]).startOf('day').format('YYYY-MM-DD') ;
//     // 创建一个包含时间戳和down_pct值的对象
//     let newDataPoint = {
//       value: [timestamp, data[i]]
//     };
//     // 将新数据点添加到新数组中
//     newData.push(newDataPoint);
//   }
//   console.log('newData', newData)
//   // 返回转换后的数据
//   return [{
//     name: obj.series.name,
//     type: 'line',
//     symbol: '',//曲线无点
//     smooth: true,
//     data: newData
//   }];

  // return newData;


//第四个图
const lineSeries4 = ref([])
const checkboxApi4 = '/list/city_register'//左侧的选框接口
const linetimeChange4 = (val) => {
  if (!val) {
    return
  }
  getLineSeries4Data(val)

}
const getLineSeries4Data = async (val) => {//获取第二个数据
  let params = {
    dt: val.selectedOptions.join(",")
    // dt:'成都,北京,深圳'//测试数据
  }
  let res = await api.get('/estate/register', { params })
  let resdata = res.data.data.map(item => {
    item.type = 'bar'
    item.barMaxWidth = 40
    // item.data[0] = new Date(item.data[0]).getTime();
    item.data.map(k => {

      k[0] = dayjs(k[0]).startOf('day').format('YYYY-MM-DD') ;
      return k

    })
    return item
  })
  console.log('resdata4', resdata)
  lineSeries4.value = resdata
  // lineSeries3.value = convertToEChartsFormat(resdata)
}

//第5个图
const lineSeries5 = ref([])
const checkboxApi5 = '/list/city_price'//左侧的选框接口
const linetimeChange5 = (val) => {
console.log('val1', val)
if (!val) {
  return
}
getLineSeries5Data(val)

}
const  getLineSeries5Data = async(val) => {//获取第一个数据
  let params = {
  dt:val.selectedOptions.join(",")
  // dt:'通州,大运'//测试数据
  }
  let res = await api.get('/estate/onsale_price',{params})
  let resdata = res.data.data
  resdata.map(item=>{
  item.type= 'line',
   item.smooth =  true,
    item.symbol = '',

  item.data =convertDataForECharts5(item.data)
  return item

  })
  lineSeries5.value = [...resdata]
}
function convertDataForECharts5(data) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    let date = new Date(item['业务日期']);
    date.setHours(0, 0, 0, 0);
    let downPct = item['unitprice1'];
    result.push([date.getTime(), downPct]);
  }

  return result;
}
</script>

<style  scoped></style>
