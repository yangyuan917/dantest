<template>
  <div class="echarts-box">
    <div class="title-box">
      <div class="time-title">
        <div>
          {{ title }}
        </div>
        <!-- 改一下class -->
        <div class="sector">
          <el-select v-model="sector1" @change="targetChange" v-if="showTarget" placeholder="请选择行业">
            <el-option v-for="item in targetList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="sector2" @change="targetChange" v-if="showTarget" placeholder="请选择行业">
            <el-option v-for="item in targetList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
          <div class="time">
         <el-date-picker
            v-model="timeValue"
            type="daterange"
            @change="changeTime"
            value-format="YYYY-MM-DD"
            range-separator="-"
            start-placeholder="请选择开始日"
            end-placeholder="请选择结束日"
            style="max-width: 240px"
          />
        </div>
      </div>
      <div class="line"></div>
    </div>
    <div :id="uid" :style="myStyle" class="echarts"></div>
  </div>
</template>
<script setup>
import { onMounted, onBeforeMount, ref, onBeforeUnmount, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
const emit = defineEmits(['allParamChange'])
import api from '@/utils/api';

const props = defineProps({
  myStyle: {
    type: Object,
    default: () => ({
      // width: '600px',
      // height: '400px',
    })
  },
showTarget: {
  type: Boolean,
  default: false
},
  title: {
    type: String,
    default: '标题'
  },
  mySeries: {
    type: Object,
    default: () => ({}),
    required: true
  },
  xData: {
    type: Array,
    default: () => ([]),

  },
  echartsLegend: {
    type: Array,
    default: () => ([]),

  },

  // myOption: {
  //   type: Object,
  //   default: () => ({}),
  //   required: true,
  // },
})

const target = ref('')
// let targetList = ref([
//   {
//     label: '总计',
//     value: '总计'
//   },
//   {
//     label: '银行',
//     value: '银行'
//   },
// ])

const targetList = ref([]) // 初始化为一个空数组

const getTargetList = async () => {
  try {
    const response = await api.get('/industry_list') // 使用你的API端点
    targetList.value = response.data.data.map(item => ({
      label: item, // 使用你的字段名
      value: item  // 使用你的字段名
    }))
  } catch (error) {
    console.error('Failed to fetch target list:', error)
    // 可以在这里添加一些错误处理逻辑，例如显示一个错误消息给用户
  }
}

getTargetList()

let timeValue = ref(['2023-09-01', '2023-09-28'])
let sector1 = ref('总计')
let sector2 = ref('银行')
let obj = {
sector1,
sector2
}
const targetChange = ()=>{
// allParamChange()

emit('allParamChange', obj)
}

emit('allParamChange', obj)

const xData = ref([])
const getXdata = async () => {
  let res = await api.get('/industry_list')//这边写获取x轴坐标的数据
  // let res = await api.get('/catergory_list')
  xData.value = res.data.data // x 轴的数据
  console.log('xData.value :>> ', xData.value);
  let options = myOption.value
  options.xAxis.data = xData.value
  myChart.setOption(options, {
    notMerge: true //不和之前的option合并
  })
}

// getXdata()
const myOption = ref({
  // color: ['#c0504d', '#4f81bd'], // 设置柱状图的颜色，分别对应红色和蓝色
  legend: {
    data:   props.echartsLegend // 设置图例的数据
  },
    tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
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
  xAxis: {
    type: 'time',
    //   min:'Thu, 02 Jan 2020 00:00:00 GMT',
    //   max:"Tue, 01 Sep 2020 00:00:00 GMT",
    min: new Date(timeValue.value[0].replace(/-/g, '/')),
    max: new Date(timeValue.value[1].replace(/-/g, '/')),
    axisLabel: {
      rotate: 45
    }
  },
  yAxis: {
    type: 'value'
  },
  series: props.mySeries
})

const changeTime = (value) => {
  //当时间改变时，myOption中的xAxis的min和max也要改变，重新渲染echarts
  let stime = value[0]
  let etime = value[1]
  let myOptions = myOption.value

  myOptions.xAxis.min = new Date(stime.replace(/-/g, '/'))
  myOptions.xAxis.max = new Date(etime.replace(/-/g, '/'))
  let myChart = echarts.init(document.getElementById(uid.value))
  myChart.setOption(myOptions, {
    notMerge: true //不和之前的option合并
  })
}

// 因为是封装的组件，会多次调用，id不能重复，要在初始化之前写，不然会报错dom为定义
let uid = ref('')
onBeforeMount(() => {
  uid.value = `echarts-uid-${parseInt((Math.random() * 1000000).toString())}`
})
onMounted(() => {
  let myChart = echarts.init(document.getElementById(uid.value))
  // 在template中可以直接取props中的值，但是在script中不行，因为script是在挂载之前执行的
  // let myOption = myOption.value
  console.log('testmyOption :>> ', myOption.value)
  myChart.setOption(myOption.value, {
    notMerge: true //不和之前的option合并
  })

  // 监听页面的大小
  window.addEventListener('resize', () => {
    setTimeout(() => {
      myChart?.resize({
        animation: {
          duration: 300
        }
      })
    }, 300)
  })
})
//监听props中myOption的变化，变化的话重新渲染echarts
watch(
  () => props.mySeries,
  (newVal, oldVal) => {
    let myChart = echarts.init(document.getElementById(uid.value))
    // let myOptions = my
    myOption.value.legend.data =  props.echartsLegend
    myOption.value.series = newVal
    // myOption.value.xAxis.data = props.xData
    myChart.setOption(myOption.value, {
      notMerge: true //不和之前的option合并
    })
  }
)
watch(
  () => props.xData,
  (newVal, oldVal) => {
    let myChart = echarts.init(document.getElementById(uid.value))
    // let myOptions = my
    // myOption.value.series = newVal
    myOption.value.xAxis.data = newVal
    myChart.setOption(myOption.value, {
      notMerge: true //不和之前的option合并
    })
  }
)




</script>

<style scoped>
.echarts-box {
  background-color: #ffffff;
  border-radius: 8px;
  width: 32%;
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
