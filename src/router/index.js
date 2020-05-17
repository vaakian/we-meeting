import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import RoomIndex from '../views/room/Index'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/room/:room',
    name: 'room',
    component: RoomIndex,
    props: true,
    beforeEnter: (to, from, next) => {
      if (!store.getters.getState.name) {
        next({
          name: 'home',
          query: {
            room: to.params.room
          }
        })
      }
      next()
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
export default router;