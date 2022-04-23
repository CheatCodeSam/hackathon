import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: true,
        hmr: {
            clientPort: 80,
        },
    },
    publicDir: "publicDir",
    plugins: [react()],
})
