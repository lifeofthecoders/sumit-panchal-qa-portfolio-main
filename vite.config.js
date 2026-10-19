import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/sumit-panchal-qa-portfolio-main/',
  plugins: [react(), tailwindcss()],
})