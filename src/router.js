import { createRouter, createWebHistory } from 'vue-router'
import Accueil from './components/Accueil.vue'
import Map3D from './components/Map3D.vue'

const routes = [
  {
    path: '/',
    name: 'Accueil',
    component: Accueil
  },
  {
    path: '/map',
    name: 'Map3D',
    component: Map3D
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
