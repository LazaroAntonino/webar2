// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
        // Restringir acceso del servidor solo a carpetas permitidas
        fs: {
            strict: true,
            allow: ['./src', './node_modules', './public', '.'],
            deny: ['.git', '.env', '.env.*', '**/node_modules/.vite/**']
        }
    },
    build: {
        outDir: 'dist'
    },
    // Excluir carpetas problemáticas del análisis de dependencias
    optimizeDeps: {
        exclude: [],
        // Forzar que solo analice dentro de src
        entries: ['src/main.jsx']
    }
});