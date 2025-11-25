import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig((config) => {
  return {
    plugins: [
      vue(),
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      })
    ],
    base: "./",
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            "dynamsoftChunks": [
              "dynamsoft-barcode-reader-bundle",
            ],
            "otherChunks": [
              "jszip",
              "clipboard",
              "vue",
              "pinia",
              "ant-design-vue",
              "vue-router"
            ]
          },
          entryFileNames: "js/[name]-[hash].js",
          chunkFileNames: "js/[name]-[hash].js",
          assetFileNames: (assets) => {
            if (/\.(css)$/.test(assets.names?.[0] ?? "")) {
              return "css/[name]-[hash][extname]";
            }
            if (/\.(png|jpg|jpeg|gif|svg)$/.test(assets.names?.[0] ?? "")) {
              return "images/[name]-[hash][extname]";
            }
            if (/\.(woff2?|ttf|eot)$/.test(assets.names?.[0] ?? "")) {
              return "fonts/[name]-[hash][extname]";
            }
            return "assets/[name]-[hash][extname]";
          },
        },
      }
    }
  }
})
