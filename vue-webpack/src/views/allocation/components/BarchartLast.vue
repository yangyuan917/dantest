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
  api_url: {// 传入的接口名称
    type: String,
    default: ''
  }
})
const father_date = inject('father_date') || '';
watch(father_date, (newValue, oldValue) => {//监听父组件-时间控件改变
  start_date.value = father_date.value.father_start_date
  end_date.value = father_date.value.father_end_date
  getAllData()
}, { deep: true });//深层次监听
//时间控件相关
const start_date = ref('')
start_date.value = father_date.value.father_start_date || ''
const end_date = ref('')
end_date.value = father_date.value.father_end_date || ''

const startDateChange = (val) => {//开始时间改变
  getAllData()
}
const endDateChange = (val) => {//结束时间改变
  getAllData()

}


const xData = ref([])
const mySeries = ref([])
const myOption = ref({
  // color: ['#c0504d', '#4f81bd'], // 设置柱状图的颜色，分别对应红色和蓝色
  legend: {
    data: [start_date.value, end_date.value] // 设置图例的数据
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
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
  series: mySeries.value
})
const getAllData = async () => {//所有的数据请求都在这里，区别就是接口不同，要求返回的格式必须相同,后续后端其他接口改造完，可用这个组件统一

  let params = {
    start_date: start_date.value,
    end_date: end_date.value
  }
  let res = await api.get(props.api_url, { params })
  res = res.data
  if (!res.data) {
    return
  }
  mySeries.value = res.data.series.map(item => {
    item.type = 'bar'
    return item
  })

  xData.value = res.data.xaxis
  myOption.value.legend.data = [start_date.value, end_date.value]
  myOption.value.series = mySeries.value
  myOption.value.xAxis.data = xData.value

}
getAllData()
</script>

<style scoped>
.echarts-box {
  background-color: #ffffff;
  border-radius: 8px;
  /* width: 33.3% */;
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
