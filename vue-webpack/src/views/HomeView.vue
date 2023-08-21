<template>
  <div>
    <!-- <div class="tabs">
      <div v-for="(tab, index) in tabs" :key="index" :class="{ 'tab': true, 'active': activeTab === index }"
        @click="changeTable(index)">{{ tab }}</div>
    </div> -->
    <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="总量-宏观利率" name="first">
        <div class="grid-item">
          <Echarts v-for="item in chartsObjList0" :key="item.name" @timeChange="timeChange" :title="item.title"
            :myOption="item.options" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="总量-资金流向" name="second">
        <div class="grid-item">
          <Echarts v-for="item in chartsObjList1" :key="item.name" :title="item.title" :myOption="item.options" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="监测标的池" name="third">
        <div class="select-box">
          <!-- <el-select v-model="selectedTarget" class="m-2" @change="handleSelectChange" style="margin-right: 12px;"
            placeholder="Select">
            <el-option v-for="item in targetOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select> -->
          <!-- <el-select v-model="start_date" class="m-2" @change="handleSelectChange1" placeholder="Select">
            <el-option v-for="item in timeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select> -->
          <!-- <div style="width: 220px; margin-left: 12px;">
                    <el-date-picker v-model="timeValue" type="daterange" range-separator="To" start-placeholder="开始时间"
            end-placeholder="结束时间" style="width: 220px;" />
          </div> -->

        </div>
        <!-- <div class="switch">
          <el-switch v-model="switchVale" @change="switchChage"></el-switch>

        </div> -->

        <div class="grid-item">

          <Echarts v-for="item in chartsObjList2" :key="item.name" :isOpen="switchVale" :title="item.title" :myOption="item.options" />
          <Echarts1 v-for="item in chartsObjList2" :key="item.name" :isOpen="switchVale" :title="item.title" :myOption="item.options" />
          <Etable></Etable>

        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import Echarts from '../components/Echarts.vue';
import Echarts from '@/components/Echarts.vue';
import Echarts1 from '@/components/Echarts1.vue';
import Etable from '@/components/Etable.vue';
import api from '../utils/api';
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
          name: 'chart0', title: '标题',
          msg: {
            name: 'chart0', title: '标题',
          }, options: {}
        },
        { name: 'maro_rate', title: '利率变动', options: {} },
        { name: 'index_cnbd', title: '固定/浮息强弱', options: {} },
        { name: 'm2', title: 'M2/社融', options: {} },
        { name: 'a', title: '', options: {} },
        { name: 'b', title: '', options: {} },
      ],
      chartsObjList1: [
        { name: 'fund_flow_50', title: '上证50', options: {} },
        { name: 'fund_flow_300', title: '沪深300', options: {} },
        { name: 'fund_flow_1000', title: '中证1000', options: {} },
        { name: 'new_fund_flow', title: '新发基金', options: {} },
        { name: 'north_flow', title: '北向资金', options: {} },
        { name: 'tmp', options: {} },
      ],
      chartsObjList2: [
        { name: 'scores_short', title: '动态回撤', options: {} },
        // { name: 'f', options: {} },
        // { name: 'fund_flow_300', options: {} },
        // { name: 'h', options: {} },
        // { name: 'g', options: {} },
        // { name: 'g', options: {} },
      ],


      dy_downside: '',
      message: '',
      dataList: [],
      start_date: '2023-1-1',
      chartOptions: {},
      socket: null,
    };
  },
  created() {
    this.socket = io('http://localhost:3003', {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
  },
  mounted() {
    this.socket.on('message', (data) => {
      console.log('44444444444444444444Received message:', data);
    });

    // 发送消息到服务器
    this.socket.emit('chatMessage', 'Hello, server!');
    this.init()

  },
  methods: {
    switchChage(value) {//开关变化
      //这里写逻辑。。。。

      //如果value为true，打开socket连接，否则关闭
      if (value) {
        this.socket = io('http://localhost:3003', {
          cors: {
            origin: '*',
            methods: ['GET', 'POST']
          }
        });
      } else {
        this.socket.close();
      }


    },
    changeTable(index) {
      this.activeTab = index;
      this.getData();
    },
    init() {//初始化
      this.getData()
      this.getData0() //获取数据第一个数据
      this.getData1() //获取数据第二个数据
      this.getDataM2() //获取数据第二个数据
      this.getData2() //获取数据第三个数据
      this.getData_fundflow50()
      this.getData_fundflow1000()
      this.getData_new_fund_flow()
      this.getData_north_flow()
      let selectedTarget = "600036.SH"
      // start_date = '2023-1-1'
      this.getData_scores_short(this.selectedTarget)
      this.getData_scores_short1(this.selectedTarget, this.start_date)

    },
    timeChange(value) {
      console.log('父组件timeChange', value)
      // this.start_date = value;
      // this.getData_scores_short1(this.selectedTarget, this.start_date)
    },
    handleSelectChange(value) {
      console.log('发送信息',)
      this.socket.emit('message', 'Hello, server!');
      this.getData_scores_short(value);
      this.getData_scores_short1(value, this.start_date);
    },
    handleSelectChange1(value) {
      // start_date = event.target.value;
      // this.start_date = event.target.value;
      this.getData_scores_short1(this.selectedTarget, value);
      this.sendSelectedTarget();

    }, sendSelectedTarget() {
      // 当下拉选项变化时，将选中的值发送给后端
      // socket.emit('start_date', this.start_date);
    },
    async getData() {
      let data = await api.get('/operation')
      data = data.data;
      console.log('data.data ', data.data)
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
      let etime = '2023-08-29';
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
          max: new Date(etime.replace(/-/g, "/")),

        },
        dataZoom: [ // 添加数据区域缩放组件，即滚动条
          {
            show: true,
            type: 'slider',
            top: '90%',
            bottom: '4%',
            start: 95,
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
      console.log('getData0')
      let data = await api.get('/maro_rate')
      data = data.data;
      console.log("maro_rate:", Object.keys(data.data));
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
        return { name: key, type: 'line', symbol: 'none', stack: 'Total', data: ItemData };
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
          data: Object.keys(data.data).sort()
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
          type: 'value'
        },
        series: formattedData
      };
      this.chartsObjList0[1].options = option;

    },

    async getData1() { //获取对应的数据
      let data = await api.get('/index_cnbd')
      data = data.data;
      console.log(Object.keys(data.data));
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
          name: key, type: 'line', stack: 'Total', symbol: 'none', // 禁止显示圆点

          data: ItemData
        };
      }).filter(item => item !== null);

      console.log(data.data);
      // formattedData[0].data[246][1] = null;
      // formattedData[0].data[244][1] = null;
      // formattedData[0].data[241][1] = null;
      console.log('9999999999index_cnbdformattedData', formattedData);
      console.log(data.data);
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
          type: 'value'
        },
        series: formattedData
      };

      // 使用刚指定的配置项和数据显示图表。
      this.chartsObjList0[2].options = option;

    },
    async getDataM2() { //获取对应的数据
      let data = await api.get('/index_cnbd')
      data = data.data;
      console.log(Object.keys(data.data));
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
        return { name: key, type: 'line', symbol: 'none', stack: 'Total', data: ItemData };
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
    async getData_fundflow50() { //获取对应的数据
      let data = await api.get('/fund_flow?tag=上证50')
      data = data.data;
      console.log(Object.keys(data.data));
      const formattedData = Object.keys(data.data).map(key => {
        if (key === 'update_time' || key == 'trade_date' || key == 'tag') {
          // 如果key等于'update_time'，直接返回null，跳过这个key
          return null;
        }
        let ItemData = Object.keys(data.data[key]).map(key1 => {
          const date = data.data.trade_date[key1];
          const value = data.data[key][key1];
          return [new Date(date), value]
        })

        console.log('社融 ItemData :>> ', ItemData);
        return { name: key, type: 'bar', stack: 'stack', data: ItemData };
      }).filter(item => item !== null);
      console.log(data.data);
      console.log(formattedData);
      let stime = '2020-01-01';
      let etime = '2023-08-29';
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
          max: new Date(etime.replace(/-/g, "/")),

        },
        dataZoom: [ // 添加数据区域缩放组件，即滚动条
          {
            show: true,
            type: 'slider',
            top: '90%',
            bottom: '4%',
            start: 95,
            end: 100
          }
        ],
        yAxis: {
          type: 'value',
        },
        series: formattedData
      };

      // 使用刚指定的配置项和数据显示图表
      this.chartsObjList1[0].options = option;


    },
    async getData2() { //获取对应的数据
      let data = await api.get('/fund_flow?tag=沪深300')
      data = data.data;

      const formattedData = Object.keys(data.data).map(key => {
        if (key === 'update_time' || key == 'trade_date' || key == 'tag') {
          // 如果key等于'update_time'，直接返回null，跳过这个key
          return null;
        }
        let ItemData = Object.keys(data.data[key]).map(key1 => {
          const date = data.data.trade_date[key1];
          const value = data.data[key][key1];
          return [new Date(date), value]
        })
        return { name: key, type: 'bar', stack: 'stack', data: ItemData };
      }).filter(item => item !== null);
      console.log(data.data);
      console.log(formattedData);
      let stime = '2020-01-01';
      let etime = '2023-08-29';
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
          max: new Date(etime.replace(/-/g, "/")),

        },
        dataZoom: [ // 添加数据区域缩放组件，即滚动条
          {
            show: true,
            type: 'slider',
            top: '90%',
            bottom: '4%',
            start: 95,
            end: 100
          }
        ],
        yAxis: {
          type: 'value',
        },
        series: formattedData
      };

      // 使用刚指定的配置项和数据显示图表
      this.chartsObjList1[1].options = option;


    },

    async getData_fundflow1000() { //获取对应的数据
      let data = await api.get('/fund_flow?tag=中证1000')
      data = data.data;

      console.log(Object.keys(data.data));
      const formattedData = Object.keys(data.data).map(key => {
        if (key === 'update_time' || key == 'trade_date' || key == 'tag') {
          // 如果key等于'update_time'，直接返回null，跳过这个key
          return null;
        }
        let ItemData = Object.keys(data.data[key]).map(key1 => {
          const date = data.data.trade_date[key1];
          const value = data.data[key][key1];
          return [new Date(date), value]
        })
        return { name: key, type: 'bar', stack: 'stack', data: ItemData };
      }).filter(item => item !== null);
      console.log(data.data);
      console.log(formattedData);
      let stime = '2020-01-01';
      let etime = '2023-08-29';
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
          max: new Date(etime.replace(/-/g, "/")),

        },
        dataZoom: [ // 添加数据区域缩放组件，即滚动条
          {
            show: true,
            type: 'slider',
            top: '90%',
            bottom: '4%',
            start: 95,
            end: 100
          }
        ],
        yAxis: {
          type: 'value',
        },
        series: formattedData
      };
      // 使用刚指定的配置项和数据显示图表
      this.chartsObjList1[2].options = option;


    },
    async getData_new_fund_flow() { //获取对应的数据
      let data = await api.get('/new_fund_flow')
      data = data.data;


      console.log(Object.keys(data.data));
      const formattedData = Object.keys(data.data).map(key => {
        if (key === 'update_time' || key == '认购截止日期' || key == 'sale_rate') {
          // 如果key等于'update_time'，直接返回null，跳过这个key
          return null;
        }
        let ItemData = Object.keys(data.data[key]).map(key1 => {
          const date = data.data.认购截止日期[key1];
          const value = data.data[key][key1];
          return [new Date(date), value]
        })
        return { name: key, type: 'bar', data: ItemData };
      }).filter(item => item !== null);
      console.log(data.data);
      console.log(formattedData);
      let stime = '2020-01-01';
      let etime = '2023-08-29';
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
          max: new Date(etime.replace(/-/g, "/")),

        },
        dataZoom: [ // 添加数据区域缩放组件，即滚动条
          {
            show: true,
            type: 'slider',
            top: '90%',
            bottom: '4%',
            start: 95,
            end: 100
          }
        ],
        yAxis: {
          type: 'value',
        },
        series: formattedData
      };

      // 使用刚指定的配置项和数据显示图表
      this.chartsObjList1[3].options = option;

    },
    async getData_north_flow() { //获取对应的数据
      let data = await api.get('/north_flow')
      data = data.data;

      console.log(Object.keys(data.data));
      const formattedData = Object.keys(data.data).map(key => {
        if (key === 'update_time' || key == 'trade_date' || key == 'sale_rate') {
          // 如果key等于'update_time'，直接返回null，跳过这个key
          return null;
        }
        let ItemData = Object.keys(data.data[key]).map(key1 => {
          const date = data.data.trade_date[key1];
          const value = data.data[key][key1];
          return [new Date(date), value]
        })
        return { name: key, type: 'bar', data: ItemData };
      }).filter(item => item !== null);
      console.log(data.data);
      console.log(formattedData);
      let stime = '2020-01-01';
      let etime = '2023-08-29';
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
          max: new Date(etime.replace(/-/g, "/")),

        },
        dataZoom: [ // 添加数据区域缩放组件，即滚动条
          {
            show: true,
            type: 'slider',
            top: '90%',
            bottom: '4%',
            start: 95,
            end: 100
          }
        ],
        yAxis: {
          type: 'value',
        },
        series: formattedData
      };

      // 使用刚指定的配置项和数据显示图表
      this.chartsObjList1[4].options = option;

    },
    async getData_scores_short(selectedTarget) { //获取对应的数据
      let data = await api.get('/scores_short?target=' + selectedTarget)
      data = data.data;

      console.log("1111111111scores_short: ", data.data);
      const formattedData = Object.keys(data.data).map(key => {
        if (key === 'update_time' || key == 'trade_date' || key == 'symbol') {
          // 如果key等于'update_time'，直接返回null，跳过这个key
          return null;
        }
        let ItemData = Object.keys(data.data[key]).map(key1 => {
          const date = data.data.trade_date[key1];
          const value = data.data[key][key1];
          return [new Date(date), value]
        })
        return { name: key, type: 'line', stack: 'Total', symbol: 'none', symbolSize: 5, data: ItemData };
      }).filter(item => item !== null);
      console.log(data.data);
      console.log(formattedData);
      let stime = '2023-01-01';
      // etime='2023-08-29';
      // 指定图表的配置项和数据
      let option = {

        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['dy_downside_2', 'dy_downside_5', 'dy_downside_20']
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
          type: 'value'
        },
        series: formattedData
      };

      // 使用刚指定的配置项和数据显示图表
      this.chartsObjList2[0].options = option;

    },
    async getData_scores_short1(selectedTarget, start_date) { //获取对应的数据
      let data = await api.get('/scores_short1?target=' + selectedTarget + '&start_date=' + start_date)
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

}</style>


