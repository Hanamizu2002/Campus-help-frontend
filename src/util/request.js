// 工具包
import axios from "axios"
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const Qs = require("querystring");

/**
 * instance封装axios
 */
var instance = axios.create({
    baseURL: 'http://localhost:8080', // localtest
    // 超时时间
    timeout: 20000
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    NProgress.start();//开启
    return config;
}, function (error) {
    NProgress.done();//关闭
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    NProgress.done();//关闭
    return response;
}, function (error) {
    NProgress.done();//关闭
    return Promise.reject(error);
});

/**
 * service封装axios
 */
var service = axios.create({
    baseURL: 'http://localhost:8080', // 本地测试
    // headers:{
    //     'Content-Type':'application/json;charset=UTF-8'
    // },
    // 超时时间
    timeout: 20000
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    NProgress.done();//关闭
    return response;
}, function (error) {
    NProgress.done();//关闭
    return Promise.reject(error);
});

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    NProgress.start();//开启
    return config;
}, function (error) {
    NProgress.done();//关闭
    return Promise.reject(error);
});



let get = function (url, params) {
    return instance.get(url, {params});
}
let post = function (url, params) {
    return instance.post(url, Qs.stringify(params));
}
let put = function (url, params) {
    return instance.put(url, Qs.stringify(params));
}
let del = function (url, params) {
    return instance.delete(url, {params});
}

// 导出get和post方法
export {
    get, put, del, post
}

export default service

