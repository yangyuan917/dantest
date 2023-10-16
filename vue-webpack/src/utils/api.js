import axios from 'axios';
let url0 = 'https://wmrisk-8806-60067-10-1319347086.sh.run.tcloudbase.com'//这里写请求的基本URL
let url = 'https://wmrisk8803-holding1-60067-10-1319347086.sh.run.tcloudbase.com'//这里写请求的基本URL
// let url = 'http://localhost:8803'//这里写请求的基本URL
export const api0 = axios.create({
  // baseURL: url, // 设置基本的请求URL
  baseURL: url0, // 设置基本的请求URL
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
export const api = axios.create({
  // baseURL: url, // 设置基本的请求URL
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


// export default api;
