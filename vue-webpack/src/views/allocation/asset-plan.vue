<template>
  <div class="all-page-flex">
    <div style="width: 100%;">
      <el-select v-model="separate_name" placeholder="选择separate_name" style="width: 200px; margin-right: 10px;"
        @change="selectedSeparateNameChange">
        <el-option v-for="name in separateNames" :key="name" :label="name" :value="name">
        </el-option>
      </el-select>
      <el-date-picker v-model="father_start_date" @change="father_date_Chage" type="date" value-format="YYYY-MM-DD"
        style="max-width: 240px" placeholder="请选择开始日期" />
      <el-date-picker v-model="father_end_date" @change="father_date_Chage" type="date" value-format="YYYY-MM-DD"
        style="max-width: 240px" placeholder="请选择结束日期" />
      <!-- <TopTimePicker ref="TopTimePickerRef"  /> -->

    </div>
    <!-- 第一排 -->
    <Barchart :mySeries="series" :xData="barXdata" :separate_name="separate_name" @timeChange="timeChange"></Barchart>
    <Linechart :mySeries="lineSeries" :checkboxApi="checkboxApi1" @allParamChange="linetimeChange"></Linechart>
    <Linechart :mySeries="lineSeriestow" :checkboxApi="checkboxApi1" @allParamChange="linetimeChangetow" :showTarget="true"></Linechart>
    <!-- 第二排 -->

    <Barchart :mySeries="series2_1" :xData="barXdata2_1" :separate_name="separate_name" @timeChange="timeChange">
    </Barchart>
    <Barchart :mySeries="series2_2" :xData="barXdata2_2" :separate_name="separate_name" @timeChange="timeChange">
    </Barchart>
    <Linechart :mySeries="series2_3" :checkboxApi="checkboxApi2" @allParamChange="linetimeChange2"></Linechart>
    <!-- 第三排 -->

    <Barchart :mySeries="series3_1" :xData="barXdata3_1" :separate_name="separate_name" @timeChange="timeChange">
    </Barchart>
    <Linechart :mySeries="series3_2" :checkboxApi="checkboxApi2" @allParamChange="linetimeChange3"></Linechart>
    <Linechart :mySeries="series3_3" :checkboxApi="checkboxApi2" @allParamChange="linetimeChange4"></Linechart>





  </div>
</template>
<script setup>
import { reactive, ref, onMounted, watch, provide } from 'vue'
import {getTodayTime} from '@/utils/util'

import Barchart from './components/Barchart'
import Linechart from './components/Linechart'
import Linechart2 from './components/Linechart2'
import { api } from '@/utils/api'
import useDate from '@/hooks/useDate'

// const separate_name = ref('中信证券增盈1号集合资产管理计划')
const separate_name = ref("中信证券增盈1号集合资产管理计划")
const separateNames = ref([]);


const {
  father_start_date,
    father_end_date,
    father_date,
    father_date_Chage
} = useDate()//父组件时间hooks
provide('father_date',father_date)

const checkboxApi1=  '/list/indus'
const checkboxApi2=  '/list/cat'

onMounted(async () => {
  try {

    const response = await api.get('/list/sep');
    console.log('catergory_list :>> ', response.data)
    separateNames.value = response.data.data; // 调整这里以匹配你的API响应结构
  } catch (error) {
    console.error('Failed to fetch API data:', error);
    // 这里你可以添加一些额外的错误处理逻辑
  }
});

// const selectedSeparateNameChange = (val)=>{//下拉框事件

// separate_name.value  = val

// }


//柱状图
const series = ref([])
const barXdata = ref([])
let barXdata2_1 = ref([])
let series2_1 = ref([])
let barXdata2_2 = ref([])
let series2_2 = ref([])
let series3_1 = ref([])
let barXdata3_1 = ref([])

// const getXdata = async () => {
//   let res = await api.get('/list/cat') //这边写获取x轴坐标的数据
//   barXdata.value = res.data.data // x 轴的数据
// }

// getXdata()

const resultFmoadata = ref([]) //处理过后的数据

const timeChange = (val) => {
  console.log('2222222222val :>> ', val)
  getBarchartData(val.start_date, val.end_date)
}
const getBarchartData = async (start_date, end_date) => {//柱状图
  let params = {
    start_date,
    end_date,
    separate_name: separate_name.value
  }
  let res = await api.get('/asset_concentrate_separate', { params })
  console.log('res :>> ', res);
  let res2_1 = await api.get('/separate_prtindustry', { params })
  let res2_2 = await api.get('/separate_prtindex', { params })
  let res3_1 = await api.get('/separate_fundprtindustry', { params })
  const data = res.data.data
  const data2_1 = res2_1.data.data
  const data2_2 = res2_2.data.data
  const data3_1 = res3_1.data.data
  const orderedData = {};
  const catergory_list = await api.get('/list/cat') //这边写获取x轴坐标的数据
  const industry_list = await api.get('/list/indus') //这边写获取x轴坐标的数据
  const index_list = await api.get('/index_list') //这边写获取x轴坐标的数据

  // Loop through each date in the received data
  Object.keys(data).forEach(date => {
    orderedData[date] = {};

    // Use the predefined order from catergory_list to order the data for this date
    catergory_list.data.data.forEach(key => {
      if (data[date].hasOwnProperty(key)) {
        orderedData[date][key] = data[date][key];
      }
    });
  });


  if (!res.data.data) {
    series.value = {}
    return
  }
  if (!res2_1.data.data) {
    series2_1.value = {}
    return
  }
  if (!res2_2.data.data) {
    series2_2.value = {}
    return
  }
  if (!res3_1.data.data) {
    series3_1.value = {}
    return
  }

  const processBarData = (res) => {
    let start_date_data = res.data.data[`${start_date}`];
    let end_date_data = res.data.data[`${end_date}`];
    let valuesArray1 = [];
    let valuesArray2 = [];
    let series = ref([])
    let barXdata = ref([])

    console.log('start_date_data: ', start_date_data);

    if (start_date_data) {
      barXdata.value = Object.keys(start_date_data); // X 轴的值
      valuesArray1 = Object.values(start_date_data);
    }

    if (end_date_data) {
      valuesArray2 = Object.values(end_date_data);
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
    ];
    console.log('start_date_data: ', start_date_data);
    console.log('end_date_data: ', end_date_data);
    console.log('valuesArray1: ', valuesArray1);
    console.log('valuesArray2: ', valuesArray2);
    console.log('series: ', series.value);
    console.log('barXdata: ', barXdata.value);

    return [series, barXdata]
  };

  // todo: 这个processBarData函数为什么不行?
  // [series2_1, barXdata2_1] = processBarData(res2_1);
  // console.log('res2_1 :>> ', res2_1);
  // console.log('series2_1 :>> ', series2_1);
  // console.log('barXdata2_1 :>> ', barXdata2_1.value);

  console.log('res :>> ', res);
  //  `${dateString}T00:00:00.000000000`;
  let start_date_data1 = orderedData[`${start_date}`]
  let end_date_data1 = orderedData[`${end_date}`]
  let valuesArray1 = []
  let valuesArray2 = []
  console.log('start_date_data1 :>> ', start_date_data1);
  if (start_date_data1) {
    barXdata.value = Object.keys(start_date_data1);//轴的值
    valuesArray1 = Object.values(start_date_data1);




  }
  if (end_date_data1) {
    barXdata.value = Object.keys(end_date_data1);//轴的值

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
  console.log('series :>> ', series);
  console.log('barXdata :>> ', barXdata.value);

  // 第二排第一个图
  let start_date_data2_1 = res2_1.data.data[`${start_date}`]
  let end_date_data2_1 = res2_1.data.data[`${end_date}`]
  console.log('start_date_data2_1 :>> ', start_date_data2_1);
  let valuesArray2_1_1 = []
  let valuesArray2_1_2 = []
  if (start_date_data2_1) {
    barXdata2_1.value = Object.keys(start_date_data2_1);//轴的值
    valuesArray2_1_1 = Object.values(start_date_data2_1);
    console.log('barXdata2_1 :>> ', barXdata2_1.value);
  }
  if (end_date_data2_1) {
    barXdata2_1.value = Object.keys(end_date_data2_1);//轴的值

    valuesArray2_1_2 = Object.values(end_date_data2_1);

  }
  series2_1.value = [
    {
      name: start_date,

      type: 'bar',

      data: valuesArray2_1_1 // 蓝色柱状图的数据
    },
    {
      name: end_date,
      type: 'bar',
      data: valuesArray2_1_2 // 蓝色柱状图的数据
    }
  ]



  // 第二排第二个图
  let start_date_data2_2 = res2_2.data.data[`${start_date}`]
  let end_date_data2_2 = res2_2.data.data[`${end_date}`]
  let valuesArray2_2_1 = []
  let valuesArray2_2_2 = []
  if (start_date_data2_2) {
    barXdata2_2.value = Object.keys(start_date_data2_2);//轴的值
    valuesArray2_2_1 = Object.values(start_date_data2_2);
  }
  if (end_date_data2_2) {
    barXdata2_2.value = Object.keys(end_date_data2_2);//轴的值

    valuesArray2_2_2 = Object.values(end_date_data2_2);

  }
  series2_2.value = [
    {
      name: start_date,

      type: 'bar',

      data: valuesArray2_2_1 // 蓝色柱状图的数据
    },
    {
      name: end_date,
      type: 'bar',
      data: valuesArray2_2_2 // 蓝色柱状图的数据
    }
  ]

  // 第三排第一个图
  let start_date_data3_1 = res3_1.data.data[`${start_date}`]
  let end_date_data3_1 = res3_1.data.data[`${end_date}`]
  let valuesArray3_1_1 = []
  let valuesArray3_1_2 = []
  if (start_date_data3_1) {
    barXdata3_1.value = Object.keys(start_date_data3_1);//轴的值
    valuesArray3_1_1 = Object.values(start_date_data3_1);
  }
  if (end_date_data3_1) {
    barXdata3_1.value = Object.keys(end_date_data3_1);//轴的值

    valuesArray3_1_2 = Object.values(end_date_data3_1);

  }
  series3_1.value = [
    {
      name: start_date,

      type: 'bar',

      data: valuesArray3_1_1 // 蓝色柱状图的数据
    },
    {
      name: end_date,
      type: 'bar',
      data: valuesArray3_1_2 // 蓝色柱状图的数据
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
const linetimeChange = async (val) => {
  console.log('父组件val :>> ', val)
  let selectedOptions = val.selectedOptions
  console.log('selectedOptions :>> ', selectedOptions)

  let arr = []
  let target = ''
  arr = await getLineData(val, target)
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

const getLineData = async (val, target) => {
  let catergory = val.selectedOptions;
  let params = {
    separate_name: separate_name.value,
    catergory: catergory.join(",")
    // separate_name:separate_name.value,
  }
  if (target) {
    params.target = target
  }

  let res = await api.get('/asset_concentrate_timeseries_separate', { params })
  let data = res.data.data

  console.log('catergory :>> ', catergory);
  let arr = catergory.map(category => {
    const transformedObj = {
      name: category,
      type: 'line',
      data: Object.entries(data[category]).map(([date, value]) => [date, value])
    };
    return transformedObj;
  });

  // const transformedObj = {
  //   name: catergory,
  //   type: 'line',
  //   data:Object.entries(data[catergory]).map(([date, value]) => [date, value])
  // };
  // let arr = []
  // arr.push(transformedObj)
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


const linetimeChangetow = async (val) => {//这是有指标的
  let arr = []
  let target = ''
  arr = await getLineData2(val, target)
  lineSeriestow.value = arr
}

const getLineData2 = async (val, target) => {
  let catergory = val.selectedOptions
  let indicator = val.target
  console.log('indicator :>> ', indicator)
  let params = {
    separate_name: separate_name.value,
    catergory: catergory.join(","),
    indicator: indicator
    // separate_name:separate_name.value,
  }
  if (target) {
    params.target = target
  }
  let res = await api.get('/asset_indicator_separate', { params })
  console.log('/asset_indicator_separate    res :>> ', res)
  let data = res.data.data
  let arr = catergory.map(category => {
    const transformedObj = {
      name: category,
      type: 'line',
      data: Object.entries(data[category]).map(([date, value]) => [date, value])
    };
    return transformedObj;
  });

  return arr
}


// const linetimeChangetow =async (val) => {//这是有指标的
//   console.log('父组件val111 :>> ', val)
//   let selectedOptions = val.selectedOptions
//   let target = val.target
//   let arr = []
//   arr =    await  getLineData(val,target)

//   lineSeriestow.value = arr
// }


const series2_3 = ref([
  {
    name: '线段1',
    type: 'line',
    data: [
      ['2023-09-01', 20],
      ['2023-09-02', 40],
      ['2023-09-03', 50]
    ] //
  }
])
const linetimeChange2 = async (val) => {
  console.log('父组件val :>> ', val)
  let selectedOptions = val.selectedOptions
  console.log('selectedOptions :>> ', selectedOptions)

  let arr = []
  let target = ''
  arr = await getLineData3(val, target)
  console.log('arr111 :>> ', arr);
  series2_3.value = arr
}

const getLineData3 = async (val, target) => {
  let sector = val.selectedOptions;
  let params = {
    separate_name: separate_name.value,
    sector: sector.join(",")
    // separate_name:separate_name.value,
  }
  if (target) {
    params.target = target
  }

  let res = await api.get('/separate_prtindustry_timeseries', { params })
  let data = res.data.data

  let arr = sector.map(sector => {
    const transformedObj = {
      name: sector,
      type: 'line',
      data: Object.entries(data[sector]).map(([date, value]) => [date, value])
    };
    return transformedObj;
  });
  return arr
}


const series3_2 = ref([
  {
    name: '线段1',
    type: 'line',
    data: [
      ['2023-09-01', 20],
      ['2023-09-02', 40],
      ['2023-09-03', 50]
    ] //
  }
])
const series3_3 = ref([//
  {
    name: '线段1',
    type: 'line',
    data: [
      ['2023-09-01', 20],
      ['2023-09-02', 40],
      ['2023-09-03', 50]
    ] //
  }
])


const  linetimeChange4 = async (val)=>{


  console.log('父组件val :>> ', val)
  let selectedOptions = val.selectedOptions
  console.log('selectedOptions :>> ', selectedOptions)

  let arr = []
  let target = ''
  arr = await getLineData5(val, target)
  console.log('arr111 :>> ', arr);
  series3_3.value = arr

}

const getLineData5 = async (val, target) => {
  let sector = val.selectedOptions;
  let params = {
    dt:'北京,上海'//这个从哪里来

  }
   let res = await api.get('/asset_citybond_timeseries', { params })
  let data = res.data.data
    let resultArr =convertArray(data)
    return resultArr
  }
function convertArray(arr) {
 const result = [];

 arr.forEach((item) => {
   const data = item.data.map((value, index) => [item.xaxis[index], value]);
   result.push({
     name: item.name,
     type: 'line',
     data,
   });
 });

 return result;
}

const linetimeChange3 = async (val) => {
  console.log('父组件val :>> ', val)
  let selectedOptions = val.selectedOptions
  console.log('selectedOptions :>> ', selectedOptions)

  let arr = []
  let target = ''
  arr = await getLineData4(val, target)
  console.log('arr111 :>> ', arr);
  series3_2.value = arr
}

const getLineData4 = async (val, target) => {
  let sector = val.selectedOptions;
  let params = {
    separate_name: separate_name.value,
    sector: sector.join(",")
    // separate_name:separate_name.value,
  }
  if (target) {
    params.target = target
  }

  let res = await api.get('/separate_fundprtindustry_timeseries', { params })
  let data = res.data.data

  let arr = sector.map(sector => {
    const transformedObj = {
      name: sector,
      type: 'line',
      data: Object.entries(data[sector]).map(([date, value]) => [date, value])
    };
    return transformedObj;
  });
  return arr
}


const getCatergoryList = async () => {
  let res = await api.get('/list/cat')
  console.log('类别res :>> ', res)
}
getCatergoryList()


const getAssetConcentrate = async () => {//这是获取总数据的地方
  let res = await api.get('/asset_indicator_separate')
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
