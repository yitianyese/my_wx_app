import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import TalkView from '../views/TalkView.vue'
import TalkView2 from '../views/TalkView2.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: TalkView
  },
  {
    path: '/home',
    component: TalkView2
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
