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
        // Inyecta los datos de inmuebles en el HTML para evitar hydration mismatch.
        // vite-react-ssg 0.9.x NO serializa initialState automáticamente al HTML,
        // por eso lo hacemos aquí manualmente.
        onPageRendered: (route, html, appCtx) => {
            const inmuebles = appCtx?.initialState?.inmuebles;
            if (Array.isArray(inmuebles) && inmuebles.length > 0) {
                // Escapar </script> para evitar inyección HTML (e.g. en campo descripcion)
                const safeJson = JSON.stringify(inmuebles).replace(/<\/script>/gi, '<\\/script>');
                const script = `<script>window.__SSG_INMUEBLES__=${safeJson}</script>`;
                return html.replace('</head>', `${script}</head>`);
            }
            return html;
        },
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