<template>
    <div :id="uid" :style="myStyle" class="echarts"></div>
</template>

<script  setup>
//这是基础的echarts
import {reactive,ref,onBeforeMount,onMounted ,watch} from "vue"
import * as echarts from 'echarts'

const props = defineProps({
 echartsOption:{//父组件传过来的配置项
 type:Object,
 default:{

 },
 },

})

watch(props.echartsOption, (newValue, oldValue) => {//监听父组件 -每当有参数传进时改变时
 myOption.value = props.echartsOption
  // myChart.setOption(baseOption, {
  // })
  myChart.setOption(myOption.value, {
  })

}, { deep: true });//深层次监听
const myOption = ref({//基础配置相关

})

let baseOption = {//基础配置，所有图都要

    tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
}
myOption.value = props.echartsOption
// 因为是封装的组件，会多次调用，id不能重复，要在初始化之前写，不然会报错dom为定义
let uid = ref('')
onBeforeMount(() => {
  uid.value = `echarts-uid-${parseInt((Math.random() * 1000000).toString())}`
})
  let myChart = ''

onMounted(() => {
myChart =  echarts.init(document.getElementById(uid.value))
  myChart.setOption(baseOption, {
    // notMerge: true //不和之前的option合并
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

</script>

<style  scoped>

.echarts {
  padding: 20px;
  padding-bottom: 6px;
  box-sizing: border-box;
  text-align: center;
  width: 60%;
  flex: 1;
  height: auto;
  aspect-ratio: 16/12;
}

</style>
