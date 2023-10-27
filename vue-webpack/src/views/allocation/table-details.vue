<template>
  <div class="">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="">
            <el-date-picker v-model="formInline.start_date" type="date" @change="startDateChange"
              value-format="YYYY-MM-DD" style="max-width: 200px" placeholder="请选择开始日期" />
          </el-form-item>
          <el-form-item label="">
            <el-date-picker v-model="formInline.end_date" type="date" @change="endDateChange" value-format="YYYY-MM-DD"
              style="max-width: 200px" placeholder="请选择结束日期" />
          </el-form-item>
          <el-form-item label="">
           <el-select v-model="formInline.inter_trade" placeholder="是否内部交易" style="width: 80px; ">
          <el-option label="否" :value="0"></el-option>
          <el-option label="是" :value="1"></el-option>
        </el-select>

          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>

      </el-col>

    </el-row>
    <el-row>
      <el-col :span="24">
      <div class="table-box">

  <el-table :data="tableData" height="490" border>
        <el-table-column label="">
          <el-table-column label="分组" prop="类别1">
            <template #default="scope">
              <span style="margin-left: 10px;color: #409EFF; cursor: pointer;" @click="goDetails(scope.row)">{{
                scope.row.归属资管计划 }}</span>
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

      </el-col>
    </el-row>
  </div>
</template>

<script  setup>
import { reactive, ref } from "vue"
import { api } from '@/utils/api';
import {useRoute} from 'vue-router'
const route = useRoute()
console.log('route', route)
const formInline = ref({
  start_date: "",
  end_date: "",
  // separate_name:'',
  inter_trade:'',
  cat: ""
})

let query =route.query
formInline.value.start_date = query.start_date
formInline.value.end_date = query.end_date
formInline.value.cat = query.cat
formInline.value.separate_name = query.separate_name
formInline.value.inter_trade = query.inter_trade

const tableData = ref([])

const onSubmit = async () => {
console.log('formInline.value', formInline.value)

  let res = await api.get('/txn/atp', { params: formInline.value })
  tableData.value = res.data.data
}
onSubmit()
</script>

<style  scoped>

.table-box {
  width: 66%;
  height: 490px;
  /* aspect-ratio: 16/9; */

}
</style>
