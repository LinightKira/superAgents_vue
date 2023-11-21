import axios,{type AxiosRequestConfig,AxiosResponse} from 'axios'
import store from '../store/auth';

//AxiosRequestConfig 请求传递参数类型
axios.defaults.baseURL =`http://localhost:5000/`

//请求拦截器
axios.interceptors.request.use((config:AxiosRequestConfig | any)=>{
    const token = store.getters.getToken;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  
});  //联合类型


//响应拦截器
axios.interceptors.response.use((res:AxiosResponse)=>{
    return res
    
},err=>{
    return Promise.reject(err)
})

// export default axios

//如何去定义传入参数类型或返回的类型 unknown未知类型
interface IHTTP{
    request<T>(method:string,url:string,params?:unknown):Promise<T>
}

//复用接口类型
const http:IHTTP ={
    request:(method,url,params)=>
        axios({
            method:method,
            url:url,
            data:params
        })
}

export default http