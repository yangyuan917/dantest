<template>
  <div class="all-page-flex">
    <div style="width: 100%;">

      <el-date-picker size="mini" v-model="father_start_date" @change="father_date_Chage" type="date"
        value-format="YYYY-MM-DD" style="max-width: 240px" placeholder="请选择开始日期" />
      <el-date-picker size="mini" v-model="father_end_date" @change="father_date_Chage" type="date"
        value-format="YYYY-MM-DD" style="max-width: 240px;margin-right: 6px; " placeholder="请选择结束日期" />
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
              <div style="margin-left: 10px;color: #409EFF; cursor: pointer; " class="text-title"
                @click="goDetails(scope.row)">{{
                  scope.row.行业名称 }}</div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="总计 " align="center">
          <el-table-column label="交易笔数" align="right" prop="归属资管计划"></el-table-column>
          <el-table-column label="交易金额" align="right" prop="holding_w"></el-table-column>
        </el-table-column>
        <el-table-column label="加仓 " align="center">
          <el-table-column label="交易笔数" align="right" prop="加仓_归属资管计划"></el-table-column>
          <el-table-column label="交易金额" align="right" prop="加仓_holding_w"></el-table-column>
        </el-table-column>
        <el-table-column label="减仓 " align="center">
          <el-table-column label="交易笔数" align="right" prop="减仓_归属资管计划"></el-table-column>
          <el-table-column label="交易金额" align="right" prop="减仓_holding_w"></el-table-column>
        </el-table-column>
        <el-table-column label="到期 " align="center">
          <el-table-column label="交易笔数" align="right" prop="到期_归属资管计划"></el-table-column>
          <el-table-column label="交易金额" align="right" prop="到期_holding_w"></el-table-column>
        </el-table-column>

      </el-table>
    </div>
    <div class="table-box">
      <el-table :data="tableData1" height="490" border>
        <el-table-column label="">
          <el-table-column label="分组" prop="归属资管计划/自主投资基金">
            <template #default="scope">
              <span style="margin-left: 10px;color: #409EFF; cursor: pointer;" class="text-title1"
                @click="goDetailstow(scope.row)">{{
                  scope.row.归属资管计划 }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="总计 " align="center">
          <el-table-column label="交易笔数" align="right" prop="行业名称"></el-table-column>
          <el-table-column label="交易金额" align="right" prop="holding_w"></el-table-column>
        </el-table-column>
        <el-table-column label="加仓 " align="center">
          <el-table-column label="交易笔数" align="right" prop="加仓_行业名称"></el-table-column>
          <el-table-column label="交易金额" align="right" prop="加仓_holding_w"></el-table-column>
        </el-table-column>
        <el-table-column label="减仓 " align="center">
          <el-table-column label="交易笔数" align="right" prop="减仓_行业名称"></el-table-column>
          <el-table-column label="交易金额" align="right" prop="减仓_holding_w"></el-table-column>
        </el-table-column>
        <el-table-column label="到期 " align="center">
          <el-table-column label="交易笔数" align="right" prop="到期_行业名称"></el-table-column>
          <el-table-column label="交易金额" align="right" prop="到期_holding_w"></el-table-column>
        </el-table-column>

      </el-table>
    </div>

  </div>
</template>
<script setup>
import { reactive, ref, provide } from 'vue'
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
provide('father_date', father_date)
//表格相关
const tableData = ref([])
const tableData1 = ref([])
const inter_trade = ref(0)
const onSubmit = async () => {
  let params = {
    param1: 0,
    start_date: father_start_date.value,
    end_date: father_end_date.value,
  }
  let params1 = {
    param1: 1,
    start_date: father_start_date.value,
    end_date: father_end_date.value,
  }

  let res = await api.get('/txn/fund_prt', { params: params })
  let res1 = await api.get('/txn/fund_prt', { params: params1 })
  tableData.value = res.data.data.map(item => {
    item['holding_w'] = item['holding_w'].toFixed(1)
    item['加仓_holding_w'] = item['加仓_holding_w'].toFixed(1)
    item['加仓_归属资管计划'] = item['加仓_归属资管计划/自主投资基金'].toFixed(1)
    item['减仓_holding_w'] = item['减仓_holding_w'].toFixed(1)
    item['减仓_归属资管计划'] = item['减仓_归属资管计划/自主投资基金'].toFixed(1)
    item['到期_holding_w'] = item['到期_holding_w'].toFixed(1)
    item['到期_归属资管计划'] = item['到期_归属资管计划/自主投资基金'].toFixed(1)
    item['归属资管计划'] = item['归属资管计划/自主投资基金']
    return item
  })
  tableData1.value = res1.data.data.map(item => {


    item['holding_w'] = item['holding_w'].toFixed(1)
    item['加仓_holding_w'] = item['加仓_holding_w'].toFixed(1)
    item['加仓_行业名称'] = item['加仓_行业名称'].toFixed(1)
    item['减仓_holding_w'] = item['减仓_holding_w'].toFixed(1)
    item['减仓_行业名称'] = item['减仓_行业名称'].toFixed(1)
    item['到期_holding_w'] = item['到期_holding_w'].toFixed(1)
    item['到期_行业名称'] = item['到期_行业名称'].toFixed(1)
    item['归属资管计划'] = item['归属资管计划/自主投资基金']
    return item
  })
}
onSubmit()

const goDetails = (row) => {
  console.log(row)
  router.push({
    path: "/foundation-table-details",
    query: {
      start_date: father_start_date.value,
      end_date: father_end_date.value,
      sep_name: '',
      cat: row.行业名称,
    }
  })
}
const goDetailstow = (row) => {
  console.log(row)
  router.push({
    path: "/foundation-table-details",
    query: {
      start_date: father_start_date.value,
      end_date: father_end_date.value,
      sep_name: row.归属资管计划,
      cat: '',
    }
  })
}











</script>

<style scoped>
.table-box {
  width: 66%;
  height: 490px;
  /* aspect-ratio: 16/9; */

}

.text-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

}

.text-title1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

}</style>
