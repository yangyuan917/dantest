import { ref } from 'vue'
import {getTodayTime} from '@/utils/util'

export default function useDate() {
  const father_start_date = ref('2023-10-13')
  const father_end_date = ref('')
father_end_date.value = getTodayTime()

  const father_date = ref({
    father_start_date: father_start_date.value,
    father_end_date: father_end_date.value

  })
  const father_date_Chage = (val) => {
    father_date.value.father_start_date = father_start_date.value
    father_date.value.father_end_date = father_end_date.value
  }

  return {
    father_start_date,
    father_end_date,
    father_date,
    father_date_Chage
  }
}
