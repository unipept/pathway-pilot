// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        children: [
            { path: '', component: () => import('@/views/HomeView.vue') },
            { path: 'single', component: () => import('@/views/TaxonComparisonView.vue') },
            { path: 'multi', component: () => import('@/views/SampleComparisonView.vue') }
        ]
    },
    {
        path: '/test',
        name: 'Test',
        component: () => import('@/views/SampleComparisonView.vue')
    }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
