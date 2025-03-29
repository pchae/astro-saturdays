// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
// Import /serverless for a Serverless SSR site
import vercelServerless from '@astrojs/vercel/serverless';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [
    react({
      include: ['**/react/*'],
    })
  ],
  vite: {
    plugins: [
      tailwindcss()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    define: {
      // Expose env variables to client-side code
      'import.meta.env.PUBLIC_SUPABASE_URL': 
        JSON.stringify(process.env.PUBLIC_SUPABASE_URL),
      'import.meta.env.PUBLIC_SUPABASE_ANON_KEY': 
        JSON.stringify(process.env.PUBLIC_SUPABASE_ANON_KEY),
      'import.meta.env.PUBLIC_API_URL':
        JSON.stringify(process.env.PUBLIC_API_URL)
    },
    // Add environment variables to server-side code
    envPrefix: ['PUBLIC_'],
    // Ensure environment variables are loaded early
    optimizeDeps: {
      include: ['@supabase/supabase-js']
    }
  }
});