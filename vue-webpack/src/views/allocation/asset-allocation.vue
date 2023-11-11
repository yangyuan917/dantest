<template>
  <div class="all-page-flex">
    <div style="width: 100%;">
      <el-date-picker v-model="father_start_date" @change="father_date_Chage" type="date" value-format="YYYY-MM-DD"
        style="max-width: 240px" placeholder="请选择开始日期" />
      <el-date-picker v-model="father_end_date" @change="father_date_Chage" type="date" value-format="YYYY-MM-DD"
        style="max-width: 240px" placeholder="请选择结束日期" />
    </div>
    <!-- 第一排 -->
    <Barchart title="自定义标题" :mySeries="series" :xData="barXdata" @timeChange="timeChange1"></Barchart>
    <Linechart :mySeries="lineSeries" :checkboxApi="checkboxApi1" @allParamChange="linetimeChange"></Linechart>
    <Linechart :mySeries="lineSeriestow" :checkboxApi="checkboxApi1" @allParamChange="linetimeChangetow"
      :showTarget="true"></Linechart>
    <!-- 第二排 -->
    <BarchartLast title="柱状图" api_url="/asset_citybond1"></BarchartLast>
    <Linechart :mySeries="series3_3" title="折线图" :checkboxApi="checkboxApi3" @allParamChange="linetimeChange4">
    </Linechart>

    <!-- <Linechart :mySeries="series3_3" title="折线图" checkboxApi="/list/city_price" @allParamChange="linetimeChange4"></Linechart>
    <Barchart title="折线图" :mySeries="series4_1" :xData="barXdata4_1" @timeChange="timeChange4_1"></Barchart> -->

    <Barchart :mySeries="series2_1" :xData="barXdata2_1" @timeChange="timeChange2_1"></Barchart>
    <Barchart :mySeries="series2_2" :xData="barXdata2_2" @timeChange="timeChange2_2"></Barchart>
    <Linechart :mySeries="series2_3" :checkboxApi="checkboxApi2" @allParamChange="linetimeChange2"></Linechart>
    <!-- 第三排 -->

    <Barchart :mySeries="series3_1" :xData="barXdata3_1" @timeChange="timeChange3_1"></Barchart>
    <Linechart :mySeries="series3_2" :checkboxApi="checkboxApi2" @allParamChange="linetimeChange3"></Linechart>
    <BarchartLast api_url="/asset_citybond1"></BarchartLast>

  </div>
</template>
<script setup>
import { reactive, ref, provide } from 'vue'
import Barchart from './components/Barchart'
import BarchartLast from './components/BarchartLast'
import Linechart from './components/Linechart'
import Linechart2 from './components/Linechart2'
import { api } from '@/utils/api'
import { getTodayTime } from '@/utils/util'
import useDate from '@/hooks/useDate'

//父组件时间
const {
  father_start_date,
  father_end_date,
  father_date,
  father_date_Chage
} = useDate()//父组件时间hooks
provide('father_date', father_date)
// checkboxApi

const checkboxApi1 = '/list/cat'
const checkboxApi2 = '/list/indus'
const checkboxApi3 = '/list/province'

// const CheckboxApi


//柱状图
const series = ref([])
const barXdata = ref([])
let barXdata2_1 = ref([])
let series2_1 = ref([])
let barXdata2_2 = ref([])
let series2_2 = ref([])
let series3_1 = ref([])
let barXdata3_1 = ref([])

const series3_3 = ref([])
const linetimeChange4 = async (val) => {
  let arr = []
  let target = ''
  arr = await getLineData5(val, target)

  series3_3.value = arr

}

const getLineData5 = async (val, target) => {
  let sector = val.selectedOptions;
  let params = {
    dt: sector.join(",")

  }
  let res = await api.get('/asset_citybond_timeseries', { params })
  let data = res.data.data
  let resultArr = convertArray(data)
  return resultArr
}

function convertArray(arr) {
  const result = [];

  arr.forEach((item) => {
    const data = item.data.map((value, index) => [item.xaxis[index], value]);
    result.push({
      name: item.name,
      type: 'line',
      symbol: '',//曲线无点
      smooth: true,
      data,
    });
  });

  return result;
}


let barXdata3_3 = ref([]
)

const getBarchartData3_3 = async (start_date, end_date) => {


  let params = {
    start_date: '2023-10-10',
    end_date: '2023-10-12',
  }
  // let res = await api.get("/asset_citybond1", { params })//解开这个注释就行
  let res = {}
  res = {
    "code": 200,
    "data": {
      "series": [
        {
          "data": [
            0.291755,
            0.274528,
            0.033864,
            0.879404,
            0.41137,
            0.023718,
            0.791575,
            0.76622,
            0.351986,
            0.051498,
            0.78058,
            0.786922,
            0.857404,
            0.57595,
            0.840691,
            0.947402
          ],
          "name": "2023-10-10"
        },
        {
          "data": [
            0.099295,
            0.089537,
            0.623497,
            0.174646,
            0.379318,
            0.536166,
            0.931625,
            0.385132,
            0.926775,
            0.279418,
            0.934767,
            0.65284,
            0.082294,
            0.227716,
            0.330444,
            0.554052
          ],
          "name": "2023-10-12"
        }
      ],
      "xaxis": [
        "上海",
        "北京",
        "四川省",
        "安徽省",
        "山东省",
        "山西省",
        "广东省",
        "广西壮族自治区",
        "江苏省",
        "江西省",
        "河南省",
        "浙江省",
        "湖北省",
        "湖南省",
        "福建省",
        "重庆"
      ]
    }
  }
  series3_3.value = res.data.series.map(item => {
    item.type = 'bar'
    return item

  })
  barXdata3_3.value = res.data.xaxis


}
getBarchartData3_3(father_start_date.value, father_end_date.value)

const resultFmoadata = ref([]) //处理过后的数据

const timeChange = (val) => {
  getBarchartData(val.start_date, val.end_date)
}
const getBarchartData = async (start_date, end_date) => {//柱状图
  let params = {
    start_date,
    end_date,
  }
  let res = await api.get('/asset_concentrate', { params })
  let res2_1 = await api.get('/prtindustry', { params })
  let res2_2 = await api.get('/prtindex', { params })
  let res3_1 = await api.get('/fundprtindustry', { params })

  if (!res.data.data) {
    series.value = {}
    return
  }
  const data = res.data.data
  const data2_1 = res2_1.data.data
  const data2_2 = res2_2.data.data
  const data3_1 = res3_1.data.data
  const orderedData = {};
  const catergory_list = await api.get('/list/cat') //这边写获取x轴坐标的数据
  const industry_list = await api.get('/list/indus') //这边写获取x轴坐标的数据
  const index_list = await api.get('/list/index') //这边写获取x轴坐标的数据

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

  let start_date_data1 = orderedData[`${start_date}`]
  let end_date_data1 = orderedData[`${end_date}`]
  let valuesArray1 = []
  let valuesArray2 = []
  console.log('start_date_data1 :>> ', start_date_data1);
  if (start_date_data1) {
    barXdata.value = Object.keys(start_date_data1);//轴的值
    valuesArray1 = Object.values(start_date_data1);
    console.log('valuesArray1 :>> ', valuesArray1);




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
  // 第二排第一个图
  // Loop through each date in the received data
  console.log('industry_list :>> ', industry_list.data.data);
  const orderedData2_1 = {};
  Object.keys(data2_1).forEach(date => {

    orderedData2_1[date] = {};

    // Use the predefined order from catergory_list to order the data for this date
    industry_list.data.data.forEach(key => {
      if (data2_1[date].hasOwnProperty(key)) {
        orderedData2_1[date][key] = data2_1[date][key];
      }
    });
  });


  let start_date_data2_1 = orderedData2_1[`${start_date}`]
  let end_date_data2_1 = orderedData2_1[`${end_date}`]
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
  const orderedData2_2 = {};
  Object.keys(data2_2).forEach(date => {

    orderedData2_2[date] = {};

    // Use the predefined order from catergory_list to order the data for this date
    index_list.data.data.forEach(key => {
      if (data2_2[date].hasOwnProperty(key)) {
        orderedData2_2[date][key] = data2_2[date][key];
      }
    });
  });

  let start_date_data2_2 = orderedData2_2[`${start_date}`]
  let end_date_data2_2 = orderedData2_2[`${end_date}`]
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
  const orderedData3_1 = {};
  Object.keys(data3_1).forEach(date => {

    orderedData3_1[date] = {};

    // Use the predefined order from catergory_list to order the data for this date
    industry_list.data.data.forEach(key => {
      if (data3_1[date].hasOwnProperty(key)) {
        orderedData3_1[date][key] = data3_1[date][key];
      }
    });
  });
  let start_date_data3_1 = orderedData3_1[`${start_date}`]
  let end_date_data3_1 = orderedData3_1[`${end_date}`]
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

const timeChange1 = async (val) => {
  let params = {
    start_date: val.start_date,
    end_date: val.end_date,
  }
  let res = await api.get('/asset_concentrate', { params })
  if (!res.data.data) {
    series.value = {}
    return
  }
  const data = res.data.data
  const orderedData = {};
  const catergory_list = await api.get('/list/cat') //这边写获取x轴坐标的数据
  Object.keys(data).forEach(date => {
    orderedData[date] = {};
    // Use the predefined order from catergory_list to order the data for this date
    catergory_list.data.data.forEach(key => {
      if (data[date].hasOwnProperty(key)) {
        orderedData[date][key] = data[date][key];
      }
    });
  });
  let start_date_data1 = orderedData[`${start_date}`]
  let end_date_data1 = orderedData[`${end_date}`]
  let valuesArray1 = []
  let valuesArray2 = []
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
}
const timeChange2_1 = async (val) => {
  let params = {
    start_date: val.start_date,
    end_date: val.end_date,
  }
  let res2_1 = await api.get('/prtindustry', { params })
  const industry_list = await api.get('/list/indus') //这边写获取x轴坐标的数据
  const data2_1 = res2_1.data.data
  const orderedData2_1 = {};
  Object.keys(data2_1).forEach(date => {

    orderedData2_1[date] = {};

    // Use the predefined order from catergory_list to order the data for this date
    industry_list.data.data.forEach(key => {
      if (data2_1[date].hasOwnProperty(key)) {
        orderedData2_1[date][key] = data2_1[date][key];
      }
    });
  });


  let start_date_data2_1 = orderedData2_1[`${start_date}`]
  let end_date_data2_1 = orderedData2_1[`${end_date}`]
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
}
const timeChange2_2 = async (val) => {
  let params = {
    start_date: val.start_date,
    end_date: val.end_date,
  }
  let res2_2 = await api.get('/prtindex', { params })
  const data2_2 = res2_2.data.data
  const index_list = await api.get('/list/index') //这边写获取x轴坐标的数据
  // 第二排第二个图
  const orderedData2_2 = {};
  Object.keys(data2_2).forEach(date => {

    orderedData2_2[date] = {};

    // Use the predefined order from catergory_list to order the data for this date
    index_list.data.data.forEach(key => {
      if (data2_2[date].hasOwnProperty(key)) {
        orderedData2_2[date][key] = data2_2[date][key];
      }
    });
  });

  let start_date_data2_2 = orderedData2_2[`${start_date}`]
  let end_date_data2_2 = orderedData2_2[`${end_date}`]
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

}
const timeChange3_1 = async (val) => {
  let params = {
    start_date: val.start_date,
    end_date: val.end_date,
  }
  let res3_1 = await api.get('/fundprtindustry', { params })
  const data3_1 = res3_1.data.data
  const industry_list = await api.get('/list/indus') //这边写获取x轴坐标的数据
  const orderedData3_1 = {};
  Object.keys(data3_1).forEach(date => {

    orderedData3_1[date] = {};

    // Use the predefined order from catergory_list to order the data for this date
    industry_list.data.data.forEach(key => {
      if (data3_1[date].hasOwnProperty(key)) {
        orderedData3_1[date][key] = data3_1[date][key];
      }
    });
  });
  let start_date_data3_1 = orderedData3_1[`${start_date}`]
  let end_date_data3_1 = orderedData3_1[`${end_date}`]
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
  lineSeries.value = arr
}

const getLineData = async (val, target) => {
  let catergory = val.selectedOptions;
  let params = {
    catergory: catergory.join(",")
  }
  if (target) {
    params.target = target
  }

  let res = await api.get('/asset_concentrate_timeseries', { params })
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
  console.log('父组件val111 :>> ', val)
  // let selectedOptions = val.selectedOptions
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
    catergory: catergory.join(","),
    indicator: indicator
  }
  if (target) {
    params.target = target
  }
  let res = await api.get('/asset_indicator', { params })
  console.log('/asset_indicator    res :>> ', res)
  let data = res.data.data

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
    sector: sector.join(",")
  }
  if (target) {
    params.target = target
  }

  let res = await api.get('/prtindustry_timeseries', { params })
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
    sector: sector.join(",")
  }
  if (target) {
    params.target = target
  }

  let res = await api.get('/fundprtindustry_timeseries', { params })
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
  let res = await api.get('/asset_indicator')
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
