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
          <el-form-item label="是否内部交易">
            <el-input v-model="formInline.cat" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>

      </el-col>

    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="tableData" border>
          <el-table-column label="分组" prop="index">
            <template #default="scope">
              <span style="margin-left: 10px">{{ scope.row.index }}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易笔数" prop="symbol2"></el-table-column>
          <el-table-column label="交易金额" prop="市值(元)"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script  setup>
import { reactive, ref } from "vue"
import { api } from '@/utils/api';

const tableData = ref([])
const formInline = ref({
  start_date: "2023-10-12",
  end_date: "2023-10-19",
  cat: "同业存单"
})

const onSubmit = async () => {

  let res = await api.get('/txn/atp', { params: formInline.value })
  tableData.value = res.data.data
  console.log('res', res)
}
onSubmit()
</script>

<style  scoped></style>
