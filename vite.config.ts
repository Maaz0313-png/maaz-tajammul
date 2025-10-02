import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

// Disable wayfinder on Vercel/Azure builds (PHP not available during npm build)
const isVercel = process.env.VERCEL === '1';
const isAzure = process.env.WEBSITE_INSTANCE_ID !== undefined;
const isCloudBuild = isVercel || isAzure;

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        // Only run wayfinder locally where PHP is available
        ...(!isCloudBuild
            ? [
                  wayfinder({
                      formVariants: true,
                  }),
              ]
            : []),
    ],
    esbuild: {
        jsx: 'automatic',
    },
});
