// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    ssgOptions: {
        // nested: /inmuebles → dist/inmuebles/index.html (necesario para Vercel static)
        dirStyle: 'nested',
        // mock evita errores de window/document durante SSR si algún módulo escapa a los guards
        mock: false,
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
        },
        fs: {
            strict: true,
            allow: ['./src', './node_modules', './public', './index.html'],
            deny: [
                '**/.git/**',
                '**/.env',
                '**/.env.*',
                '**/node_modules/.vite/**',
                '**/*.{crt,pem,key}'
            ]
        },
        hmr: {
            overlay: false
        }
    },
    build: {
        outDir: 'dist'
    },
    optimizeDeps: {
        exclude: [],
        entries: ['src/main.jsx']
    }
});