import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import ClearanceView from '@/views/ClearanceView.vue'
import T86infoView from '@/views/T86infoView.vue'

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
    path: '/index',
    name: 'index',
    component:() => import('../views/Layout.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
