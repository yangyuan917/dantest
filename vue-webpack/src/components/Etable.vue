<template>
  <div class="echarts-box">
    <el-row justify="end" style="margin-top: 10px;">
      <el-col :span="6">
        <el-button type="primary">新增</el-button>
        <el-button type="error">删除</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column v-for="item in columns" :prop="item.props" :label="item.label" />
    </el-table>
  </div>
</template>
<script setup>
import { onMounted, onBeforeMount, ref, onBeforeUnmount, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
const tableData = ref([
])
const columns = ref([

{props:'data1',label:'创建时间'},
{props:'data1',label:'信息链接'},
{props:'data1',label:'创建人'},

  ])


</script>

<style scoped>
.echarts-box {
  background-color: #ffffff;
  border-radius: 8px;
  /* width: 33.3% */;
  aspect-ratio: 16/9;
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
</style>
