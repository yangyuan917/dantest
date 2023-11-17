<template>
  <div class="echarts-box">
    <div class="title-box">
      <div class="time-title">
        <div>
          {{ title }}
        </div>
        <div class="time">
          <el-select v-model="target" @change="targetChange" v-if="showTarget" placeholder="请选择指标"
            style="max-width: 130px">
            <el-option v-for="item in targetList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <!-- <el-date-picker size="mini" v-model="timeValue" type="daterange" @change="changeTime" value-format="YYYY-MM-DD"
            range-separator="-" start-placeholder="请选择开始日" end-placeholder="请选择结束日" style="max-width: 240px" /> -->
          <el-date-picker size="mini" v-model="start_date" type="date" @change="startDateChange" value-format="YYYY-MM-DD"
            style="max-width: 155px" placeholder="请选择开始日期" />
          <el-date-picker size="mini" v-model="end_date" type="date" @change="endDateChange" value-format="YYYY-MM-DD"
            style="max-width: 155px" placeholder="请选择结束日期" />

        </div>
      </div>
      <div class="line"></div>
    </div>
    <div class="all-box">
      <div class="left-item">
        <el-checkbox-group v-model="selectedOptions" @change="checkChange">
          <el-checkbox v-for="option in checkboxOptions" :key="option.value" :label="option.value"
            :disabled="selectedOptions.length === 1 && !selectedOptions.includes(option.value)">
            {{ option.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <!-- <div :id="uid" :style="myStyle" class="echarts"></div> -->
      <BaseEcharts :echartsOption="myOption" />
      <div class="line"></div>

    </div>
  </div>
</template>
<script setup>
import { onMounted, onBeforeMount, ref, onBeforeUnmount, onUnmounted, watch, inject } from 'vue'
import BaseEcharts from '@/components/BaseEcharts.vue'
import {lastMonthDay} from '@/utils/util'

import * as echarts from 'echarts'
import { api } from '@/utils/api';


const emit = defineEmits(['timeChange', 'allParamChange'])
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
  showTarget: {
    type: Boolean,
    default: false
  },
  mySeries: {
    type: Object,
    default: () => ({}),
    required: true
  }
  // myOption: {
  //   type: Object,
  //   default: () => ({}),
  //   required: true,
  // },
})
const selectedOptions = ref(['同业存单']) // 保存被选中的选项的数组


const checkboxOptions = ref([{ label: '金融债', value: '金融债' }]);

// let res = await api.get('//list/cat')

const fetchOptions = () => {
  api.get('/list/cat')
    .then(response => {
      console.log('response.data.data :>> ', response.data.data);
      checkboxOptions.value = response.data.data.map(option => ({
        label: option,
        value: option
      }));
      console.log('checkboxOptions after fetch :>> ', checkboxOptions);
    })
    .catch(error => {
      console.error('获取数据失败', error);
    });
};

fetchOptions();

const checkChange = (val) => {
  allobj.selectedOptions = val
  emit('allParamChange', allobj)
  console.log('selectedOptions :>> ', selectedOptions.value)
}


const father_date = inject('father_date') || '';
console.log('333father_date :>> ', father_date);
watch(father_date, (newValue, oldValue) => {//监听父组件-时间控件改变
  start_date.value = lastMonthDay(father_date.value.father_start_date)
  end_date.value = father_date.value.father_end_date
  timeChangeResize()

  changeDateTime()
}, { deep: true });//深层次监听
//时间控件相关
const start_date = ref('')
start_date.value = lastMonthDay(father_date.value.father_start_date)||''
const end_date = ref('')
end_date.value = father_date.value.father_end_date || ''
const changeDateTime = () => {
  //选择时间改变时，向父组件传事件
  // let start_date_and_end_date = {
  //   start_date: start_date.value,
  //   end_date: end_date.value
  // }
  emit('allParamChange', allobj)

}
changeDateTime()

const startDateChange = (val) => {//开始时间改变
  timeChangeResize()
}
const endDateChange = (val) => {//结束时间改变
  timeChangeResize()
}

const timeChangeResize = () => {//时间改变时，重置x轴的时间控件
  let stime = start_date.value
  let etime = end_date.value
  let myOptions = myOption.value
  myOptions.xAxis.min = new Date(stime.replace(/-/g, '/'))
  myOptions.xAxis.max = new Date(etime.replace(/-/g, '/'))

}

// const start_date = ref('')
// const end_date = ref('2023-09-28')

// 指标
const target = ref('yield')
const targetList = ref([
  {
    label: '到期收益率',
    value: 'yield'
  },
  {
    label: '债券修正久期',
    value: 'duration'
  },
  {
    label: '基金久期',
    value: 'fund_duration'
  }
])
const targetChange = (val) => {
  //指标改变
  allobj.target = val
  emit('allParamChange', allobj)
}

let allobj = {
  start_date: start_date.value,
  end_date: end_date.value,
  target: target.value,
  selectedOptions: selectedOptions.value
}

emit('allParamChange', allobj)
//配置
const myOption = ref({
  // color: ['#c0504d', '#4f81bd'], //
  legend: {
    data: [] // 设置图例的数据
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

  tooltip: {
    trigger: 'axis',
    //保留一位小数
    formatter: function (params) {
    console.log('params', params)
      return  params[0].seriesName + ':' + params[0].value[1].toFixed(1) + '<br/>'
       +  params[1].seriesName + ':' + params[1].value[1].toFixed(1)
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  // grid: [
  //      {
  //          bottom: '55%'
  //      },
  //      {
  //          top: '55%'
  //      }
  //  ],
  legend: {
    data: ['柱状图', '折线图']
  },
  xAxis: {
    type: 'time',
    min: new Date(start_date.value.replace(/-/g, '/')),
    max: new Date(end_date.value.replace(/-/g, '/')),
    axisLabel: {
      rotate: 45
    }
  },
  yAxis: [
    {
      type: 'value',
        axisLine: {
        onZero: true
      },
      min: 0,
      // scale: true,
      name: '市值'
    },
    {
      type: 'value',
       axisLine: {
        onZero: true
      },
      min: 0,
      // scale: true,
      name: 'yield'
    }
  ],
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



//监听props中myOption的变化，变化的话重新渲染echarts
watch(
  () => props.mySeries,
  (newVal, oldVal) => {
    myOption.value.legend.data = [...selectedOptions.value]
    myOption.value.series = newVal

  }
)
</script>

<style scoped>
.echarts-box {
  background-color: #ffffff;
 /* border-radius: 8px; */
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


.all-box {
  display: flex;
}

.left-item {
  width: 100px;
  /* background- color: #C00000; */
   max-height: 360px;
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100%;
  margin-left: 20px;
}

.echarts {
  /* padding: 20px; */
  padding-bottom: 6px;
  box-sizing: border-box;
  text-align: center;
  width: 60%;
  flex: 1;
  height: auto;
  aspect-ratio: 16/12;
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
