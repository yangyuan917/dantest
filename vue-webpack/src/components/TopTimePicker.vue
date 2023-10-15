<template>
   <el-date-picker v-model="father_start_date" type="date"   value-format="YYYY-MM-DD"
            style="max-width: 240px" placeholder="请选择开始日期" />
          <el-date-picker v-model="father_end_date" type="date"  value-format="YYYY-MM-DD"
            style="max-width: 240px" placeholder="请选择结束日期" />
</template>

<script  setup>
import {reactive,ref} from "vue"

const father_start_date = ref('2023-09-1')
const father_end_date = ref('2023-09-28')

defineExpose(
{
// father_start_date,
// father_end_date
a:5
}
)


</script>

