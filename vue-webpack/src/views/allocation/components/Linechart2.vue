<template>
  <div class="echarts-box">
    <div class="title-box">
      <div class="time-title">
        <div>
          {{ title }}
        </div>
        <div class="time">
          <div>
            <el-select v-model="target" @change="targetChange" v-if="showTarget" placeholder="请选择指标"  style="max-width: 180px">
              <el-option v-for="item in targetList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <el-date-picker v-model="start_date" type="date" @change="startDateChange" value-format="YYYY-MM-DD"
            style="max-width: 200px" placeholder="请选择开始日期" />
          <el-date-picker v-model="end_date" type="date" @change="startDateChange" value-format="YYYY-MM-DD"
            style="max-width: 200px" placeholder="请选择结束日期" />
        </div>
      </div>
      <div class="line"></div>
    </div>
    <div class="all-box">
      <div class="left-item">
        <el-checkbox-group v-model="selectedOptions" @change="checkChange">
          <el-checkbox v-for="option in checkboxOptions" :key="option.value" :label="option.value"
            :disabled="selectedOptions.length === 5 && !selectedOptions.includes(option.value)">
            {{ option.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <!-- <div :id="uid" :style="myStyle" class="echarts"></div> -->
    <BaseEcharts :echartsOption="myOption" />

    </div>
  </div>
</template>
<script setup>
import { onMounted, onBeforeMount, ref, onBeforeUnmount, onUnmounted, watch, inject } from 'vue'
import * as echarts from 'echarts'
import { api } from '@/utils/api';
import BaseEcharts from '@/components/BaseEcharts.vue'

const emit = defineEmits(['timeChange', 'allParamChange'])
const props = defineProps({
  title: {
    type: String,
    default: '标题'
  },
  showTarget: {//是否显示指标
    type: Boolean,
    default: false
  },
  father_start_date: {//父组件下拉框的开始时间值
    type: String,
    default: ''
  },
  father_end_date: {//父组件下拉框的结束时间值
    type: String,
    default: ''
  },
  mySeries: {
    type: Object,
    default: () => ({}),
    required: true
  }
})


const selectedOptions = ref([]) // 保存被选中的选项的数组
const checkboxOptions = ref([
])
const getCheckboxOptions = async () => {
  // let res = await api.get('/list/cat')
   let res = await api.get('/list/indus')
  checkboxOptions.value = []
  // checkboxOptions.value = res.data.data //这里获取数据
  res.data.data.map(item => {
    let obj = {
      label: item, value: item
    }
    checkboxOptions.value.push(obj)
  })
  selectedOptions.value = res.data.data.slice(0, 4)
  allobj.selectedOptions = selectedOptions.value
  emit('allParamChange', allobj)

}
getCheckboxOptions()

const checkChange = (val) => {
  allobj.selectedOptions = val
  emit('allParamChange', allobj)
}

//时间控件相关
const startDateChange = (val)=>{//开始时间改变
  timeChangeResize()

}
const endDateChange = (val)=>{//结束时间改变
  timeChangeResize()

}
const father_date = inject('father_date');
watch(father_date, (newValue, oldValue) => {//监听父组件-时间控件改变
  start_date.value = father_date.value.father_start_date
  end_date.value = father_date.value.father_end_date
  changeDateTime()
  timeChangeResize()

}, { deep: true });//深层次监听

const start_date = ref('')
start_date.value = father_date.value.father_start_date
const end_date = ref('')
end_date.value = father_date.value.father_end_date
const changeDateTime = () => {
  //选择时间改变时，向父组件传事件
  emit('allParamChange', allobj)
}
changeDateTime()


const timeChangeResize = ()=>{//时间改变时，重置x轴的时间控件
   let stime = start_date.value
  let etime = end_date.value
  let myOptions = myOption.value
  myOptions.xAxis.min = new Date(stime.replace(/-/g, '/'))
  myOptions.xAxis.max = new Date(etime.replace(/-/g, '/'))

}


// 指标
const target = ref('')
let targetList = ref([
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

const getTargetList = async () => {
  let params = {}
  // let res  =   await api.get('/operation',{params})
  // targetList.value = res.xxx 这里获取数据

}

getTargetList()


const targetChange = (val) => {//指标改变
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
  // dataZoom: [
  //   // 添加数据区域缩放组件，即滚动条
  //   {
  //     show: true,
  //     type: 'slider',
  //     top: '90%',
  //     bottom: '4%',
  //     start: 0,
  //     end: 100
  //   }
  // ],
  xAxis: {
    type: 'time',
    //   min:'Thu, 02 Jan 2020 00:00:00 GMT',
    //   max:"Tue, 01 Sep 2020 00:00:00 GMT",
    min: new Date(start_date.value.replace(/-/g, '/')),
    max: new Date(end_date.value.replace(/-/g, '/')),
    axisLabel: {
      rotate: 45
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
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
    myOption.value.legend.data = [...selectedOptions.value]
    myOption.value.series = newVal

  }
)
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

.all-box {
  display: flex;
}

.left-item {
  width: 120px;
  /* background- color: #C52C2C; */
  /* height: 100%; */

  max-height: 360px;
  overflow-y: scroll;
  overflow-x: hidden;
  margin-left: 20px;
}

.echarts {
  padding: 20px;
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
