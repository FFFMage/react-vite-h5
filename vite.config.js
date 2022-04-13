import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import styleImport from 'vite-plugin-style-import'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    styleImport({
      libs: [
        {
          libraryName: 'zarm',
          esModule: true,
          resolveStyle: (name) => {
            return `zarm/es/${name}/style/css`;
          }
        },
      ]
    })
  ],
  css: {
    modules: {
      // css变量格式名转换
      localsConvention: 'dashesOnly'
    },
    preprocessorOptions: {
      less: {
        // 支持内嵌JavaScript
        javascriptEnabled: true,
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7001/api/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''), // 将api 替换为空
      },
      '/public': {
        target: 'http://localhost:7001/',
        changeOrigin: true,
      },
    },
    host: '0.0.0.0'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'utils': path.resolve(__dirname, 'src/utils'),
      'network': path.resolve(__dirname, 'src/network'),
    }
  }
})
