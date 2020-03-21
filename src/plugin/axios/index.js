import Vue from 'vue'
import { message } from 'ant-design-vue'
Vue.prototype.$message = message;
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import Cookies from 'js-cookie'
axios.defaults.timeout = 30000;//响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';        //配置请求头
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = '/api/'
}
axios.create({
  // 设置超时时间
  timeout: 60000
})
axios.defaults.headers.Authorization = localStorage['token'] || null
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers['x-csrf-token'] = Cookies.get('csrfToken')
   //在发送请求之前做某件事
   if(config.method  === 'post'){
    config.data = qs.stringify(config.data);
}
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
// 在这里对返回的数据进行处理
// 在这里添加你自己的逻辑
axios.interceptors.response.use(res => {
  if (res.data.code !== undefined) {
    if (res.data.code !== 200) {
        // $message.error(res.data.msg)
      return Promise.reject(res.data.msg)
    } else {
      return res.data.data
    }
  } else {
    return res.data
  }
}, error => {
  if (error.response.status === 401) {
      var timer=setTimeout(()=>{
        router.replace({
          path: '/login'
        })
        clear(timer)
      },3000);
    
  } else {
    return Promise.reject(error)
  }
})
//返回一个Promise(发送post请求)
export function fetchPost(url, params) {
  return new Promise((resolve, reject) => {
      axios.post(url, params)
          .then(response => {
              resolve(response);
          }, err => {
              reject(err);
          })
          .catch((error) => {
              reject(error)
          })
  })
}
//返回一个Promise(发送get请求)
export function fetchGet(url, param) {
  return new Promise((resolve, reject) => {
      axios.get(url, {params: param})
          .then(response => {
              resolve(response)
          }, err => {
              reject(err)
          })
          .catch((error) => {
              reject(error)
          })
  })
}
export default {
  fetchPost,
  fetchGet,
}


