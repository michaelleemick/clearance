import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import ClearanceView from '@/views/ClearanceView.vue'
import T86infoView from '@/views/T86infoView.vue'
import Login from '@/views/Login.vue'
import { getCache } from '@/common/storage'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'clearance',
    component: ClearanceView
  },
  {
    path: '/t86info',
    name: 't86info',
    component : T86infoView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path:'/login',
    name:'login',
    component: Login,
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(( to : any, from : any, next : any ) =>{
  const userInfo = getCache('userInfo')
  if( userInfo || to.name === 'login'){
    next()
  }else{
    next({name : 'login'})
  }
})
export default router
