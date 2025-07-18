// ignore this part when uploading to github, remove all config code
// baseUrl changed to "./" when uploading to github
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import viteCompression from 'vite-plugin-compression';
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig((config) => {
  const urlJsonStr = JSON.parse(fs.readFileSync("baseUrl.json", "utf8"));
  let baseUrl = urlJsonStr[config.mode];

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
    base: baseUrl,
    define: {
      'process.env': {
        BUILD_ENV: config.mode,
        VUE_APP_PUBLIC_PATH: baseUrl
      },
    },
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
          }
        }
      }
    }
  }
})
