import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cast process to any to avoid "Property 'cwd' does not exist on type 'Process'" error
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // This allows the code to access process.env.API_KEY in the browser
      // We use || '' to ensure it doesn't become undefined in the build output
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  };
});