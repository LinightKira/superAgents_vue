import { createRouter,createWebHistory,RouteRecordRaw}from 'vue-router'

//RouteRecordRaw 内置的类型接口
const routers:Array<RouteRecordRaw> = [
   {
       path:'/',
       redirect:'/home'
    //    component:()=>import('../views/Login.vue')
   },
   {
       path:'/home',
       name:'home',
       component:()=>import('../views/index.vue'),
       children:[
        {
            path: '/newtask',
            name: 'newtask',
            component: () => import('../views/newTask.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/login.vue')
        },
        {
            path: '/agentdetail/:id?',
            name: 'agentdetail',
            component: () => import('../views/agentDetail.vue')
        },
        {
            path: '/assistants',
            name: 'assistants',
            component: () => import('../views/assistants.vue')
        }
    ]
   },

   {
    path: '/examples',
    name: 'examples',
    component: () => import('../components/examples/base_button.vue')
  },
]



const router = createRouter({
   history:createWebHistory(),
   routes:routers
});

export default router




