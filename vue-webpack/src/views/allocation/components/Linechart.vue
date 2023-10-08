<template>
  <div class="echarts-box">
    <div class="title-box">
      <div class="time-title">
        <div>
          {{ title }}
        </div>
        <div class="time">
          <el-select v-model="target" @change="targetChange" v-if="showTarget" placeholder="请选择指标">
            <el-option
              v-for="item in targetList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
    <div class="all-box">
      <div class="left-item">
        <el-checkbox-group v-model="selectedOptions" @change="checkChange">
          <el-checkbox
            v-for="option in checkboxOptions"
            :key="option.value"
            :label="option.value"
            :disabled="selectedOptions.length === 5 && !selectedOptions.includes(option.value)"
          >
            {{ option.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div :id="uid" :style="myStyle" class="echarts"></div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, onBeforeMount, ref, onBeforeUnmount, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import api from '@/utils/api';

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
const selectedOptions = ref([]) // 保存被选中的选项的数组
const checkboxOptions = ref([

])

const getCheckboxOptions = async()=>{

let res = await api.get('/catergory_list')
checkboxOptions.value = []
// checkboxOptions.value = res.data.data //这里获取数据
res.data.data.map(item=>{
let obj = {
label:item,value:item
}
checkboxOptions.value.push(obj)
})
selectedOptions.value = res.data.data.slice(0,4)
allobj.selectedOptions = selectedOptions.value
console.log('allobj111 :>> ', allobj);
  emit('allParamChange', allobj)

}
getCheckboxOptions()

const checkChange = (val) => {
  allobj.selectedOptions = val
  console.log('allobj :>> ', allobj);
  emit('allParamChange', allobj)
  console.log('selectedOptions :>> ', selectedOptions.value)
}

const start_date = ref('')
const end_date = ref('2023-09-28')
let timeValue = ref(['2023-09-01', '2023-09-28'])


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

const getTargetList = async()=>{
let params = {}
// let res  =   await api.get('/operation',{params})
// targetList.value = res.xxx 这里获取数据

}

getTargetList()


const targetChange  = (val)=>{//指标改变
allobj.target = val
emit('allParamChange', allobj)
}

let allobj = {
  start_date: timeValue.value[0],
  end_date: timeValue.value[1],
  target:target.value,
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
  // xAxis: {
  //   type: 'category',
  //   data: ['城投债券', '同业存单', '现金', '同业借款', '金融债'], // x 轴的数据
  //   axisLabel: {
  //     rotate: 45
  //   }
  // },
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
    console.log('myOption :>> ', myOption.value)
    myOption.value.legend.data = [...selectedOptions.value]
    myOption.value.series = newVal
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
.all-box {
  display: flex;
}
.left-item {
  width: 120px;
  /* background-color: red; */
  /* height: 100%; */

  max-height: 400px;
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
