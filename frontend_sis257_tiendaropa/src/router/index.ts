import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores'
import { getTokenFromLocalStorage } from '@/helpers'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/cuenta',
      name: 'cuenta',
      component: () => import('../views/CuentaView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/categorias',
      name: 'categorias',
      component: () => import('../views/CategoriasView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/productos',
      name: 'productos',
      component: () => import('../views/ProductosView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/colores',
      name: 'colores',
      component: () => import('../views/ColoresView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: () => import('../views/ClientesView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/ventas',
      name: 'ventas',
      component: () => import('../views/VentasView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/mis-pedidos',
      name: 'mis-pedidos',
      component: () => import('../views/MisPedidosView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/no-autorizado',
      name: 'no-autorizado',
      component: () => import('../views/NoAutorizadoView.vue'),
    },
  ],
})

// Helper para verificar si es admin
function isAdminRole(role: string | null): boolean {
  if (!role) return false
  const regex = /admin|administrador|super/i
  return regex.test(role)
}

// Guard de navegación - protege rutas específicas
router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const token = getTokenFromLocalStorage()
  const role = localStorage.getItem('role') || authStore.role

  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!token) {
      if (authStore) authStore.logout()
      authStore.returnUrl = to.fullPath
      return '/login'
    }
  }

  // Si la ruta requiere ser admin
  if (to.meta.requiresAdmin) {
    if (!isAdminRole(role)) {
      return '/no-autorizado'
    }
  }
})

export default router
