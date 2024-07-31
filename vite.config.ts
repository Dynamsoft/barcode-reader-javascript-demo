import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig((config) => {
  return {
    plugins: [
      vue()
    ],
    base: "./",
    define: {
      'process.env': {
        BUILD_ENV: config.mode,
        VUE_APP_PUBLIC_PATH: "./"
      },
    }
  }
})
