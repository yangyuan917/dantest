<template>
  <div class="echarts-box">
    <div class="title-box">
      <div class="time-title">
        <div>
          {{ title }}
        </div>
        <!-- 改一下class -->
        <div class="sector">
          <el-select v-model="sector1" @change="targetChange" style="max-width: 120px" v-if="showTarget" placeholder="请选择行业">
            <el-option v-for="item in targetList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="sector2" @change="targetChange"  style="max-width: 120px" v-if="showTarget" placeholder="请选择行业">
            <el-option v-for="item in targetList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="time">


 <el-date-picker size="mini" v-model="start_date" type="date" @change="startDateChange" value-format="YYYY-MM-DD"
            style="max-width: 160px" placeholder="请选择开始日期" />
          <el-date-picker size="mini" v-model="end_date" type="date" @change="endDateChange" value-format="YYYY-MM-DD"
            style="max-width: 160px" placeholder="请选择结束日期" />

        </div>
      </div>
      <div class="line"></div>
    </div>
    <!-- <div :id="uid" :style="myStyle" class="echarts"></div> -->
    <BaseEcharts :echartsOption="myOption" />
      <div class="line"></div>

  </div>
</template>
<script setup>
import { onMounted, onBeforeMount, ref, onBeforeUnmount, onUnmounted, watch,inject } from 'vue'
import BaseEcharts from '@/components/BaseEcharts.vue'
import {lastMonthDay} from '@/utils/util'

import * as echarts from 'echarts'
const emit = defineEmits(['allParamChange'])
import { api } from '@/utils/api';

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
//时间控件相关
const startDateChange = (val)=>{//开始时间改变
  timeChangeResize()

}
const endDateChange = (val)=>{//结束时间改变
  timeChangeResize()

}
const father_date = inject('father_date');
watch(father_date, (newValue, oldValue) => {//监听父组件-时间控件改变
  start_date.value =lastMonthDay(father_date.value.father_start_date)
  end_date.value = father_date.value.father_end_date
  timeChangeResize()

}, { deep: true });//深层次监听

const start_date = ref('')
start_date.value = lastMonthDay(father_date.value.father_start_date)
const end_date = ref('')
end_date.value = father_date.value.father_end_date

const timeChangeResize = ()=>{//时间改变时，重置x轴的时间控件
   let stime = start_date.value
  let etime = end_date.value
  let myOptions = myOption.value
  myOptions.xAxis.min = new Date(stime.replace(/-/g, '/'))
  myOptions.xAxis.max = new Date(etime.replace(/-/g, '/'))

}


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
    const response = await api.get('/list/indus') // 使用你的API端点
    targetList.value = response.data.data.map(item => ({
      label: item, // 使用你的字段名
      value: item  // 使用你的字段名
    }))
    targetList.value.unshift({
      label: '总计',
      value: '总计'
    })
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
const targetChange = () => {
  // allParamChange()

  emit('allParamChange', obj)
}

emit('allParamChange', obj)

const xData = ref([])

const myOption = ref({
  // color: ['#c0504d', '#4f81bd'], // 设置柱状图的颜色，分别对应红色和蓝色
  legend: {
    data: props.echartsLegend // 设置图例的数据
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
    min: new Date( start_date.value.replace(/-/g, '/')),
    max: new Date(end_date.value.replace(/-/g, '/')),
    axisLabel: {
      rotate: 45
    }
  },
  yAxis: {
    type: 'value'
  },
  series: props.mySeries
})



//监听props中myOption的变化，变化的话重新渲染echarts
watch(
  () => props.mySeries,
  (newVal, oldVal) => {
    // let myChart = echarts.init(document.getElementById(uid.value))
    // let myOptions = my
    myOption.value.legend.data = props.echartsLegend
    myOption.value.series = newVal
    // myOption.value.xAxis.data = props.xData

  }
)
watch(
  () => props.xData,
  (newVal, oldVal) => {
    // let myChart = echarts.init(document.getElementById(uid.value))
    // let myOptions = my
    // myOption.value.series = newVal
    myOption.value.xAxis.data = newVal

  }
)




</script>

<style scoped>
.echarts-box {
  background-color: #ffffff;
 /* border-radius: 8px; */
 /* width: 32.5%; */;
}

.title-box {
  padding: 20px;
  padding-bottom: 4px;
  /* font-size: 20px; */
  font-size: 1vw;
  font-family: PingFang SC;
  font-weight: bold;
  /* color: #262626; */

   color: #C00000;
}

.time-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 一条灰色的线，高1px */

.echarts {
  /* padding: 20px; */
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
.sector{
max-width: 120px;
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
