<template>
  <div class="echarts-box">
    <div class="title-box">
      <div>{{ title }}</div>
      <div class="line"></div>

    </div>
    <div style="text-align: right;">
        <el-select v-model="start_date" style="margin-right: 20px;width: 160px;" class="m-2" @change="handleSelectChange" placeholder="Select">
      <el-option v-for="item in timeOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
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
let start_date = ref('2021-01-01');
let timeOptions = ref([
  {
    value: '2023-1-1',
    label: '2023-1-1',
  },
  {
    value: '2023-3-1',
    label: '2023-3-1',
  },

])
const handleSelectChange = (value)=>{
let obj = {
value:value,
name:props.title
}
  emit('timeChange',obj)

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
const props = defineProps({
  myStyle: {
    type: Object,
    default: () => ({
      width: '600px',
      height: '400px',
    }),
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

//监听props中myOption的变化，变化的话重新渲染echarts
watch(
  () => props.myOption,
  (newVal, oldVal) => {
    let myChart = echarts.init(document.getElementById(uid.value));
    myChart.setOption(newVal, {
      notMerge: true, //不和之前的option合并
    });
  }
);


</script>

<style scoped>
.echarts-box {
  background-color: #ffffff;
  border-radius: 8px;

}

.title-box {
  padding: 20px;
  padding-bottom: 4px;
  font-size: 20px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #262626;
}

/* 一条灰色的线，高1px */
.line {
  height: 1px;
  background-color: #E5E5E5;
  margin-top: 10px;
  margin-bottom: 10px;



}

.echarts {
  padding: 20px;
  padding-bottom: 6px;
  box-sizing: border-box;
  text-align: center;
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
}</style>