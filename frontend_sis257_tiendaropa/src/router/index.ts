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
      path: '/perfil',
      name: 'perfil',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/direcciones',
      name: 'direcciones',
      component: () => import('../views/DireccionesView.vue'),
    },
    {
      path: '/tarjetas',
      name: 'tarjetas',
      component: () => import('../views/TarjetasView.vue'),
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AutenticacionView.vue'),
    },
    {
      path: '/categorias',
      name: 'categorias',
      component: () => import('../views/CategoriasView.vue'),
    },
    {
      path: '/productos',
      name: 'productos',
      component: () => import('../views/ProductosView.vue'),
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: () => import('../views/ClientesView.vue'),
    },
    {
      path: '/ventas',
      name: 'ventas',
      component: () => import('../views/VentasView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
    },
  ],
})

// Guard de navegación - protege rutas específicas
router.beforeEach(async (to) => {
  // Páginas que requieren autenticación
  const protectedPages: string[] = [
    '/dashboard',
    '/categorias',
    '/productos',
    '/clientes',
    '/ventas',
    '/perfil'
  ]

  const adminOnly: string[] = ['/dashboard', '/categorias', '/productos', '/clientes', '/ventas']

  const authRequired = protectedPages.some(page => to.path.startsWith(page))
  const adminRequired = adminOnly.some(page => to.path.startsWith(page))
  const authStore = useAuthStore()

  // If route requires auth but no token -> redirect to login
  if (authRequired && !getTokenFromLocalStorage()) {
    if (authStore) authStore.logout()
    authStore.returnUrl = to.fullPath
    return '/login'
  }

  // If route is admin-only, ensure user's role is admin (accept common variants)
  if (adminRequired) {
    const roleCandidates = [authStore.role, localStorage.getItem('role')]
    const u: any = authStore.user
    if (u && typeof u === 'object') {
      roleCandidates.push(u.rol || u.role || null)
      if (u.usuario && typeof u.usuario === 'object') roleCandidates.push(u.usuario.rol || u.usuario.role || null)
    }
    const isAdmin = roleCandidates.some(r => !!r && /admin|administrador|super/i.test(String(r)))
    if (!isAdmin) {
      return '/'
    }
  }
})

export default router
