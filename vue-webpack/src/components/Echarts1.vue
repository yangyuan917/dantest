<template>
  <div class="echarts-box">
    <div class="table">
      <el-switch v-model="switchVale" @change="switchValeChange" style="float: right;"></el-switch>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column v-for="item in columns" :prop="item.props" :label="item.label" />
      </el-table>
    </div>
    <div class="title-box">
      <div class="time-title">
        <div>
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
import {api0} from '@/utils/api';
import io from 'socket.io-client';

import * as echarts from 'echarts';
const switchVale = ref(true)
const tableData = ref([
  {
    name: '最新收盘',
    data1: '',
    data2: '',
    data3: '',
    data4: '',
    data5: '',
    data6: '',
    data7: '',

  },
  {
    name: '当前价',
    data1: '',
    data2: '',
    data3: '',
    data4: '',
    data5: '',
    data6: '',
    data7: '',

  },

])
const columns = [
  { props: 'name', label: '' },
  { props: 'data1', label: '2日回撤' },
  { props: 'data2', label: '5日回撤' },
  { props: 'data3', label: '20日回撤' },
  { props: 'data4', label: '2日分位' },
  { props: 'data5', label: '5日分位' },
  { props: 'data6', label: '20日分位' },
]
const emit = defineEmits(['timeChange']);
let timeValue = ref([
  "2023-01-01",
  "2023-08-25",
]);




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
const selectedTarget = props.selectedTarget
let start_date = props.start_date;

function getLastValue(obj) {
  var keys = Object.keys(obj);
  var lastKey = keys[keys.length - 1];
  var lastValue = obj[lastKey];
  return lastValue;
}

// let url = 'https://wmrisk-8806-60067-10-1319347086.sh.run.tcloudbase.com'
let url = 'http://localhost:8801'
const socket = io(url);
let dataList = ref([])
const ioMsg = () => {//这边获取第二排数据
  socket.on('connected', data => {
    // this.message = data.message;
    console.log('Connected')
  });

  socket.on('data2', data => {
    dataList.value.push(data);
    console.log('testres :>> ', data)
    tableData.value[1].data4 = data.dy_downside_2['0']
    tableData.value[1].data5 = data.dy_downside_5['0']
    tableData.value[1].data6 = data.dy_downside_20['0']
  });
}

ioMsg()

//监听props中selectedTarget和start_date的变化，变化的话去请求数据
watch(
  () => props.selectedTarget,
  (newVal, oldVal) => {
  console.log('监听props中selectedTarget :>> ', );
    getData_scores_short1(newVal,props.start_date)
  }
);
watch(
  () => props.start_date,
  (newVal, oldVal) => {
    getData_scores_short1(props.selectedTarget, newVal);
    socket.emit('selectedTarget', props.start_date);
  }
);



const getData_scores_short1 = async (selectedTarget, start_date) => { //获取对应的数据-获取第一排数据

  let res = await api0.get('/scores_short?target=' + selectedTarget)
  res = res.data
  console.log('555555555555res :>> ', res);
  let keys1 = getLastValue(res.data.dy_downside_2)
  let keys2 = getLastValue(res.data.dy_downside_5)
  let keys3 = getLastValue(res.data.dy_downside_20)


  tableData.value[0].data1 = keys1

  tableData.value[0].data2 = keys2
  tableData.value[0].data3 = keys3
  let data = await api0.get('/scores_short1?target=' + selectedTarget + '&start_date=' + start_date)
  data = data.data;
  // this.dy_downside = data.data
  tableData.value[0].data4 = data.data.dy_downside_2
  tableData.value[0].data5 = data.data.dy_downside_5
  tableData.value[0].data6 = data.data.dy_downside_20

}
getData_scores_short1(selectedTarget, timeValue.value[1])


const switchValeChange = (value) => {//开关改变时，
  console.log('switchValeChange :>> ', value);
  // emit('switchValeChange', value)
   if (value) {
      socket = io('http://localhost:8801', {
        cors: {
          origin: '*',
          methods: ['GET', 'POST']
        }
      });
    } else {
    console.log('关闭socket :>> ', );
      socket.close();
    }
}

//监听switchVale的值，来决定socken的打开与关闭
watch(
  () => switchVale,
  (newVal) => {
    console.log('switchVale的值newVal :>> ', newVal);
    if (newVal) {
      socket = io('http://localhost:8801', {
        cors: {
          origin: '*',
          methods: ['GET', 'POST']
        }
      });
    } else {
      socket.close();
    }


  }
)





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
selectedTarget: {
  type: String,
  default: '',
},
start_date: {
  type: String,
  default: '',
},
  myStyle: {
    type: Object,
    default: () => ({
      // width: '600px',
      // height: '400px',
    }),
  },
  isOpen: {//是打开了开关
    type: Boolean,
    default: false
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
  border-radius: 8px;
 width: 33.3%;
}

.table {
  height: 143px;

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
  background-color: #E5E5E5;
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
  aspect-ratio: 26/9;
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
</style>
