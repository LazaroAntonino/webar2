import { ViteReactSSG } from 'vite-react-ssg'
import './index.css'
import { routes } from './routes'
import { fetchAllInmuebles } from './lib/fetchInmuebles'
import { setSsgInmuebles } from './lib/ssgStore'

export const createRoot = ViteReactSSG(
  { routes },
  async ({ initialState }) => {
    // Durante el build SSG, precarga inmuebles — tanto para initialState (cliente)
    // como para el módulo ssgStore (accesible al InmueblesProvider durante render SSR)
    if (typeof window === 'undefined') {
      try {
        const inmuebles = await fetchAllInmuebles()
        initialState.inmuebles = inmuebles
        setSsgInmuebles(inmuebles)
      } catch (e) {
        console.warn('[SSG] No se pudieron precargar los inmuebles:', e.message)
        initialState.inmuebles = []
        setSsgInmuebles([])
      }
    }
  },
  { rootContainerId: 'root' }
)
