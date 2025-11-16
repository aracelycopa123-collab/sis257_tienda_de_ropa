import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

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
