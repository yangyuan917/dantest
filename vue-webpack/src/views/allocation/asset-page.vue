<template>
  <div class="all-page-flex">
    <div style="width: 100%;">

      <el-date-picker size="mini" v-model="father_start_date" @change="father_date_Chage" type="date" value-format="YYYY-MM-DD"
        style="max-width: 240px" placeholder="请选择开始日期" />
      <el-date-picker size="mini" v-model="father_end_date" @change="father_date_Chage" type="date" value-format="YYYY-MM-DD"
        style="max-width: 240px;margin-right: 6px; " placeholder="请选择结束日期" />
      <el-select v-model="inter_trade" placeholder="是否内部交易" style="width: 80px; margin-right: 16px;">
        <el-option label="否" :value="0"></el-option>
        <el-option label="是" :value="1"></el-option>
      </el-select>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </div>
    <div class="table-box">
      <el-table :data="tableData" height="490" border>
        <el-table-column label="">
          <el-table-column label="分组" align="center" prop="类别1">
            <template #default="scope">
              <div style="margin-left: 10px;color: #409EFF; cursor: pointer; " class="text-title" @click="goDetails(scope.row)">{{
                scope.row.归属资管计划 }}</div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="总计 " align="center">
          <el-table-column label="交易笔数" align="right" prop="symbol2"></el-table-column>
          <el-table-column label="交易金额" align="right" prop="市值(元)"></el-table-column>
        </el-table-column>
        <el-table-column label="加仓 " align="center">
          <el-table-column label="交易笔数" align="right" prop="加仓_symbol2"></el-table-column>
          <el-table-column label="交易金额" align="right" prop="加仓_市值(元)"></el-table-column>
        </el-table-column>
        <el-table-column label="减仓 " align="center">
          <el-table-column label="交易笔数" align="right" prop="减仓_symbol2"></el-table-column>
          <el-table-column label="交易金额" align="right" prop="减仓_市值(元)"></el-table-column>
        </el-table-column>
        <el-table-column label="到期 " align="center">
          <el-table-column label="交易笔数" align="right" prop="到期_symbol2"></el-table-column>
          <el-table-column label="交易金额" align="right" prop="到期_市值(元)"></el-table-column>
        </el-table-column>

      </el-table>
    </div>
    <BarandLinechart :mySeries="lineSeries" @allParamChange="allChange" :showTarget="true"></BarandLinechart>
        <div class="table-box">
      <el-table :data="tableData1" height="490" border>
        <el-table-column label="">
          <el-table-column label="分组" prop="归属资管计划/自主投资基金" >
            <template #default="scope">
              <span style="margin-left: 10px;color: #409EFF; cursor: pointer;" class="text-title1" @click="goDetailstow(scope.row)">{{
               scope.row.归属资管计划}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="总计 " align="center">
          <el-table-column label="交易笔数" align="right" prop="symbol2"></el-table-column>
          <el-table-column label="交易金额" align="right" prop="市值(元)"></el-table-column>
        </el-table-column>
        <el-table-column label="加仓 " align="center">
          <el-table-column label="交易笔数" align="right" prop="加仓_symbol2"></el-table-column>
          <el-table-column label="交易金额" align="right" prop="加仓_市值(元)"></el-table-column>
        </el-table-column>
        <el-table-column label="减仓 " align="center">
          <el-table-column label="交易笔数" align="right" prop="减仓_symbol2"></el-table-column>
          <el-table-column label="交易金额" align="right" prop="减仓_市值(元)"></el-table-column>
        </el-table-column>
        <el-table-column label="到期 " align="center">
          <el-table-column label="交易笔数" align="right" prop="到期_symbol2"></el-table-column>
          <el-table-column label="交易金额" align="right" prop="到期_市值(元)"></el-table-column>
        </el-table-column>

      </el-table>
    </div>
    <!-- <Barchart2 :mySeries="series" :echartsLegend="echartsLegend" @allParamChange="barChange" :showTarget="true">
    </Barchart2> -->

    <BarandLinechart :mySeries="lineSeries1" @allParamChange="allChange1" :showTarget="true"></BarandLinechart>


  </div>
</template>
<script setup>
import { reactive, ref, provide } from 'vue'
import Linechart from './components/Linechart'
import BarandLinechart from './components/BarandLinechart.vue'
import BaseEcharts from '@/components/BaseEcharts.vue'

import Barchart2 from './components/Barchart2.vue'
import { getTodayTime } from '@/utils/util'
import { api } from '@/utils/api'
import { useRouter } from 'vue-router'
const router = useRouter()
import useDate from '@/hooks/useDate'





//----------------获取下拉框--------------------
const separate_name = ref("中信证券增盈1号集合资产管理计划")
const separateNames = ref([]);
const getSeparateNames = async () => {
  const response = await api.get('/list/sep');
  separateNames.value = response.data.data; // 调整这里以匹配你的API响应结构
}
getSeparateNames()
//父组件时间
const {
  father_start_date,
    father_end_date,
    father_date,
    father_date_Chage
} = useDate()//父组件时间hooks
provide('father_date',father_date)
//表格相关
const tableData = ref([])
const tableData1 = ref([])
const inter_trade = ref(0)
const onSubmit = async () => {
  let params = {
    start_date: father_start_date.value,
    end_date: father_end_date.value,
    cat: "",
    inter_trade: inter_trade.value,
  }
  let res = await api.get('/txn/atp', { params: params })
  let res1 = await api.get('/txn/atp2', { params: params })
  tableData.value = res.data.data.map(item=>{
  item['市值(元)'] = item['市值(元)'].toFixed(1)
  item['加仓_市值(元)'] = item['加仓_市值(元)'].toFixed(1)
  item['减仓_市值(元)'] = item['减仓_市值(元)'].toFixed(1)
  item['到期_市值(元)'] = item['到期_市值(元)'].toFixed(1)
return item
  })
  tableData1.value = res1.data.data.map(item=>{
  item['市值(元)'] = item['市值(元)'].toFixed(1)
  item['加仓_市值(元)'] = item['加仓_市值(元)'].toFixed(1)
  item['减仓_市值(元)'] = item['减仓_市值(元)'].toFixed(1)
  item['到期_市值(元)'] = item['到期_市值(元)'].toFixed(1)
return item
  })
}
onSubmit()

const goDetails = (row) => {
  console.log(row)
  router.push({
    path: "/table-details",
    query: {
      start_date: father_start_date.value,
      end_date: father_end_date.value,
      sep_name: '',
      cat: row.归属资管计划,
      inter_trade: inter_trade.value,
    }
  })
}
const goDetailstow = (row) => {
  console.log(row)
  router.push({
    path: "/table-details",
    query: {
      start_date: father_start_date.value,
      end_date: father_end_date.value,
      sep_name: row.归属资管计划,
      cat: '',
      inter_trade: inter_trade.value,
    }
  })
}

let lineSeries = ref([
  {
    name: 'yieid',
    type: 'bar',
    data: [
      ['2023-09-21', 3.5],
      ['2023-09-22', 3.2],
      ['2023-09-23', 3.6]
    ], //
    yAxisIndex: 1 // 使用第一个 y 轴坐标
  },
  {
    name: '市值',
    type: 'line',
    lineStyle: {
      color: 'transparent' // 设置折线的颜色为透明
    },
    data: [
      ['2023-09-21', 1000],
      ['2023-09-22', 4000],
      ['2023-09-24', 8000],
      ['2023-09-25', 8000],
      ['2023-09-26', 8000]
    ], //
    yAxisIndex: 0 // 使用第二个 y 轴坐标
  }
])
let lineSeries1 = ref([])
const allChange = async (val) => {
  //参数改变
  let arr = []
  let target = ''
  arr = await getLineData2(val, target)
  lineSeries.value = arr
}
const allChange1 = async (val) => {
  //参数改变
  let arr = []
  let target = ''
  arr = await getLineData3(val, target)
  lineSeries1.value = arr
}
let darkcolor = ['#91CC75', '#FAC858', '#EE6666']
let shoalcolor = ['#C8EBAE', '#FDE4AC', '#F0B3B3']
const getColor = (() => {
  let darkIndex = 0;
  let shoalIndex = 0;
  return (tag) => {
    let color;
    if (tag === '加仓') {
      color = darkcolor[darkIndex];
      darkIndex = (darkIndex + 1) % darkcolor.length;
    } else if (tag === '减仓') {
      color = shoalcolor[shoalIndex];
      shoalIndex = (shoalIndex + 1) % shoalcolor.length;
    }
    return color;
  };
})();
const getLineData3 = async (val, target) => {
  let catergory = val.selectedOptions[0]
  let indicator = val.target
  let params = {
    // separate_name: separate_name.value,
    catergory: catergory,
    indicator: indicator,
        separate_buy_sell:1

    // separate_name:separate_name.value,
  }
  if (target) {
    params.target = target
  }
  let res = await api.get('/transaction_bondfund', { params })
  let rawData = res.data.data
rawData.map(item=>{
item.itemStyle = {color:''}
 if (item.tag == '减仓') {
      item.data = item.data.map((num) => {
      num[1] = -num[1]
      return num
      });
  if (item.name=='yield') {
    item.itemStyle.color ='#C8EBAE'
  }else{
    item.itemStyle.color ='#FDE4AC'
  }

    }

if (item.tag == '加仓') {
   if (item.name=='市值(元)') {
    item.itemStyle.color ='#FAC858 '
  }else{
    item.itemStyle.color ='#91CC75'
  }
}

if(item.name=='yield'){
item.type='line'
item.yAxisIndex=1
// item.itemStyle =  {
//         color: getColor(item.tag)
//       }
}else{
item.type='bar'
item.yAxisIndex=0
  // item.itemStyle =  {
  //       color: getColor(item.tag)
  //     }
item.stack = item.name

}


item.name = item.name+' '+item.tag
return item
})
console.log('rawData', rawData)
let arr = []
arr = rawData


  return arr
}
const getLineData2 = async (val, target) => {
  let catergory = val.selectedOptions[0]
  let indicator = val.target
  let params = {
    // separate_name: separate_name.value,
    catergory: catergory,
    indicator: indicator
    // separate_name:separate_name.value,
  }
  if (target) {
    params.target = target
  }
  let res = await api.get('/transaction_bondfund', { params })
  let rawData = res.data.data
  const arr = Object.keys(rawData).map((indicator) => {
    return {
      name: indicator,

      type: indicator == '市值(元)' ? 'bar' : 'line',
      yAxisIndex: indicator == '市值(元)' ? 0 : 1,
      data: Object.entries(rawData[indicator]).map(([date, value]) => [date, value])
    }
  })
  console.log('arr', arr)
  return arr
}

const barChange = async (obj) => {
  //参数改变
  console.log('参数改变obj :>> ', obj)
  let params = {
    sector1: obj.sector1.value,
    sector2: obj.sector2.value,

  }
  let res = await api.get('/transaction_stock', { params })
  let testObj = res.data.data

  let list = [testObj.list1, testObj.list2]
  let Legend1 = testObj.list1 ? Object.keys(testObj.list1) : []
  let Legend2 = testObj.list2 ? Object.keys(testObj.list2) : []
  echartsLegend.value = [...Legend1, ...Legend2]
  console.log('testObj.list1', testObj.list1)
  console.log('testObj.list2', testObj.list2)
  let arr1 = resultFmoat(testObj.list1, 1)
  let arr2 = resultFmoat(testObj.list2, 2)
  console.log('arr1', arr1)
  console.log('arr2', arr2)

  series.value = [...arr1, ...arr2]
  console.log('8888888888888888series.value ', series.value)

}

const resultFmoat = (inputObject, type) => {
  const result = []
  for (const key in inputObject) {
    if (inputObject.hasOwnProperty(key)) {
      const item = {
        name: key,
        type: 'bar',
        stack: 'stack1',
        itemStyle: {
          color: '#8f9cc6'
        },
        data: Object.entries(inputObject[key]).map(([date, value]) => [date, value])
      }
      result.push(item)
    }
  }

  if (type == 1) {
    if (result[0]) {
      result[0].stack = 'stack1'
      result[0].itemStyle.color = '#8f9cc6'
    }
    if (result[1]) {
      result[1].stack = 'stack1'
      result[1].itemStyle.color = '#5470c6'
    }
  }

  if (type == 2) {
    if (result[0]) {
      result[0].stack = 'stack2'
      result[0].itemStyle.color = '#b7ccad'
    }
    if (result[1]) {
      result[1].stack = 'stack2'
      result[1].itemStyle.color = '#91CC75'
    }
  }

  // if (result[0]) {
  //   result[0].stack = 'stack1'
  //   result[0].itemStyle.color = '#8f9cc6'
  // }
  // if (result[1]) {
  //   result[1].stack = 'stack1'
  //   result[1].itemStyle.color = '#5470c6'
  // }
  // if (result[2]) {
  //   result[2].stack = 'stack2'
  //   result[2].itemStyle.color = '#b7ccad'
  // }
  // if (result[3]) {
  //   result[3].stack = 'stack2'
  //   result[3].itemStyle.color = '#91CC75'
  // }

  return result
}

const echartsLegend = ref(['图例一', '图例二', '图例三', '图例四']) //这是图例，必须和series中的name一致
const series = ref([

])
</script>

<style scoped>
.table-box {
  width: 66%;
  height: 490px;
  /* aspect-ratio: 16/9; */

}

.text-title{
  display: -webkit-box;
 -webkit-line-clamp: 2;
 -webkit-box-orient: vertical;
 overflow: hidden;
 text-overflow: ellipsis;

}
.text-title1{
  display: -webkit-box;
 -webkit-line-clamp: 1;
 -webkit-box-orient: vertical;
 overflow: hidden;
 text-overflow: ellipsis;

}
</style>
