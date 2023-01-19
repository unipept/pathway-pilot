// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    //component: () => import('@/views/HomeView.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/HomeView.vue'),
      },
      {
        path: 'selection',
        name: 'selection',
        component: () => import('@/views/SelectionView.vue'),
      },
      {
        path: 'visualisation',
        name: 'visualisation',
        component: () => import('@/views/VisualisationView.vue'),
      
      },
      {
        path: 'bubble',
        name: 'Bubble',
        component: () => import('@/views/BubbleView.vue'),
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
