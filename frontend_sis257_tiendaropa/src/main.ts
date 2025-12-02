import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Toasts from '@/components/ui/Toasts.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Mount toast container as a global component instance
const toastRoot = document.createElement('div')
document.body.appendChild(toastRoot)
createApp(Toasts).mount(toastRoot)

app.mount('#app')

// Initialize feather icons after Vue mounts
declare global {
  interface Window {
    feather: any;
  }
}

router.afterEach(() => {
  setTimeout(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, 100);
})
