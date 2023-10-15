<template>
  <div>
    <div class="grid-item" >
      <Echarts v-for="item in chartsObjList0" :key="item.name" :title="item.title" :myOption="item.options" />
    </div>
  </div>
</template>

<script>
// import Echarts from '../components/Echarts.vue';
import Echarts from '@/components/Echarts.vue';
import Echarts1 from '@/components/Echarts1.vue';
import Etable from '@/components/Etable.vue';
import {api0} from '@/utils/api';
import io from 'socket.io-client';
export default {
  name: 'AboutView',
  components: {
    Echarts,
    Echarts1,
    Etable
  },
  data() {
    return {

      switchVale: false,
      selectedTarget: '600036.SH',//下拉框值
      start_date: '2023-1-1',//下拉框值
      targetOptions: [
        {
          value: '600036.SH',
          label: '600036.SH',
        },
        {
          value: 'NDX.GI',
          label: 'NDX.GI',
        },

      ],
      timeOptions: [
        {
          value: '2023-1-1',
          label: '2023-1-1',
        },
        {
          value: '2023-3-1',
          label: '2023-3-1',
        },

      ],
      timeValue: '',
      activeName: 'first',
      tabs: ['总量-宏观利率', '总量-资金流向', '监测标的池'],
      activeTab: 0,
      charts: [
        ['chart0', 'maro_rate', 'index_cnbd', 'm2', 'a', 'b'],
        ['fund_flow_50', 'fund_flow_300', 'fund_flow_1000', 'new_fund_flow', 'north_flow', 'tmp'],
        ['scores_short'],
        // ['scores_short', 'f', 'fund_flow_300', 'h', 'g', 'g'],
      ],
      chartsObjList0: [
        {
          name: 'chart0', title: '公开市场操作',
          msg: {
            name: 'chart0', title: '标题',
          }, options: {}
        },
        { name: 'maro_rate', title: '利率变动', options: {} },
        { name: 'index_cnbd', title: '固定-浮息 强弱', options: {} },
        { name: 'm2', title: 'M2-社融', options: {} },
        { name: 'a', title: '', options: {} },
        { name: 'b', title: '', options: {} },
      ],

      chartsObjList2: [
        { name: 'scores_short', title: '动态回撤', options: {} },

      ],


      dy_downside: '',
      message: '',
      dataList: [],
      chartOptions: {},
      socket: null,
    };
  },
  created() {
    // this.socket = io('http://localhost:8801', {
    //   cors: {
    //     origin: '*',
    //     methods: ['GET', 'POST']
    //   }
    // });
  },
  mounted() {
    // this.socket.on('message', (data) => {
    //   console.log('44444444444444444444Received message:', data);
    // });

    // 发送消息到服务器
    this.init()

  },
  methods: {
    handleClick(value) {


    },
    switchChage(value) {//开关变化
      //这里写逻辑。。。。

      //如果value为true，打开socket连接，否则关闭
      // if (value) {
      //   this.socket = io('http://localhost:8801', {
      //     cors: {
      //       origin: '*',
      //       methods: ['GET', 'POST']
      //     }
      //   });
      // } else {
      //   this.socket.close();
      // }


    },
    changeTable(index) {
      this.activeTab = index;
      // this.getData();
    },
    init() {//初始化
      this.getData()
      this.getData0() //获取数据第一个数据
      this.getData1() //获取数据第二个数据
      this.getDataM2() //获取数据第二个数据
      let selectedTarget = "600036.SH"
      let start_date = '2023-1-1'
      this.getData_scores_short1(selectedTarget, this.start_date)

    },
    timeChange(obj) {//这是子组件改变,触发的方法
      console.log('obj :>> ', obj);
      // this.start_date = value;

      let selectedTarget = obj.selectedTarget
      let start_date = obj.start_date
      this.selectedTarget = selectedTarget
      this.start_date = start_date
      this.getData_scores_short1(selectedTarget, start_date)

      // this.getData_scores_short1(this.selectedTarget, this.start_date)
    },
    // handleSelectChange(value) {
    //   this.socket.emit('message', 'Hello, server!');
    //   this.getData_scores_short(value);
    //   this.getData_scores_short1(value, this.start_date);
    // },
    // handleSelectChange1(value) {
    //   // start_date = event.target.value;
    //   // this.start_date = event.target.value;
    //   this.getData_scores_short1(this.selectedTarget, value);
    //   this.sendSelectedTarget();

    // },


     sendSelectedTarget() {
      // 当下拉选项变化时，将选中的值发送给后端
      // socket.emit('start_date', this.start_date);
    },
    async getData() {
      let data = await api0.get('/operation')
      data = data.data;
      const formattedData = Object.keys(data.data).map(key => {
        if (key === 'update_time' || key == '发生日期') {
          // 如果key等于'update_time'，直接返回null，跳过这个key
          return null;
        }
        let ItemData = Object.keys(data.data[key]).map(key1 => {
          const date = data.data.发生日期[key1];
          const value = data.data[key][key1];
          return [new Date(date), value]
        })
        return { name: key, type: 'bar', stack: 'stack', data: ItemData };
      }).filter(item => item !== null);
      let stime = '2020-01-01';
      // let etime = '2023-08-29';
      let option = {

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: Object.keys(data.data).sort()
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'time',
          //   min:'Thu, 02 Jan 2020 00:00:00 GMT',
          //   max:"Tue, 01 Sep 2020 00:00:00 GMT",
          min: new Date(stime.replace(/-/g, "/")),
          // max: new Date(etime.replace(/-/g, "/")),

        },
        dataZoom: [ // 添加数据区域缩放组件，即滚动条
          {
            show: true,
            type: 'slider',
            top: '90%',
            bottom: '4%',
            start: 90,
            end: 100
          }
        ],
        yAxis: {
          type: 'value',
        },
        series: formattedData
      };
      this.chartsObjList0[0].options = option;
    },
    async getData0() { //获取对应的数据
      let data = await api0.get('/maro_rate')
      data = data.data;
      const formattedData = Object.keys(data.data).map(key => {
        if (key === 'update_time' || key == 'trade_date' || key == '指标ID') {
          // 如果key等于'update_time'，直接返回null，跳过这个key
          return null;
        }
        let ItemData = Object.keys(data.data[key]).map(key1 => {
          const date = data.data.指标ID[key1];
          const value = data.data[key][key1];
          return [new Date(date), value]
        })
        return { name: key, type: 'line', symbol: 'none', data: ItemData };
      }).filter(item => item !== null);

      let stime = '2023-01-01';
      let option = {

        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        legend: {
          // data:  Object.keys(data.data).sort()
          data: ['M0017138', 'M0017142', 'M0329546', 'M0329547', 'M1004263', 'M1004271', 'S0059744', 'S0059749']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        dataZoom: [ // 添加数据区域缩放组件，即滚动条
          {
            show: true,
            type: 'slider',
            top: '90%',
            bottom: '4%',
            start: 90,
            end: 100
          }
        ],
        xAxis: {
          type: 'time',
          min: new Date(stime.replace(/-/g, "/")),
          // max:new Date(etime.replace(/-/g,"/")),
        },
        yAxis: {
          type: 'value',
          // formatter: '{value}%' // 设置单位

        },
        series: formattedData
      };


      this.chartsObjList0[1].options = option;

    },

    async getData1() { //获取对应的数据
      let data = await api0.get('/index_cnbd')
      data = data.data;
      const formattedData = Object.keys(data.data).map(key => {
        if (key === 'update_time' || key == 'trade_date' || key == '指标ID' || key == 'tag') {
          // 如果key等于'update_time'，直接返回null，跳过这个key
          return null;
        }
        let ItemData = Object.keys(data.data[key]).map(key1 => {
          const date = data.data.指标ID[key1];
          const value = data.data[key][key1];
          // return value
          //return   [new Date(date), value]
          return [new Date(date), value]
        })
        return {
          name: key, type: 'line', symbol: 'none', // 禁止显示圆点

          data: ItemData
        };
      }).filter(item => item !== null);


      let stime = '2023-01-01';
      // etime='2023-08-29';
      // 指定图表的配置项和数据
      let option = {

        tooltip: {
          trigger: 'axis'
        },
        legend: {
          //   data: Object.keys(data.data).sort()
          data: ['a']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        dataZoom: [ // 添加数据区域缩放组件，即滚动条
          {
            show: true,
            type: 'slider',
            top: '90%',
            bottom: '4%',
            start: 90,
            end: 100
          }
        ],
        xAxis: {
          type: 'time',
          min: new Date(stime.replace(/-/g, "/")),
          // max:new Date(etime.replace(/-/g,"/")),
        },
        yAxis: {
          type: 'value',
          axisLabel: {
          }
        },
        series: formattedData
      };

      // 使用刚指定的配置项和数据显示图表。
      this.chartsObjList0[2].options = option;

    },
    async getDataM2() { //获取对应的数据
      let data = await api0.get('/m2')
      data = data.data;
      const formattedData = Object.keys(data.data).map(key => {
        if (key === 'update_time' || key == 'trade_date' || key == '指标ID' || key == 'tag') {
          // 如果key等于'update_time'，直接返回null，跳过这个key
          return null;
        }
        let ItemData = Object.keys(data.data[key]).map(key1 => {
          const date = data.data.指标ID[key1];
          const value = data.data[key][key1] || null;
          return [new Date(date), value]
        })
        return { name: key, type: 'line', symbol: 'none', data: ItemData };
      }).filter(item => item !== null);

      let stime = '2023-01-01';
      // etime='2023-08-29';
      // 指定图表的配置项和数据
      let option = {

        tooltip: {
          trigger: 'axis'
        },
        legend: {
          //   data: Object.keys(data.data).sort()
          data: ['a']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        dataZoom: [ // 添加数据区域缩放组件，即滚动条
          {
            show: true,
            type: 'slider',
            top: '90%',
            bottom: '4%',
            start: 0,
            end: 100
          }
        ],
        xAxis: {
          type: 'time',
          min: new Date(stime.replace(/-/g, "/")),
          // max:new Date(etime.replace(/-/g,"/")),
        },
        yAxis: {
          type: 'value'
        },
        series: formattedData
      };

      // 使用刚指定的配置项和数据显示图表。
      this.chartsObjList0[3].options = option;

    },

    async getData_scores_short1(selectedTarget, start_date) { //获取对应的数据
      let data = await api0.get('/scores_short1?target=' + selectedTarget + '&start_date=' + start_date)
      data = data.data;
      this.dy_downside = data.data
      console.log(' 333333333333this.dy_downside :>> ', this.dy_downside);

    },



  }
};
</script>

<style scoped >
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.tabs {
  display: flex;
  background-color: #f4f4f4;
  padding: 10px;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tab:hover {
  background-color: #ddd;
}

.active {
  background-color: #444;
  color: white;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  gap: 20px;
}

.grid-item {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  gap: 20px;
  background-color: #EFF1F6;

}

.item {
  flex: 1;
  min-width: calc(33.33% - 20px);
  background-color: #f4f4f4;

  padding: 20px;
  box-sizing: border-box;
  text-align: center;
}

.select-box {
  display: flex;
  align-items: center;
  position: absolute;
  left: 136px;
  top: 36px;

}

img {
  max-width: 100%;
  height: auto;
}

.switch {
  width: 100px;
  margin: auto;

}

.time-box {
  display: flex;
  align-items: center;
  position: absolute;
  left: 136px;
  top: 36px;

}
</style>


