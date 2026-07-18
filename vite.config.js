import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

const ssrEntry = 'resources/js/ssr.tsx';

/**
 * Some Windows/npm + Vite 5 setups resolve `vite build --ssr` as an empty
 * entry string (""), which fails with: Could not resolve entry module "".
 * Coerce that case back to the real SSR entry.
 */
function fixEmptySsrEntry() {
    return {
        name: 'fix-empty-ssr-entry',
        config(config) {
            if (config.build?.ssr === '') {
                return { build: { ssr: ssrEntry } };
            }
        },
    };
}

export default defineConfig({
    plugins: [
        fixEmptySsrEntry(),
        laravel({
            input: 'resources/js/app.tsx',
            ssr: ssrEntry,
            refresh: true,
        }),
        react(),
    ],

    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import "resources/assets/scss/mixins";',
            },
        },
    },
});
