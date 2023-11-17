<template>
  <div class="echarts-box">
    <div class="title-box">
      <div class="time-title">
        <div>
          {{ title }}
        </div>
        <div class="time" v-if="timeType=='daterange'">
          <el-date-picker size="mini" v-model="timeValue" type="daterange" @change="changeTime" value-format="YYYY-MM-DD"
            range-separator="-" start-placeholder="请选择开始日" end-placeholder="请选择结束日" style="max-width: 240px;" />
        </div>
        <!-- <div class="time" v-if="timeType=='date'">
          <el-date-picker size="mini" v-model="datetimeValue" type="date"  @change="changeDateTime" value-format="YYYY-MM-DD" placeholder="请选择日期"  />
        </div> -->
      <div class="time" v-if="timeType=='date'">
        <el-select v-model="selectedTarget" class="m-2" placeholder="Select" @change="changeSelectedTarget" style="max-width: 120px;">
          <el-option value="600036.SH">600036.SH</el-option>
          <el-option value="NDX.GI">NDX.GI</el-option>
        </el-select>
        <el-date-picker size="mini" v-model="start_date" type="date" @change="changeDateTime" value-format="YYYY-MM-DD" style="max-width: 155px;"
          placeholder="请选择日期" />
      </div>
      </div>
      <div class="line"></div>

    </div>


    <div :id="uid" :style="myStyle" class="echarts"></div>
  </div>
  <!-- <div class="title-box">
      <div class="title"> 标题 </div>

    </div> -->
</template>
<script setup>
import { onMounted, onBeforeMount, ref, onBeforeUnmount, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
const emit = defineEmits(['timeChange']);
const props = defineProps({
  myStyle: {
    type: Object,
    default: () => ({
      // width: '600px',
      // height: '400px',
    }),
  },
  timeType: {
    type: String,
    default: 'daterange',
  },
  title: {
    type: String,
    default: '标题',
  },
  myOption: {
    type: Object,
    default: () => ({}),
    required: true,
  },
});

const selectedTarget = ref('');
const start_date = ref('');

// let timeValue = ref([
//   "2020-01-01",
//   "2023-08-29"
// ]);
let timeValue = ref([
  "2023-01-01",
  "2023-08-25",
]);


const changeTime = (value) => {//当时间改变时，myOption中的xAxis的min和max也要改变，重新渲染echarts
  let stime = value[0];
  let etime = value[1];
  let myOption = props.myOption;

  myOption.xAxis.min = new Date(stime.replace(/-/g, "/"));
  myOption.xAxis.max = new Date(etime.replace(/-/g, "/"));
  let myChart = echarts.init(document.getElementById(uid.value));
  myChart.setOption(myOption, {
    notMerge: true, //不和之前的option合并
  });


}

const changeSelectedTarget = (value) => {//下拉选框改变,向父组件传事件
console.log('子组件 :>> ', );
  selectedTarget.value = value;
  let obj = {
    selectedTarget: value,
    start_date: start_date.value,
  }
  emit('timeChange', obj)
}


const changeDateTime = (value)=>{//选择时间改变时，向父组件传事件

  let obj = {
    selectedTarget: selectedTarget.value,
    start_date: start_date.value,
  }
  emit('timeChange', obj)


}

// 因为是封装的组件，会多次调用，id不能重复，要在初始化之前写，不然会报错dom为定义

let uid = ref('');
onBeforeMount(() => {
  uid.value = `echarts-uid-${parseInt((Math.random() * 1000000).toString())}`;
});



onMounted(() => {
  let myChart = echarts.init(document.getElementById(uid.value));
  // 在template中可以直接取props中的值，但是在script中不行，因为script是在挂载之前执行的
  myChart.setOption(props.myOption, {
    notMerge: true, //不和之前的option合并
  });

  // 监听页面的大小
  window.addEventListener('resize', () => {
    setTimeout(() => {
      myChart?.resize({
        animation: {
          duration: 300,
        },
      });
    }, 300);
  });
});


//监听props中myOption的变化，变化的话重新渲染echarts
watch(
  () => props.myOption,
  (newVal, oldVal) => {
    let myChart = echarts.init(document.getElementById(uid.value));

    let myOption = newVal;
    let stime = timeValue.value[0];
    let etime = timeValue.value[1];
    myOption.xAxis.min = new Date(stime.replace(/-/g, "/"));
    myOption.xAxis.max = new Date(etime.replace(/-/g, "/"));

    myChart.setOption(myOption, {
      notMerge: true, //不和之前的option合并
    });
  }
);


</script>

<style scoped>
.echarts-box {
  background-color: #ffffff;
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

.item {
  flex: 1;
  min-width: calc(33.33% - 20px);
  /* background-color: #f4f4f4; */
  background-color: #f4f4f4;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
}

.time{
display: flex;
justify-content: center;
}
</style>
