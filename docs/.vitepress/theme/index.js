import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { onMounted, watchEffect } from 'vue'
import { useRouter } from 'vitepress'
import './style.css'

export default {
  extends: DefaultTheme,
  setup() {
    const router = useRouter()
    
    const initZoom = () => {
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          const images = document.querySelectorAll('.vp-doc img')
          
          if (images.length > 0) {
            mediumZoom(images, {
              background: 'rgba(0, 0, 0, 0.95)',
              margin: 20,
              scrollOffset: 40,
              container: null,
              template: null
            })
          }
        }, 100)
      }
    }
    
    // Executar na primeira montagem
    onMounted(() => {
      initZoom()
    })
    
    // Reinicializar quando a rota mudar (para navegação entre páginas)
    watchEffect(() => {
      router.route.path
      initZoom()
    })
  }
}
