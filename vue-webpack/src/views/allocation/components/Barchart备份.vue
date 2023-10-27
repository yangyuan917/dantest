<template>
  <div class="echarts-box">
    <div class="title-box">
      <div class="time-title">
        <div>
          {{ title }}
        </div>
        <div class="time">
          <el-date-picker v-model="start_date" type="date" @change="startDateChange" value-format="YYYY-MM-DD"
            style="max-width: 200px" placeholder="请选择开始日期" />
          <el-date-picker v-model="end_date" type="date" @change="endDateChange" value-format="YYYY-MM-DD"
            style="max-width: 200px" placeholder="请选择结束日期" />
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
  mySeries: {
    type: Object,
    default: () => ({}),
    required: true
  },
  xData: {
    type: Array,
    default: () => ([]),

  },
})

const father_date = inject('father_date')||'' ;
console.log('333father_date :>> ', father_date);
watch(father_date, (newValue, oldValue) => {//监听父组件-时间控件改变
  start_date.value = father_date.value.father_start_date
  end_date.value = father_date.value.father_end_date
changeDateTime()
}, { deep: true });//深层次监听
//时间控件相关
const start_date = ref('')
start_date.value = father_date.value.father_start_date||''
const end_date = ref('')
  end_date.value = father_date.value.father_end_date||''
const changeDateTime = () => {
  //选择时间改变时，向父组件传事件
  let start_date_and_end_date = {
    start_date: start_date.value,
    end_date: end_date.value
  }
  emit('timeChange', start_date_and_end_date)
}
changeDateTime()



const startDateChange = (val)=>{//开始时间改变
    changeDateTime()
}
const endDateChange = (val)=>{//结束时间改变
    changeDateTime()
}
watch(//监听下拉框
  () => props.separate_name,
  (newVal, oldVal) => {
    changeDateTime()

  }
)

// getDateTime()
const xData = ref([])
const myOption = ref({
  // color: ['#c0504d', '#4f81bd'], // 设置柱状图的颜色，分别对应红色和蓝色
  legend: {
    // data: [start_date.value, end_date.value] // 设置图例的数据
    data: ['2023-09-02','2023-10-19'] // 设置图例的数据
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },

  xAxis: {
    type: 'category',
    data:  props.xData, // x 轴的数据
    axisLabel: {
      rotate: 45
    }
  },
  yAxis: {
    type: 'value'
  },
  series: props.mySeries
})
console.log('myOption1111111111', myOption)
//监听props中myOption的变化，变化的话重新渲染echarts
watch(
  () => props.mySeries,
  (newVal, oldVal) => {
    myOption.value.legend.data = [start_date.value, end_date.value]
    myOption.value.series = newVal
    myOption.value.xAxis.data = props.xData
  }
)


watch(
  () => props.xData,
  (newVal, oldVal) => {
    myOption.value.legend.data = [start_date.value, end_date.value]
    myOption.value.xAxis.data = newVal
  }
)




</script>

<style scoped>
.echarts-box {
  background-color: #ffffff;
  border-radius: 8px;
 width: 33.3%;
}

.title-box {
  padding: 20px;
  padding-bottom: 4px;
  /* font-size: 20px; */
  font-size: 1vw;
  font-family: PingFang SC;
  font-weight: bold;
  /* color: #262626; */

   color: #C52C2C;
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
