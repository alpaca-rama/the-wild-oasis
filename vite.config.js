import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://temp.weve-got-it.co.za',
  plugins: [react()],
})
