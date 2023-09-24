<template>
  <div class="echarts-box">
    <div class="title-box">
      <div class="time-title">
        <div>
          {{ title }}
        </div>
        <div class="time">
          <el-date-picker
            v-model="start_date"
            type="date"
            @change="changeDateTime"
            value-format="YYYY-MM-DD"
            style="max-width: 240px"
            placeholder="请选择开始日期"
          />
          <el-date-picker
            v-model="end_date"
            type="date"
            @change="changeDateTime"
            value-format="YYYY-MM-DD"
            style="max-width: 240px"
            placeholder="请选择结束日期"
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
const emit = defineEmits(['timeChange'])
import api from '@/utils/api';

const props = defineProps({
  myStyle: {
    type: Object,
    default: () => ({
      // width: '600px',
      // height: '400px',
    })
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
  xData:{
    type: Array,
    default: () => ([]),

  },
  // myOption: {
  //   type: Object,
  //   default: () => ({}),
  //   required: true,
  // },
})

const start_date = ref('')
const end_date = ref('2023-09-23')

const xData =ref([])
const  getXdata = async()=>{
let res = await api.get('/catergory_list')//这边写获取x轴坐标的数据
// let res = await api.get('/catergory_list')
  xData.value =res.data.data // x 轴的数据
  console.log('xData.value :>> ', xData.value);
  let options = myOption.value
 options.xAxis.data =  xData.value
   myChart.setOption(options, {
    notMerge: true //不和之前的option合并
  })
}

getXdata()
const myOption = ref({
  // color: ['#c0504d', '#4f81bd'], // 设置柱状图的颜色，分别对应红色和蓝色
  legend: {
    data: [start_date.value, end_date.value] // 设置图例的数据
  },
  xAxis: {
    type: 'category',
    data: xData.value, // x 轴的数据
    axisLabel: {
      rotate: 45
    }
  },
  yAxis: {
    type: 'value'
  },
  series: props.mySeries
})

const changeDateTime = (value) => {
  //选择时间改变时，向父组件传事件
  let obj = {
    start_date: start_date.value,
    end_date: end_date.value
  }
  emit('timeChange', obj)
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
  console.log('myOption :>> ', myOption.value)
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
    myOption.value.legend.data = [start_date.value, end_date.value]
    myOption.value.series = newVal
     myOption.value.xAxis.data = props.xData
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
    myOption.value.legend.data = [start_date.value, end_date.value]
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
