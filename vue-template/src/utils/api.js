import axios from 'axios';
let url = 'https://wmrisk-8806-60067-10-1319347086.sh.run.tcloudbase.com'//这里写请求的基本URL
const api = axios.create({
  baseURL: url, // 设置基本的请求URL
  timeout: 5000, // 设置请求超时时间
  //json 化
  transformRequest: [
    function (data) {
      data = JSON.stringify(data);
      return data;
    },
  ],
  headers: {
    'Content-Type': 'application/json', // 设置请求头
  },
});

export default api;
